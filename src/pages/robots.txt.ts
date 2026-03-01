import type { APIRoute } from "astro";

const getRobotsTxt = (sitemapUrl: URL, sitemapIndexUrl: URL) => `User-agent: *
Allow: /

Sitemap: ${sitemapUrl.href}
Sitemap: ${sitemapIndexUrl.href}
`;

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error("The robots.txt route requires `site` in astro.config.");
  }

  const siteWithBase = new URL(import.meta.env.BASE_URL, site);
  const sitemapUrl = new URL("sitemap.xml", siteWithBase);
  const sitemapIndexUrl = new URL("sitemap-index.xml", siteWithBase);

  return new Response(getRobotsTxt(sitemapUrl, sitemapIndexUrl), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
