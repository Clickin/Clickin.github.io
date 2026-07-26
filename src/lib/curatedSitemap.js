import { normalizePostSlug } from "./slug.ts";

const BLOG_HUB_PATHS = ["/", "/blog/"];

function normalizePath(path) {
  if (!path.startsWith("/")) return normalizePath(`/${path}`);
  return path.endsWith("/") ? path : `${path}/`;
}

function toAbsoluteUrl(site, path) {
  return new URL(normalizePath(path), site).href;
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function buildBlogSitemapEntries({ site, postEntries }) {
  const entries = BLOG_HUB_PATHS.map((path) => ({ loc: toAbsoluteUrl(site, path) }));

  for (const post of postEntries) {
    entries.push({
      loc: toAbsoluteUrl(site, `/blog/${encodeURIComponent(normalizePostSlug(post.id))}/`),
      lastmod: post.lastmod,
    });
  }

  return entries;
}

export function buildProjectSitemapEntries({ site, projects }) {
  return [
    { loc: toAbsoluteUrl(site, "/projects/") },
    ...projects.map((project) => ({ loc: toAbsoluteUrl(site, project.path) })),
  ];
}

export function renderSitemapXml(entries) {
  const body = entries
    .map(({ loc, lastmod }) => {
      const parts = [`<loc>${escapeXml(loc)}</loc>`];
      if (lastmod) parts.push(`<lastmod>${escapeXml(lastmod)}</lastmod>`);
      return `<url>${parts.join("")}</url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`;
}

export function renderSitemapIndexXml(entries) {
  const body = entries
    .map(({ loc }) => `<sitemap><loc>${escapeXml(loc)}</loc></sitemap>`)
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>`;
}
