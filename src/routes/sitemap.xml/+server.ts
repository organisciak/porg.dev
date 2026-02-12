import type { RequestHandler } from "./$types";
import posts from "$lib/generated/posts.json";

const SITE_URL = "https://porg.dev";

const STATIC_ROUTES = [
  "/",
  "/1/",
  "/colors/",
  "/cv/",
  "/huehunter/",
  "/p/",
  "/tft/",
  "/rss.xml",
  "/llms.txt",
];

export const GET: RequestHandler = async ({ url }) => {
  const siteUrl = url?.origin || SITE_URL;

  const staticEntries = STATIC_ROUTES.map(
    (route) => `<url><loc>${siteUrl}${route}</loc></url>`,
  ).join("\n");

  const postEntries = posts
    .map((post) => {
      const lastmod =
        (post as Record<string, string>).modified ||
        (post as Record<string, string>).updated ||
        post.date;
      const lastmodTag = lastmod ? `<lastmod>${lastmod}</lastmod>` : "";
      return `<url><loc>${siteUrl}/p/${post.slug}</loc>${lastmodTag}</url>`;
    })
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${postEntries}
</urlset>`;

  return new Response(sitemap.trim(), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "max-age=3600",
    },
  });
};
