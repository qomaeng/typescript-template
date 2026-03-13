###################
#       Deps
###################
FROM node:24-alpine AS deps

WORKDIR /usr/src/template

ENV PNPM_HOME="/pnpm"
ENV PNPM_STORE_DIR="/pnpm/store"
RUN corepack enable

COPY pnpm-lock.yaml package.json ./

RUN --mount=type=cache,id=pnpm-store-node24,target=/pnpm/store,sharing=locked \
    pnpm fetch

###################
#     Builder
###################
FROM deps AS builder

WORKDIR /usr/src/template

COPY . .

RUN --mount=type=cache,id=pnpm-store-node24,target=/pnpm/store,sharing=locked \
    pnpm install --offline --frozen-lockfile

RUN pnpm build

RUN pnpm prune --prod

###################
#   Application
###################
FROM node:24-alpine

WORKDIR /app

COPY --from=builder --chown=1000:1000 /usr/src/template/package.json ./
COPY --from=builder --chown=1000:1000 /usr/src/template/node_modules ./node_modules
COPY --from=builder --chown=1000:1000 /usr/src/template/dist ./dist

ENV NODE_ENV=production

USER 1000:1000

CMD ["node", "./dist/main.js"]
