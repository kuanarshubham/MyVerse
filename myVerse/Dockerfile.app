ARG APP_NAME

# 1. --- Builder Stage ---
FROM node:18-alpine AS builder
ARG APP_NAME
WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm exec turbo run build --filter=${APP_NAME}


# 2. --- Production Stage ---
FROM node:18-alpine
WORKDIR /app
ARG APP_NAME

RUN npm install -g pnpm

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

COPY --from=builder /app/apps/${APP_NAME}/dist ./dist

COPY --from=builder /app/packages/db/dist /app/packages/db/dist
COPY --from=builder /app/packages/db/package.json /app/packages/db/package.json

# --- THIS IS THE FIX ---
# Copy the prisma schema so the migrate command can find it.
COPY --from=builder /app/packages/db/prisma /app/packages/db/prisma

EXPOSE 3000
CMD ["node", "dist/index.js"]