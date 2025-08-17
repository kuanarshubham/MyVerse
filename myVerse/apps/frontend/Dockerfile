FROM node:22-bookworm-slim

WORKDIR /frontend

COPY . .

RUN pnpm install

EXPOSE 5173

CMD [ "pnpm","run","dev" ]