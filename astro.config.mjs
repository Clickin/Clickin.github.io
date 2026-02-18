import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import remarkRewritePostAssets from "./scripts/remark-rewrite-post-assets.mjs";

function ghPagesConfig() {
  const isPages = process.env.GITHUB_PAGES === "true";
  const repoFull = process.env.GITHUB_REPOSITORY;
  const owner = process.env.GITHUB_REPOSITORY_OWNER;
  if (!isPages || !repoFull || !owner) return {};
  const repo = repoFull.split("/")[1];
  const isUserSite = repo.endsWith(".github.io");
  return { site: `https://${owner}.github.io`, base: isUserSite ? "/" : `/${repo}/` };
}

export default defineConfig({
  site: "https://clickin.github.io",
  integrations: [mdx({ remarkPlugins: [remarkRewritePostAssets] }), sitemap()],
  vite: {
    plugins: [
      tailwindcss(),
      {
        name: "pagefind-dev",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url?.startsWith("/pagefind/")) {
              const fs = import("node:fs");
              const path = import("node:path");
              Promise.all([fs, path]).then(([{ existsSync, statSync, createReadStream }, { join }]) => {
                const cleanUrl = req.url.split("?")[0];
                const file = join(process.cwd(), "dist", cleanUrl.slice(1));
                if (existsSync(file) && statSync(file).isFile()) {
                  if (file.endsWith(".js")) res.setHeader("Content-Type", "text/javascript");
                  else if (file.endsWith(".css")) res.setHeader("Content-Type", "text/css");
                  else if (file.endsWith(".json")) res.setHeader("Content-Type", "application/json");
                  else if (file.endsWith(".pf_meta")) res.setHeader("Content-Type", "application/octet-stream");
                  else if (file.endsWith(".pf_fragment")) res.setHeader("Content-Type", "application/octet-stream");
                  else if (file.endsWith(".pf_index")) res.setHeader("Content-Type", "application/octet-stream");
                  else if (file.endsWith(".wasm")) res.setHeader("Content-Type", "application/wasm");
                  createReadStream(file).pipe(res);
                  return;
                }
                next();
              });
              return;
            }
            next();
          });
        },
      },
    ],
  },
  ...ghPagesConfig(),
});
