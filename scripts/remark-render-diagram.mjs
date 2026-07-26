import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { D2 } from "@terrastruct/d2";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REGULAR_FONT_FILE = path.join(SCRIPT_DIR, "assets/fonts/NanumGothic-Regular.ttf");
const CACHE_DIR = path.join(process.cwd(), ".astro", "diagram", "d2");
const RENDERER_VERSION = "d2-0.1.33-nanum-gothic-v1";
const LAYOUT = "dagre";
const THEMES = [
  { name: "light", id: 0 },
  { name: "dark", id: 200 },
];

const d2 = new D2();
await d2.ready;
// D2.js exposes no dispose API; unref keeps its worker reusable without holding Astro's build open.
d2.worker.unref();
const regularFontBytes = await fs.readFile(REGULAR_FONT_FILE);
const fontHash = createHash("sha256").update(regularFontBytes).digest("hex");
// D2.js serializes compile options as JSON; a plain array preserves font bytes across the worker boundary.
const regularFont = Array.from(regularFontBytes);

function createCacheKey(source, theme) {
  return createHash("sha256")
    .update(RENDERER_VERSION)
    .update("\0")
    .update(LAYOUT)
    .update("\0")
    .update(fontHash)
    .update("\0")
    .update(String(theme.id))
    .update("\0")
    .update(source)
    .digest("hex");
}

function svgDataUri(svg) {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function wrapSvg(lightSvg, darkSvg) {
  return [
    '<figure class="diagram-static">',
    `<div class="diagram-static__diagram diagram-static__diagram--light"><img src="${svgDataUri(lightSvg)}" alt="" /></div>`,
    `<div class="diagram-static__diagram diagram-static__diagram--dark"><img src="${svgDataUri(darkSvg)}" alt="" /></div>`,
    "</figure>",
  ].join("");
}

async function readCachedSvg(source, theme) {
  const cacheKey = createCacheKey(source, theme);
  const cacheFile = path.join(CACHE_DIR, `${cacheKey}.svg`);
  if (!existsSync(cacheFile)) return { cacheFile, cacheKey };

  return {
    cacheFile,
    cacheKey,
    svg: await fs.readFile(cacheFile, "utf8"),
  };
}

async function renderDiagrams(source) {
  const cached = await Promise.all(THEMES.map((theme) => readCachedSvg(source, theme)));
  if (cached.every(({ svg }) => svg)) return cached.map(({ svg }) => svg);

  const compiled = await d2.compile(source, {
    layout: LAYOUT,
    fontRegular: regularFont,
  });

  const rendered = [];
  for (const [index, theme] of THEMES.entries()) {
    if (cached[index].svg) {
      rendered.push(cached[index].svg);
      continue;
    }

    const svg = (
      await d2.render(compiled.diagram, {
        ...compiled.renderOptions,
        themeID: theme.id,
        noXMLTag: true,
        pad: 24,
        salt: `${cached[index].cacheKey}-${theme.name}`,
      })
    ).trim();
    await fs.writeFile(cached[index].cacheFile, svg, "utf8");
    rendered.push(svg);
  }
  return rendered;
}

export default function satteriRenderDiagram() {
  return {
    name: "render-diagram",
    async code(node) {
      if (node.lang !== "d2") return;

      await fs.mkdir(CACHE_DIR, { recursive: true });
      const [lightSvg, darkSvg] = await renderDiagrams(node.value.trim());
      return { rawHtml: wrapSvg(lightSvg, darkSvg) };
    },
  };
}
