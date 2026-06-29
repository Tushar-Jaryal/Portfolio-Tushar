import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";

// Astro 5: keep output 'static' (default) and opt specific routes into
// on-demand rendering with `export const prerender = false`.
// The Node adapter makes those routes server-rendered; the build emits
// both dist/client (static) and dist/server/entry.mjs (SSR).
export default defineConfig({
  site: "https://tusharjaryal.in",
  output: "static",
  adapter: node({ mode: "standalone" }),
  integrations: [preact(), sitemap()],
  // Note: do NOT add @sanity/* to vite.ssr.noExternal — these are CommonJS
  // packages and force-bundling them breaks with "require is not defined".
  // Leaving them external lets Node load them natively (works in dev + the
  // standalone build, since node_modules ships to the server).
});
