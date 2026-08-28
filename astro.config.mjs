import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel/serverless";
import { SITE_URL } from "./src/data/site.mjs";

// Output stays static: every page and the four fixed .ics feeds are prerendered
// exactly as before. The adapter exists for one route — /calendar/feed.ics —
// which takes arbitrary filter params and so cannot be built ahead of time.
export default defineConfig({
  site: SITE_URL,
  output: "static",
  adapter: vercel(),
  trailingSlash: "always",
  integrations: [sitemap()]
});
