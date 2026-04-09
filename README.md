# Astro MDX Blog Template v6

Astro + MDX 기반의 개발 블로그 템플릿입니다.

## Features

- 📝 **MDX** — Markdown + JSX 컴포넌트
- 🌓 **Light / Dark 테마** — 시스템 설정 자동 감지, 사용자 선택 저장
- 🎨 **Tailwind CSS v4** — 유틸리티 기반 스타일링
- 🔍 **Client-side Search** — 빌드 시 JSON 인덱스 생성
- 📰 **RSS** — `/rss.xml`
- 🗺️ **Sitemap** — 자동 생성
- 🚀 **GitHub Pages** — 원클릭 배포 (GitHub Actions)

## Quick Start

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# Install
pnpm install

# Dev server
pnpm dev
```

Open [http://localhost:4321](http://localhost:4321).

## Package Manager

This repository uses `pnpm` only.

- Use `pnpm install`, `pnpm add`, `pnpm remove`, and other `pnpm` commands for dependency changes.
- Commit `pnpm-lock.yaml` whenever dependencies change.
- Do not run `bun install` in this repo or commit `bun.lock`; deployment uses `pnpm install --frozen-lockfile`.

## Deploy to GitHub Pages

1. Push to `main` branch
2. GitHub Settings → Pages → Source: **GitHub Actions**
3. Done! 🎉

## Customize

| File | Purpose |
|---|---|
| `src/site.config.ts` | Blog title, description, author |
| `src/styles/global.css` | Theme colors, design tokens |
| `public/og-default.svg` | Default OG image |
| `src/content/posts/` | Add blog posts here |

## Writing Posts

Create a folder in `src/content/posts/`:

```
src/content/posts/YYYY-MM-DD-slug/
├── index.mdx    # Post content
└── image.png    # Co-located assets (optional)
```

## Mermaid Diagram

Mermaid diagrams are rendered to static SVG during the build. Use a normal fenced code block with the `mermaid` language tag.

````mdx
```mermaid
flowchart TD
  A[Write Mermaid code in MDX] --> B[Astro build renders SVG]
  B --> C[No Mermaid runtime shipped to the browser]
```
````

The site renders light and dark SVG variants at build time and toggles them with CSS, so no Mermaid client bundle is needed.

## License

MIT
