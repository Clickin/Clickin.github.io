import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { site as siteCfg } from "../site.config";
import { normalizePostSlug } from "../lib/slug";
export async function GET(context){
  const posts = await getCollection("posts", ({ data }) => !data.draft && data.publish !== false);
  return rss({
    title: siteCfg.title,
    description: siteCfg.description,
    site: context.site,
    items: posts.map(p => ({
      title: p.data.title,
      description: p.data.description ?? "",
      pubDate: p.data.date,
      link: `/blog/${encodeURIComponent(normalizePostSlug(p.slug))}/`,
    })),
  });
}
