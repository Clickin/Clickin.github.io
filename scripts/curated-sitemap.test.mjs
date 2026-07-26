import assert from "node:assert/strict";

import {
  buildBlogSitemapEntries,
  buildProjectSitemapEntries,
  renderSitemapIndexXml,
  renderSitemapXml,
} from "../src/lib/curatedSitemap.js";

function run(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

run("buildBlogSitemapEntries includes blog hubs and normalized posts", () => {
  const entries = buildBlogSitemapEntries({
    site: new URL("https://clickin.github.io"),
    postEntries: [
      {
        id: "2026-02-12-stax-xml-project/index",
        lastmod: "2026-02-12T00:00:00.000Z",
      },
    ],
  });

  assert.deepEqual(entries, [
    { loc: "https://clickin.github.io/" },
    { loc: "https://clickin.github.io/blog/" },
    {
      loc: "https://clickin.github.io/blog/2026-02-12-stax-xml-project/",
      lastmod: "2026-02-12T00:00:00.000Z",
    },
  ]);
});

run("buildProjectSitemapEntries includes the project hub and landing pages", () => {
  const entries = buildProjectSitemapEntries({
    site: new URL("https://clickin.github.io"),
    projects: [{ path: "stax-xml/" }, { path: "CBXShell-rs/" }],
  });

  assert.deepEqual(entries, [
    { loc: "https://clickin.github.io/projects/" },
    { loc: "https://clickin.github.io/stax-xml/" },
    { loc: "https://clickin.github.io/CBXShell-rs/" },
  ]);
});

run("renderSitemapXml emits a UTF-8 sitemap with lastmod when present", () => {
  const xml = renderSitemapXml([
    { loc: "https://clickin.github.io/" },
    {
      loc: "https://clickin.github.io/blog/2026-02-12-stax-xml-project/",
      lastmod: "2026-02-12T00:00:00.000Z",
    },
  ]);

  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.match(xml, /<loc>https:\/\/clickin\.github\.io\/<\/loc>/);
  assert.match(xml, /<lastmod>2026-02-12T00:00:00.000Z<\/lastmod>/);
});

run("renderSitemapIndexXml emits child sitemap locations", () => {
  const xml = renderSitemapIndexXml([
    { loc: "https://clickin.github.io/sitemaps/blog.xml" },
    { loc: "https://clickin.github.io/sitemaps/projects.xml" },
  ]);

  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<sitemapindex xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  assert.match(xml, /<loc>https:\/\/clickin\.github\.io\/sitemaps\/blog\.xml<\/loc>/);
  assert.match(xml, /<loc>https:\/\/clickin\.github\.io\/sitemaps\/projects\.xml<\/loc>/);
});
