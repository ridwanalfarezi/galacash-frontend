FROM oven/bun:1-alpine AS base
WORKDIR /app

FROM base AS development-dependencies-env
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS production-dependencies-env
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

FROM base AS build-env
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
COPY . .
RUN bun run build

FROM base
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
COPY package.json bun.lock server.ts ./
EXPOSE 3000
CMD ["bun", "run", "start"]
