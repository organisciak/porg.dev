
  // Path: src/routes/sitemap.xml/+server.ts
  // This file was generated by the generate-sitemap.js hook
export async function GET() {
  return new Response(`<?xml version="1.0" encoding="UTF-8" ?>
    <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>https://porg.dev</loc></url>
<url><loc>https://porg.dev/colors/</loc></url>
<url><loc>https://porg.dev/cv/</loc></url>
<url><loc>https://porg.dev/huehunter/</loc></url>
    </urlset>`, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}