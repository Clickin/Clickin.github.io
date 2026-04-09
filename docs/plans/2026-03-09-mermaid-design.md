# Mermaid Introduction Design

## Goal

Add Mermaid support to MDX posts without shipping Mermaid runtime code to the browser.

## Chosen Approach

Use a remark-based build renderer that converts ` ```mermaid ` code fences into static SVG during the Astro build via `@mermaid-js/mermaid-cli`.

## Why This Approach

- The final HTML contains only SVG, which matches the blog's static-build and SEO goals.
- No Mermaid runtime bundle is shipped to the browser.
- Theme switching can be handled with pre-rendered light/dark SVG variants and CSS only.

## Safety Constraints

- Keep Mermaid on `securityLevel: "strict"`.
- Render diagrams only at build time.
- Avoid client-side HTML reparsing entirely.

## Verification

- `pnpm install --frozen-lockfile` must succeed after the dependency and lockfile are updated.
- `pnpm build` must succeed.
- A `mermaid` code fence must be replaced with static SVG during build.
