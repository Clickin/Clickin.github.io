import type { APIRoute } from "astro";


export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error("The robots.txt route requires `site` in astro.config.");
  }

  const siteWithBase = new URL(import.meta.env.BASE_URL, site);
  const sitemapUrl = new URL("sitemap.xml", siteWithBase);

  return new Response(`User-agent: *
Allow: /

Sitemap: ${sitemapUrl.href}
`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
