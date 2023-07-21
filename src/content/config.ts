import { z, defineCollection } from "astro:content";

const projectCollection = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string(),
    url: z.string().optional(),
    gitUrl: z.string().optional(),
  }),
});

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const collections = {
  project: projectCollection,
  blog: blogCollection,
};
