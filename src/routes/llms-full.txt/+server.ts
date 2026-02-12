import type { RequestHandler } from "./$types";
import posts from "$lib/generated/posts.json";

const SITE_URL = "https://porg.dev";

export const GET: RequestHandler = async ({ url }) => {
  const siteUrl = url?.origin || SITE_URL;

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const postEntries = sortedPosts
    .map((post) => {
      const lines = [
        `## ${post.title}`,
        `- URL: ${siteUrl}/p/${post.slug}`,
        `- Markdown: ${siteUrl}/p/${post.slug}.md`,
        `- Date: ${post.date}`,
      ];
      if (post.description) {
        lines.push(`- Summary: ${post.description}`);
      }
      return lines.join("\n");
    })
    .join("\n\n");

  const content = `# porg.dev - Full Post Index

> Machine-readable index of all posts on porg.dev with canonical URLs and markdown mirror links.
> For a brief overview see: ${siteUrl}/llms.txt

${postEntries}
`;

  return new Response(content.trim(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "max-age=3600",
    },
  });
};
