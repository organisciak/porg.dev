import type { RequestHandler } from './$types';
import posts from '$lib/generated/posts.json';

const SITE_URL = 'https://porg.dev';
const SITE_TITLE = 'Peter Organisciak';
const SITE_DESCRIPTION = 'Posts from Peter Organisciak - academic, researcher, and builder of tools for text and creativity.';

function escapeXml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function dateToRfc822(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toUTCString();
}

export const GET: RequestHandler = async () => {
	const sortedPosts = [...posts].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
	);

	const items = sortedPosts
		.map(
			(post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/p/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/p/${post.slug}</guid>
      <pubDate>${dateToRfc822(post.date)}</pubDate>
      ${post.description ? `<description>${escapeXml(post.description)}</description>` : ''}
    </item>`
		)
		.join('');

	const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

	return new Response(rss.trim(), {
		headers: {
			'Content-Type': 'application/rss+xml',
			'Cache-Control': 'max-age=3600'
		}
	});
};
