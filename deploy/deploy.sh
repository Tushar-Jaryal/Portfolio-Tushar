#!/usr/bin/env bash
# Zero-downtime release deploy for the Astro web app.
# Builds into an immutable timestamped release, then atomically promotes it.
# Run on the server from the repo checkout, or invoke over SSH from CI.
set -euo pipefail

APP_ROOT="/var/www/portfolio"          # holds releases/ + current symlink + shared/
REPO_DIR="${REPO_DIR:-/srv/portfolio-site}"   # git checkout of this monorepo
KEEP=5                                  # how many old releases to retain
TS="$(date +%Y%m%d-%H%M%S)"
RELEASE="$APP_ROOT/releases/$TS"

echo "▶ Building release $TS"
mkdir -p "$RELEASE" "$APP_ROOT/shared"

# Pull latest code (skip when not a git checkout — e.g. rsync-based deploys)
cd "$REPO_DIR"
if [ -d .git ]; then
  git pull --ff-only
else
  echo "  (no .git in $REPO_DIR — building from the source already present)"
fi

# Install + build the web app (build-time Sanity reads use useCdn:false — see src/lib/sanity.ts)
npm ci
npm run build --workspace apps/web

# Copy the build output (client + server together — one atomic unit)
cp -R apps/web/dist "$RELEASE/dist"

# Link shared env into the release
ln -sfn "$APP_ROOT/shared/.env" "$RELEASE/.env"

echo "▶ Promoting release (atomic symlink swap)"
ln -sfn "releases/$TS" "$APP_ROOT/current.next"
mv -Tf "$APP_ROOT/current.next" "$APP_ROOT/current"

echo "▶ Reloading services"
sudo systemctl reload-or-restart portfolio
sudo nginx -s reload

echo "▶ Pruning old releases (keeping $KEEP)"
cd "$APP_ROOT/releases"
ls -1dt */ | tail -n +$((KEEP + 1)) | xargs -r rm -rf

echo "✓ Deployed $TS"
