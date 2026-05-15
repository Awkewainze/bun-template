# ---- Stage 1: production dependencies ----
FROM oven/bun:1.3-debian AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# ---- Stage 2: generate Prisma client ----
# Needs devDependencies for the prisma CLI, which isn't in package.json deps
FROM oven/bun:1.3-debian AS builder
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN bunx --bun prisma generate

# ---- Stage 3: runtime ----
FROM oven/bun:1.3-debian AS runner
WORKDIR /app
ENV NODE_ENV=production

# Production node_modules (no devDependencies)
COPY --from=deps /app/node_modules ./node_modules
# Generated Prisma client (built without a live DB)
COPY --from=builder /app/generated ./generated

# Source and config
COPY src ./src
COPY prisma ./prisma
COPY package.json bun.lock bunfig.toml tsconfig.json prisma.config.ts bun-env.d.ts ./

EXPOSE 3000

# Migrate first, then start. Bun bundles index.html + frontend.tsx at startup.
CMD ["sh", "-c", "bunx --bun prisma migrate deploy && bun src/server.ts"]
