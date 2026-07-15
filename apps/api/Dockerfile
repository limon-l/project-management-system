FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/

RUN pnpm install --frozen-lockfile

COPY packages/shared packages/shared
RUN pnpm --filter @boardflow/shared build

COPY apps/api apps/api
RUN pnpm --filter @boardflow/api build

EXPOSE 3001
CMD ["node", "apps/api/dist/index.js"]
