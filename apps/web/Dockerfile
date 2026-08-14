# Build context is the repo root (apps/web is an npm workspace member and
# needs the root package.json/lockfile to resolve deps) — build with:
#   docker build -f apps/web/Dockerfile .
# Runtime matches how this deployment already runs in k3s (project-portfolio/portfolio):
# node dist/server/entry.mjs on :8080, with node_modules kept external
# (see astro.config.mjs — @sanity/* is CJS and breaks if force-bundled).
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/studio/package.json apps/studio/package.json
RUN npm ci

FROM base AS builder
WORKDIR /app
# Copy the whole /app tree from deps, not just /app/node_modules: npm
# workspaces nests a dep in apps/web/node_modules instead of hoisting to
# root/node_modules whenever there's a version conflict blocking hoisting
# (e.g. @payloadcms/richtext-lexical here) — copying only the root
# node_modules silently drops those, and Rollup fails to resolve them.
COPY --from=deps /app ./
COPY . .
RUN npm run build --workspace apps/web

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 astro

COPY --from=builder --chown=astro:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=astro:nodejs /app/apps/web/dist ./dist

USER astro
EXPOSE 8080
ENV HOST=0.0.0.0
ENV PORT=8080
CMD ["node", "dist/server/entry.mjs"]
