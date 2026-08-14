# portfolio-site

Tushar Jaryal's Payload CMS site, deployed to a self-hosted k3s cluster at
**studio.tusharjaryal.in** and **tusharjaryal.in**.

```
portfolio-site/
├── apps/
│   └── cms/    # Payload CMS (Next.js) — admin UI + public frontend
└── package.json
```

## Architecture

Payload CMS (Next.js) running as a single app that serves both the public
site and the `/admin` editing UI, backed by Postgres. Built into a container
image and deployed to the `project-studio` namespace on the k3s cluster;
Traefik routes both `studio.tusharjaryal.in` and `tusharjaryal.in` to the
same Payload Service by Host header.

## Quick start (local)

```bash
cd apps/cms
npm install
cp .env.example .env   # fill in DATABASE_URI, PAYLOAD_SECRET, etc.
npm run dev             # http://localhost:3000
```

## Deploy

CI/CD lives in `.gitlab-ci.yml`: pushes to `main` that touch `apps/cms/`
build a container image and roll it out via

```bash
kubectl set image deployment/payload app=$CMS_IMAGE:$CI_COMMIT_SHORT_SHA -n project-studio
kubectl rollout status deployment/payload -n project-studio --timeout=120s
```

Cluster-level resources (namespace, Postgres, backup CronJob) are managed
separately in the [infra](https://gitlab.com/tusharjaryal/infra) repo; see
its README for what it owns vs. what this repo's own CI owns.

Secrets (`.env`) are not committed — they're bootstrapped on the cluster as
a Kubernetes Secret (`postgres-credentials`) referenced by name.
