FROM node:24-bookworm-slim AS build
WORKDIR /workspace

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM ghcr.io/beeman/static-server:latest
ENV SPA=false
COPY --from=build /workspace/dist /workspace/app
