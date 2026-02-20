import type { APIRoute } from "astro";

const getRobotsTxt = (sitemapUrl: URL) => `User-agent: *
Allow: /

Sitemap: ${sitemapUrl.href}
`;

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error("The robots.txt route requires `site` in astro.config.");
  }

  const siteWithBase = new URL(import.meta.env.BASE_URL, site);
  const sitemapUrl = new URL("sitemap-index.xml", siteWithBase);

  return new Response(getRobotsTxt(sitemapUrl), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
