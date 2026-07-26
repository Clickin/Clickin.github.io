import type { APIRoute } from "astro";
import { renderSitemapIndexXml } from "../lib/curatedSitemap.js";

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error("The sitemap.xml route requires `site` in astro.config.");
  }

  const root = new URL(import.meta.env.BASE_URL, site);
  const entries = [
    { loc: new URL("sitemaps/blog.xml", root).href },
    { loc: new URL("sitemaps/projects.xml", root).href },
  ];

  return new Response(renderSitemapIndexXml(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
