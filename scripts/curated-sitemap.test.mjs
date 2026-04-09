import assert from "node:assert/strict";

import { buildCuratedSitemapEntries, renderSitemapXml } from "../src/lib/curatedSitemap.js";

function run(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

run("buildCuratedSitemapEntries keeps only hubs, posts, and curated internal paths", () => {
  const entries = buildCuratedSitemapEntries({
    site: new URL("https://clickin.github.io"),
    extraPaths: ["/projects/", "/stax-xml/", "/projects/"],
    postEntries: [
      {
        slug: "2026-02-12-stax-xml-project",
        lastmod: "2026-02-12T00:00:00.000Z",
      },
      {
        slug: "2026-02-12-cbxshell-rs-rust-rewrite",
        lastmod: "2026-02-13T00:00:00.000Z",
      },
    ],
  });

  assert.deepEqual(entries, [
    { loc: "https://clickin.github.io/" },
    { loc: "https://clickin.github.io/blog/" },
    { loc: "https://clickin.github.io/projects/" },
    { loc: "https://clickin.github.io/stax-xml/" },
    {
      loc: "https://clickin.github.io/blog/2026-02-12-stax-xml-project/",
      lastmod: "2026-02-12T00:00:00.000Z",
    },
    {
      loc: "https://clickin.github.io/blog/2026-02-12-cbxshell-rs-rust-rewrite/",
      lastmod: "2026-02-13T00:00:00.000Z",
    },
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
