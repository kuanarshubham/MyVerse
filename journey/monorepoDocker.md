# Monorepo Docker Deployment: A Deep Dive

This document outlines the architecture, setup, and debugging journey of this project. It serves as a guide for running the application and as a technical explanation of the key decisions made during its development.

## Architecture Overview

This project is a monorepo containing multiple services that are orchestrated using Docker Compose.

-   **`http_server`**: An Express.js application serving standard API requests.
-   **`ws_server`**: A WebSocket server for real-time communication.
-   **`db`**: A PostgreSQL database that serves as the single source of truth.
-   **`@repo/db`**: A shared internal package for the Prisma client, ensuring consistent database access across all services.

---

## Why a Single `Dockerfile.app`?

A key architectural decision was to use a single, reusable `Dockerfile.app` in the project root instead of individual Dockerfiles in each service's directory (`apps/http`, `apps/ws`). This approach follows the **D.R.Y. (Don't Repeat Yourself)** principle and offers several significant advantages:

1.  **Maintainability**: If you need to update the Node.js version, change a base dependency, or add a new build step, you only have to do it in **one file**. With individual Dockerfiles, you would need to find and update every single one, which is tedious and prone to errors.

2.  **Consistency**: Using a single file guarantees that every single service is built in the **exact same environment** with the **exact same logic**. This eliminates the risk of subtle bugs caused by one service being built differently from another.

3.  **Simplicity**: It keeps the project cleaner. The logic for building an application is centralized, making the overall structure easier to understand and manage. We use **build arguments** to tell this single Dockerfile *which* specific application (`http` or `ws`) it should build at any given time.

---

## The `Dockerfile.app` Explained

Our final Dockerfile uses a **multi-stage build**, a powerful feature that helps create small, secure, and efficient production images. It's split into two main parts: the "builder" stage and the "production" stage.

```dockerfile
# This declares a build-time variable that we can pass from our
# docker-compose.yml file. It's how we tell the Dockerfile
# whether to build the 'http' or 'ws' application.
ARG APP_NAME

# --- Stage 1: The "Builder" ---
# We start with a full Node.js image and name this stage "builder".
# This stage is a temporary, heavy-duty workshop where we have all the
# tools we need (like TypeScript, Turbo, Prisma) to build our app.
# Using "alpine" makes the initial download smaller.
FROM node:18-alpine AS builder

# ***IMPORTANT***: Each stage in a multi-stage build is a new, separate
# environment. The ARG must be re-declared here so its value is
# available within this "builder" stage. Without this line,
# ${APP_NAME} would be empty in the `turbo run build` command below.
ARG APP_NAME
WORKDIR /app

# Install pnpm globally within our workshop.
RUN npm install -g pnpm

# Copy only the package manager files first. Docker caches layers,
# so this step will only re-run if these specific files change.
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./

# This is a critical step. We copy ALL our source code (apps, packages)
# into the builder *before* installing dependencies. This ensures that
# our `schema.prisma` file is present when the `postinstall` script
# runs `prisma generate`.
COPY . .

# Run the full install. This also triggers the `postinstall` script in our
# root package.json, which automatically runs `prisma generate`.
RUN pnpm install --frozen-lockfile

# This is the main build command. We use Turborepo (`turbo run build`)
# because it understands our monorepo's dependency graph. The `--filter`
# flag tells Turbo to build only the target application and any of its
# internal dependencies (like `@repo/db`).
RUN pnpm exec turbo run build --filter=${APP_NAME}


# --- Stage 2: The Final "Production" Image ---
# We start again from a fresh, clean Node.js image. This final image
# will be lean and only contain what's absolutely necessary to RUN the app.
FROM node:18-alpine
WORKDIR /app

# We re-declare the ARG one last time so it's available in this final stage.
ARG APP_NAME

# We install pnpm here as well. This doesn't add much size but gives us
# the ability to run management commands (like `prisma migrate`) inside
# the final running container using `docker compose exec`.
RUN npm install -g pnpm

# The `COPY --from=builder` command is the magic of multi-stage builds.
# It lets us selectively copy files from our temporary "builder" workshop
# into our clean final image.

# Copy the production node_modules and the root package.json.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy the compiled JavaScript for the target application.
COPY --from=builder /app/apps/${APP_NAME}/dist ./dist

# CRITICAL STEP: Copy the compiled code and package.json for our shared
# `@repo/db` package. This ensures that Node.js can find it at runtime.
COPY --from=builder /app/packages/db/dist /app/packages/db/dist
COPY --from=builder /app/packages/db/package.json /app/packages/db/package.json

# CRITICAL STEP: Copy the prisma directory, including the schema. This
# is required so we can run migration commands inside the container.
COPY --from=builder /app/packages/db/prisma /app/packages/db/prisma

# Expose the application port.
EXPOSE 3000

# The command to run when the container starts.
CMD ["node", "dist/index.js"]
```

---

## The Debugging Journey: A Summary

Our path from a broken setup to a working application involved debugging issues at every layer of the stack.

### Phase 1: Fixing the Docker Build
The initial build failed because the Dockerfile wasn't correctly configured for a monorepo.
* **Issues:** Incorrect file paths, missing `devDependencies` needed for compilation, and the `ARG` variable being out of scope.
* **Solution:** We created the unified `Dockerfile.app`, corrected the `pnpm install` command, and re-declared the `ARG` in each build stage.

### Phase 2: Solving TypeScript Compilation
Once the build started, the TypeScript compiler (`tsc`) began throwing errors.
* **Issues:** `tsc` couldn't find internal packages (`@repo/db`), and pnpm's strict, symlinked `node_modules` structure was confusing the compiler, leading to "Cannot find module" errors for external packages.
* **Solution:** We configured **TypeScript Project References** in our `tsconfig.json` files to create a dependency graph. We also added a `.npmrc` file with `shamefully-hoist=true`, which instructs pnpm to create a more traditional, flat `node_modules` folder, making all packages easily discoverable by the compiler.

### Phase 3: Fixing Runtime Crashes
The application would build and start, but crash immediately upon receiving a request.
* **Issues:** The final Docker image was missing the compiled JavaScript for the `@repo/db` package.
* **Solution:** We added `COPY` commands to our Dockerfile to bring the compiled shared package code into the final production image.

### Phase 4: The Prisma Migration Workflow
The final hurdle was database interaction. The application crashed because the database tables didn't exist, and our attempts to create them failed.
* **Issues:** The `prisma migrate` command failed because the `schema.prisma` file was missing from the final image, and we were using the wrong command (`dev` vs. `deploy`).
* **Solution:** We added the `prisma` directory to the final image and established the correct workflow:
    1.  **Locally:** Run `pnpm exec prisma migrate dev` to generate migration files.
    2.  **In Docker:** Run `docker compose exec <service> pnpm exec prisma migrate deploy` to apply those migrations.

---

## How to Run This Project

### Prerequisites
* Docker & Docker Compose
* Node.js & pnpm

### 1. Create Initial Migration
Before you build the Docker images, you need to generate the initial SQL migration files from your schema.
```bash
pnpm exec prisma migrate dev
```
When prompted, give the migration a name (e.g., `init`). This will create a `packages/db/prisma/migrations` folder.

### 2. Build and Run Containers
This command will build the images for `http_server` and `ws_server` and start all services in the background.
```bash
docker compose up --build -d
```

### 3. Apply Migrations to the Database
With the containers running, execute the `migrate deploy` command inside one of the services to build your database tables.
```bash
docker compose exec http_server pnpm exec prisma migrate deploy
```

### 4. Check the Status
You can view the logs to confirm everything is running correctly.
```bash
# Check the HTTP server logs
docker compose logs -f http_server

# Check the WebSocket server logs
docker compose logs -f ws_server
```
Your applications are now running and connected to a fully migrated database.