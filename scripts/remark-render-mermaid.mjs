import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer";
import { renderMermaid } from "@mermaid-js/mermaid-cli";

const CACHE_DIR = path.join(process.cwd(), ".astro", "mermaid");
const RENDERER_VERSION = "v1";
const THEMES = ["default", "dark"];
const VIEWPORT = {
  width: 1600,
  height: 1200,
  deviceScaleFactor: 1,
};

const PUPPETEER_CONFIG = {
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
};

function createCacheKey(source, theme) {
  return createHash("sha256")
    .update(RENDERER_VERSION)
    .update("\0")
    .update(theme)
    .update("\0")
    .update(source)
    .digest("hex");
}

function cleanSvg(svg) {
  return svg
    .replace(/<\?xml[\s\S]*?\?>\s*/g, "")
    .replace(/<!DOCTYPE[\s\S]*?>\s*/gi, "")
    .trim();
}

function wrapSvg(lightSvg, darkSvg) {
  return [
    '<figure class="mermaid-static">',
    `<div class="mermaid-static__diagram mermaid-static__diagram--light">${lightSvg}</div>`,
    `<div class="mermaid-static__diagram mermaid-static__diagram--dark">${darkSvg}</div>`,
    "</figure>",
  ].join("");
}

async function renderTheme(browser, source, theme) {
  const cacheKey = createCacheKey(source, theme);
  const cacheFile = path.join(CACHE_DIR, `${cacheKey}.svg`);

  if (existsSync(cacheFile)) {
    return await fs.readFile(cacheFile, "utf8");
  }

  const { data } = await renderMermaid(browser, source, "svg", {
    backgroundColor: "transparent",
    svgId: `mermaid-${cacheKey}`,
    viewport: VIEWPORT,
    mermaidConfig: {
      startOnLoad: false,
      securityLevel: "strict",
      theme,
    },
  });

  const svg = cleanSvg(Buffer.from(data).toString("utf8"));
  await fs.writeFile(cacheFile, svg, "utf8");
  return svg;
}

export default function satteriRenderMermaid() {
  return {
    name: "render-mermaid",
    async code(node) {
      if (node.lang !== "mermaid") return;

      await fs.mkdir(CACHE_DIR, { recursive: true });
      let browser;
      try {
        browser = await puppeteer.launch(PUPPETEER_CONFIG);
      } catch (error) {
        throw new Error(
          "Failed to launch Chromium for Mermaid rendering. Ensure Puppeteer downloaded its browser during install.",
          { cause: error }
        );
      }

      try {
        const [lightSvg, darkSvg] = await Promise.all(
          THEMES.map((theme) => renderTheme(browser, node.value.trim(), theme))
        );
        return { rawHtml: wrapSvg(lightSvg, darkSvg) };
      } finally {
        await browser.close();
      }
    },
  };
}
