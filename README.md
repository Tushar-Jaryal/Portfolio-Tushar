# portfolio-site

Tushar Jaryal's portfolio — **Astro** frontend + **Sanity** CMS, deployed to a
**self-hosted VPS** (Contabo, Ubuntu 24.04, Nginx) at **tusharjaryal.in**.
npm-workspaces monorepo with two apps.

```
portfolio-site/
├── apps/
│   ├── web/      # Astro site — static pages + SSR Home + /api endpoints
│   └── studio/   # Sanity Studio (the editing UI)
├── deploy/       # Nginx config, systemd unit, zero-downtime deploy.sh
└── package.json  # npm workspaces
```

## Architecture

Astro 5 with `output: 'static'` plus the `@astrojs/node` adapter. Most pages are
prerendered to static HTML; the Home page and the `/api/*` endpoints opt into
server rendering with `export const prerender = false`. The build emits both
`dist/client` (static assets) and `dist/server/entry.mjs` (the Node SSR runtime).

In production, Nginx serves `dist/client` directly and reverse-proxies `/`,
`/api/*`, and any on-demand route to the Node runtime listening on
`127.0.0.1:4321` (managed by the `portfolio` systemd service). TLS is terminated
with a Cloudflare Origin certificate at `/etc/ssl/tusharjaryal.in.{pem,key}`.

## Quick start (local)

```bash
npm install                 # installs both workspaces

# Website — runs on seed data until Sanity is configured
npm run dev                 # http://localhost:4321

# Studio (needs a Sanity project id)
cp apps/studio/.env.example apps/studio/.env   # fill SANITY_STUDIO_PROJECT_ID
npm run dev:studio          # http://localhost:3333
```

The website **builds and runs without Sanity** — `apps/web/src/data/seed.ts`
mirrors the original mockups and is used as a fallback. Once you set
`PUBLIC_SANITY_PROJECT_ID` (copy `apps/web/.env.example` → `apps/web/.env`) and
publish content, GROQ results take over automatically.

## Connecting Sanity

1. Create a project + `production` dataset at sanity.io/manage.
2. Put the project id in `apps/web/.env` and `apps/studio/.env`.
3. Add CORS origins for your dev URL and production domains.
4. Run the Studio, fill in the singletons (Site Settings, Home, About, …) and
   add Projects / Blog Posts.
5. Optionally configure a publish **webhook** → `https://tusharjaryal.in/api/rebuild`.

## Deploy

Everything needed lives in `deploy/`:

- `nginx-tusharjaryal.in.conf` — combined Nginx server config (SSR website +
  the preserved `vpn.tusharjaryal.in` proxy), using the Cloudflare Origin cert.
- `portfolio.service` — systemd unit running the Node SSR app as `www-data`.
- `deploy.sh` — zero-downtime release: build into a timestamped release under
  `/var/www/portfolio/releases/`, atomically promote via the `current` symlink,
  then reload systemd + Nginx.

The server keeps a git checkout at `/srv/portfolio-site` and runtime env at
`/var/www/portfolio/shared/.env`. After the first-time setup, deploying a new
version is just:

```bash
ssh tushar@tusharjaryal.in
cd /srv/portfolio-site && git pull
./deploy/deploy.sh
```

Secrets (`.env`) are intentionally **not** committed — they're delivered to the
server out of band and symlinked into each release.
