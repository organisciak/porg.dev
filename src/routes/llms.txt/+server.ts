import type { RequestHandler } from "./$types";
import posts from "$lib/generated/posts.json";

const SITE_URL = "https://porg.dev";

export const GET: RequestHandler = async ({ url }) => {
  const siteUrl = url?.origin || SITE_URL;

  // Get recent posts for the posts section
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const postsList = recentPosts
    .map((post) => `- ${post.title}: ${siteUrl}/p/${post.slug}`)
    .join("\n");

  const content = `# porg.dev

> Personal website of Dr. Peter Organisciak - Associate Professor and Department Chair at the University of Denver, researching AI applications in creativity assessment and information science.

## Primary Pages

- Home: ${siteUrl}/
- CV / Academic Profile: ${siteUrl}/cv
- Posts: ${siteUrl}/p
- RSS Feed: ${siteUrl}/rss.xml

## Recent Posts

${postsList}

## Projects & Tools

- Hue Hunter (color game): ${siteUrl}/huehunter
- Open Creativity Scoring: https://openscoring.du.edu
- Massive Texts Lab: https://github.com/massivetexts

## Contact

- Email: peter.organisciak@du.edu
- ORCID: https://orcid.org/0000-0002-9058-2280
- Google Scholar: https://scholar.google.com/citations?user=RfHXG5EAAAAJ

## About This File

This is an llms.txt file providing structured information about this website for AI assistants and language models. For more information about the llms.txt convention, see https://llmstxt.org/
`;

  return new Response(content.trim(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "max-age=3600",
    },
  });
};
