import fs from "node:fs";
import path from "node:path";

const distDir = path.join(process.cwd(), "dist");
const sitemapIndexPath = path.join(distDir, "sitemap-index.xml");
const sitemapAliasPath = path.join(distDir, "sitemap.xml");

if (fs.existsSync(sitemapAliasPath)) {
  console.log("[sitemap-alias] skipped: sitemap.xml already exists.");
  process.exit(0);
}

if (!fs.existsSync(sitemapIndexPath)) {
  console.log("[sitemap-alias] skipped: sitemap-index.xml was not found.");
  process.exit(0);
}

const sitemapIndexXml = fs.readFileSync(sitemapIndexPath, "utf8");
const locMatches = [...sitemapIndexXml.matchAll(/<loc>([^<]+)<\/loc>/g)];
const childSitemapLocs = locMatches.map((match) => match[1].trim()).filter(Boolean);

let sourcePath = sitemapIndexPath;

if (childSitemapLocs.length === 1) {
  try {
    const childUrl = new URL(childSitemapLocs[0]);
    const childRelativePath = childUrl.pathname.replace(/^\//, "");
    const childSitemapPath = path.join(distDir, childRelativePath);
    if (fs.existsSync(childSitemapPath)) {
      sourcePath = childSitemapPath;
    }
  } catch {
    console.log(`[sitemap-alias] using index fallback: invalid child sitemap URL (${childSitemapLocs[0]}).`);
  }
}

fs.copyFileSync(sourcePath, sitemapAliasPath);
console.log(
  `[sitemap-alias] wrote sitemap.xml from ${path.basename(sourcePath)}.`
);
