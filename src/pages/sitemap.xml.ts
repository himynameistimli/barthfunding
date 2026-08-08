// Alias at the conventional /sitemap.xml path; the @astrojs/sitemap
// integration writes /sitemap-index.xml + /sitemap-0.xml at build.
import { SITE_URL } from "../data/site.mjs";

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${SITE_URL}/sitemap-0.xml</loc></sitemap>
</sitemapindex>
`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
