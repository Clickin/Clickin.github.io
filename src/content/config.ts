import { defineCollection, z } from "astro:content";
const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    publish: z.boolean().default(true),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    series: z.string().optional(),
    order: z.number().optional(),
    canonical: z.string().url().optional(),
  }),
});
export const collections = { posts };
