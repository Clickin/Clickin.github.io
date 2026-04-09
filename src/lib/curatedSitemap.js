import { normalizePostSlug } from "./slug.ts";

const CURATED_HUB_PATHS = ["/", "/blog/", "/projects/"];

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

export function buildCuratedSitemapEntries({ site, postEntries, extraPaths = [] }) {
  const entries = [];
  const seen = new Set();

  function addEntry(path, lastmod) {
    const loc = toAbsoluteUrl(site, path);
    if (seen.has(loc)) return;
    seen.add(loc);
    entries.push(lastmod ? { loc, lastmod } : { loc });
  }

  for (const path of CURATED_HUB_PATHS) addEntry(path);
  for (const path of extraPaths) addEntry(path);
  for (const post of postEntries) {
    addEntry(`/blog/${encodeURIComponent(normalizePostSlug(post.slug))}/`, post.lastmod);
  }

  return entries;
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
