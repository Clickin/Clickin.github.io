# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install      # Install dependencies and update pnpm-lock.yaml
pnpm dev          # Start dev server at http://localhost:4321
pnpm build        # prebuild (copy assets) → astro build → pagefind index
pnpm preview      # Preview production build locally
```

## Package manager

This repository uses `pnpm` only.

- Use `pnpm install`, `pnpm add`, `pnpm remove`, and related `pnpm` commands for dependency changes.
- Commit `pnpm-lock.yaml` whenever dependencies change.
- Do not run `bun install` in this repo or commit `bun.lock`; GitHub Actions installs with `pnpm install --frozen-lockfile`.

**Search requires a prior build.** In dev mode, `/pagefind/` requests are proxied to `dist/` by a custom Vite middleware — run `pnpm build` at least once before testing search in dev.

## Architecture

This is an **Astro 7 static blog** deployed to GitHub Pages via `/.github/workflows/deploy-pages.yml`. The build pipeline is:

1. `prebuild` — `scripts/copy-post-assets.mjs` copies all non-MDX files from `src/content/posts/<slug>/` → `public/posts/<slug>/`
2. `astro build` — generates static HTML; MDX is processed with Sätteri plugins to render D2 diagrams and rewrite relative image/asset URLs to `/posts/<slug>/...`
3. `postbuild` — `pagefind` indexes `dist/` for client-side search

### Content model (`src/content.config.ts`)

Posts live in `src/content/posts/YYYY-MM-DD-slug/index.mdx`. Frontmatter fields:

| Field | Type | Notes |
|---|---|---|
| `title` | string | required |
| `date` | date | required |
| `category` | string | required |
| `description` | string | optional, shown in list and OG image |
| `updated` | date | optional |
| `draft` | boolean | defaults `false`; excluded from build |
| `publish` | boolean | defaults `true`; set `false` to hide |
| `tags` | string[] | defaults `[]` |
| `series` | string | groups posts into a series nav |
| `order` | number | sort order within a series |
| `canonical` | url | optional canonical URL override |

Co-located assets (images, PDFs, etc.) in the post folder are served at `/posts/<slug>/<filename>` and can be referenced with relative paths in MDX.

### Diagrams

- Diagrams in Markdown and MDX MUST be authored as fenced `d2` code blocks. NEVER hand-write box-drawing ASCII art or use Mermaid.
- Use regular fenced `d2` blocks only when spatial structure adds information: cycles, branches, parallel paths, grouping, architecture, state transitions, or resource relationships.
- Simple linear flows MUST use a fenced `text` block with a short sequence or list instead of D2. A top-to-bottom chain of boxes is not a useful diagram.
- EventLoop diagrams MUST model the recurring event cycle rather than present EventLoop as one step in a pipeline. Use a circular EventLoop node and show the completion or next-event path returning to it.
- Keep D2 source simple and semantic: stable ASCII identifiers, explicit directions or connections, and short descriptive labels. Explain operational details in the surrounding Korean prose.
- Regular command output and other non-diagram text examples MAY remain fenced as `text`.
- `scripts/remark-render-diagram.mjs` renders both D2 ASCII and SVG output during the Astro build.

### Key files

| File | Purpose |
|---|---|
| `src/site.config.ts` | Blog title, author, Giscus config |
| `src/styles/global.css` | All CSS: Tailwind v4 theme tokens, dark mode, code block styles, Pagefind UI overrides |
| `src/layouts/BaseLayout.astro` | Root HTML shell — SEO head, theme init script, GA, header/footer |
| `src/lib/slug.ts` | `normalizePostSlug` (strips `/index` suffix), `postUrl` helpers |
| `src/lib/deferredScript.ts` | `loadScriptOnce` / `loadOnInteraction` for lazy-loading third-party scripts |
| `src/pages/og/[...route].ts` | OG image generation via `astro-og-canvas` for all static pages and posts |
| `src/pages/blog/[slug].astro` | Individual post page — renders MDX, copy-code button, Giscus, ToC |
| `astro.config.mjs` | Shiki dual-theme (github-light/dark), diff+highlight transformers, inline stylesheet threshold |

### Theme system

Dark/light mode is toggled via a `dark` class on `<html>`. Theme tokens are CSS custom properties defined in `global.css` under `@theme` (light) and `.dark {}` (dark). An inline `<script is:inline>` in `BaseLayout.astro` sets the class before first paint to prevent FOUC.

### OG image generation

`src/pages/og/[...route].ts` generates PNG OG images at build time for every page and post using `astro-og-canvas`. Post descriptions are auto-extracted from MDX body if `description` frontmatter is absent.

### Series feature

Posts with the same `series` string are grouped. `src/components/Series.astro` renders a nav list sorted by `order` then `date`. Set `series` and `order` in frontmatter to use it.

### Deployment

Push to `main` → GitHub Actions builds with `GITHUB_PAGES=true` (sets `site`/`base` from repo name) → deploys to GitHub Pages. `PUBLIC_GA_MEASUREMENT_ID` is injected from GitHub repo vars/secrets.

## Styling conventions

- Use CSS custom properties (`var(--color-*)`) for all theme-sensitive colors, never raw Tailwind color classes like `text-blue-500`.
- The utility class `container-blog` (`max-w-3xl mx-auto px-4 sm:px-6`) is the standard content width; post pages use `max-w-6xl` to accommodate the ToC sidebar.
- Tailwind v4 — no `tailwind.config.js`; theme configuration lives in `global.css` under `@theme`.
