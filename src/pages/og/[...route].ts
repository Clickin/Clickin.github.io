import { getCollection } from "astro:content";
import { OGImageRoute } from "astro-og-canvas";
import { site } from "../../site.config";
import { normalizePostSlug } from "../../lib/slug";

type OgPage = {
  title: string;
  description?: string;
};

function clampText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

function cleanInlineMarkdown(text: string) {
  return text
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isSkippableMarkdownLine(line: string) {
  if (!line) return true;
  if (/^\s{0,3}#{1,6}\s+/.test(line)) return true;
  if (/^\s{0,3}[-*+]\s+/.test(line)) return true;
  if (/^\s{0,3}\d+\.\s+/.test(line)) return true;
  if (/^\s*>/.test(line)) return true;
  if (/^\s*\|.*\|\s*$/.test(line)) return true;
  if (/^\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+$/.test(line)) return true;
  return false;
}

function toPlainText(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractLeadParagraph(markdown: string) {
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, "\n");
  const lines = withoutCode.split(/\r?\n/);
  const paragraphLines: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      if (paragraphLines.length > 0) break;
      continue;
    }

    if (isSkippableMarkdownLine(line)) {
      if (paragraphLines.length > 0) break;
      continue;
    }

    const cleaned = cleanInlineMarkdown(line);
    if (!cleaned) continue;
    paragraphLines.push(cleaned);
  }

  return paragraphLines.join(" ").trim();
}

function buildPostTeaser(body: string, maxLength = 140) {
  const leadParagraph = extractLeadParagraph(body);
  const base = leadParagraph || toPlainText(body);
  return clampText(base, maxLength);
}

function buildPostDescription(summary: string | undefined, body: string) {
  const teaser = buildPostTeaser(body);
  if (!summary?.trim()) return teaser;
  const normalizedSummary = summary.trim();
  if (!teaser || teaser.startsWith(normalizedSummary)) return clampText(normalizedSummary, 180);
  return clampText(`${normalizedSummary} - ${teaser}`, 180);
}

const staticPages: Record<string, OgPage> = {
  index: {
    title: "Home",
    description: "Developer blog - notes, write-ups, and explorations.",
  },
  blog: {
    title: "Blog",
    description: "All posts",
  },
  search: {
    title: "Search",
    description: "블로그 글 검색",
  },
  projects: {
    title: "Projects",
    description: "My open source projects",
  },
  "policy/privacy": {
    title: "개인정보처리방침",
    description: `${site.title} 개인정보처리방침`,
  },
  "policy/terms": {
    title: "이용약관",
    description: `${site.title} 이용약관`,
  },
};

const posts = await getCollection("posts", ({ data }) => !data.draft && data.publish !== false);
const postPages = Object.fromEntries(
  posts.map(({ slug, data, body }) => [
    `blog/${normalizePostSlug(slug)}`,
    {
      title: data.title,
      description: buildPostDescription(data.description, body),
    },
  ])
) satisfies Record<string, OgPage>;

const pages = {
  ...staticPages,
  ...postPages,
};

export const { getStaticPaths, GET } = await OGImageRoute({
  param: "route",
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    format: "PNG",
    fonts: [
      "https://api.fontsource.org/v1/fonts/noto-sans-kr/korean-400-normal.ttf",
      "https://api.fontsource.org/v1/fonts/noto-sans-kr/korean-700-normal.ttf",
    ],
    font: {
      title: {
        families: ["Noto Sans KR Thin"],
        weight: "Bold",
        size: 64,
        lineHeight: 1.2,
      },
      description: {
        families: ["Noto Sans KR Thin"],
        weight: "Normal",
        size: 34,
        lineHeight: 1.35,
      },
    },
    bgGradient: [
      [18, 35, 58],
      [27, 61, 99],
    ],
    border: {
      width: 10,
      color: [91, 155, 213],
      side: "inline-start",
    },
  }),
});
