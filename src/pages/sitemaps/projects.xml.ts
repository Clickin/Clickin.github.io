import type { APIRoute } from "astro";
import { projects } from "../../data/projects";
import { buildProjectSitemapEntries, renderSitemapXml } from "../../lib/curatedSitemap.js";

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error("The project sitemap route requires `site` in astro.config.");
  }

  const entries = buildProjectSitemapEntries({ site, projects });

  return new Response(renderSitemapXml(entries), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
