# cms

Payload CMS app for tusharjaryal.in — Next.js, serving both the public site
(`(frontend)`) and the `/admin` editing UI (`(payload)`), backed by Postgres.
See the [repo root README](../../README.md) for architecture, deploy, and
where this fits in the cluster.

## Local dev

```bash
cp .env.example .env   # fill in DATABASE_URI, PAYLOAD_SECRET
npm install
npm run dev             # http://localhost:3000
```

Requires a real Postgres database — there's no local schema-push shortcut
here (see [Migrations](#migrations) below), so point `DATABASE_URI` at an
empty local/dev Postgres instance and run `npm run payload migrate` once
before first use.

## Collections

`Users`, `Media`, `Projects`, `Categories`, `Posts`, `Recommenders`,
`Recommendations` — see `src/collections/`. Site content (nav, hero, etc.)
lives in the globals under `src/globals/`.

## Migrations

Schema changes (adding/removing fields, enabling `versions.drafts`, etc.)
require an explicit migration — this project uses Postgres with committed
migration files (`src/migrations/`), not Payload's dev-mode schema push.

```bash
npm run payload migrate:create <name>   # generate, after changing a collection/global
npm run payload migrate                 # apply
npm run payload migrate:status          # check what's pending
```

**Nothing runs migrations automatically.** The Dockerfile builds a Next.js
`standalone` output for the runtime image, and Next's output file tracing
prunes `node_modules/payload/dist/bin` (the CLI) out of that build — so
`payload migrate` can't even run from the deployed container. GitLab CI's
`deploy-cms` job only does `kubectl set image` + rollout, nothing more.

**In practice: after any schema-changing change, run `payload migrate`
against production yourself** (from a full checkout with `node_modules`
installed — not the deployed image), before or immediately after the
GitLab pipeline deploys the new code. Get `DATABASE_URI` from the
`payload-env` secret and reach Postgres via `kubectl -n project-studio
port-forward svc/postgres 5433:5432`. If you skip this, any endpoint
touching the changed collection will 500 until the migration is applied —
this bit us once already (enabling drafts on `Posts` without migrating
first broke `/api/posts` in production for a few minutes).

## Rich text / custom admin components

Whenever a field's admin component set changes — a new `richText` field,
a new block in `BlocksFeature`, any field using a custom component — you
must regenerate the import map, or the admin will silently fail to render
just that field (no visible field, just a
`PayloadComponent not found in importMap` warning in server logs):

```bash
npm run generate:importmap
```

Commit the resulting `src/app/(payload)/admin/importMap.js`. This is easy
to miss because everything *else* on the form still renders fine — only
the field depending on the missing component silently disappears.
