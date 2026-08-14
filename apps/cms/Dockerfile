# Adapted from Payload's official template Dockerfile
# (github.com/payloadcms/payload/blob/main/templates/website/Dockerfile),
# with the port changed to 8080 to match how portfolio/studio are already
# deployed in this cluster. Requires `output: 'standalone'` in next.config —
# NOT set by create-payload-app 3.87.1's default withPayload() wrapper as of
# this build; add it manually if regenerating the app.
FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
# npm ci fails here: npm flags @payloadcms/richtext-lexical's optional peers
# (yjs, monaco-editor, etc., used only for collab/other unused features) as
# lock-file mismatches even when the lock file is freshly generated. npm
# install resolves the same tree without the strict optional-peer check.
RUN npm install

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Payload needs a real DB connection string + secret to build (it resolves
# payload.config.ts at build time). Dummy values are fine here — nothing in
# the build step touches the actual database.
ENV DATABASE_URI=postgres://build:build@localhost:5432/build
ENV PAYLOAD_SECRET=build-time-placeholder-not-used-at-runtime
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 payload

COPY --from=builder /app/public ./public
RUN mkdir .next && chown payload:nodejs .next
COPY --from=builder --chown=payload:nodejs /app/.next/standalone ./
COPY --from=builder --chown=payload:nodejs /app/.next/static ./.next/static

# Local upload storage — matches the payload-media PVC mounted at /app/media
# in k8s/20-payload.yaml.
RUN mkdir -p /app/media && chown payload:nodejs /app/media

USER payload
EXPOSE 8080
ENV PORT=8080
CMD HOSTNAME="0.0.0.0" node server.js
