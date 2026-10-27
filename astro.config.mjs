// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://chadinasser.dev",
  output: "static",
  integrations: [sitemap()],
  redirects: {
    "/project": "/projects",
    "/blog/chadinasserdev": "/blog/from-react-to-astro",
    "/blog/chadinasser.dev": "/blog/from-react-to-astro",
  },
});
