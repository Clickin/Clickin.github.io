import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { buildCuratedSitemapEntries, renderSitemapXml } from "../lib/curatedSitemap.js";
import { isPostVisible } from "../lib/postVisibility";

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error("The sitemap.xml route requires `site` in astro.config.");
  }

  const posts = await getCollection("posts", ({ data }) => isPostVisible(data));
  const entries = buildCuratedSitemapEntries({
    site,
    postEntries: posts.map((post) => ({
      slug: post.slug,
      lastmod: (post.data.updated ?? post.data.date).toISOString(),
    })),
  });

  return new Response(renderSitemapXml(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
