import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getAllPosts } from "../lib/queries";

export const prerender = false;

export async function GET(context: APIContext) {
  const posts = (await getAllPosts()) ?? [];

  return rss({
    title: "Tushar Jaryal — Blog",
    description: "Notes & field reports on machine learning in production.",
    site: context.site ?? "https://tusharjaryal.in",
    items: posts.map((p) => ({
      title: p.title,
      description: p.excerpt,
      pubDate: p.date ? new Date(p.date) : undefined,
      link: `/blog/${p.slug}`,
    })),
  });
}
