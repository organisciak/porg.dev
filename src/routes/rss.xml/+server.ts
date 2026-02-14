import type { RequestHandler } from "./$types";
import posts from "$lib/generated/posts.json";

const SITE_URL = "https://porg.dev";
const SITE_TITLE = "Peter Organisciak";
const SITE_DESCRIPTION =
  "Posts from Peter Organisciak - academic, researcher, and builder of tools for text and creativity.";

const rawPosts = import.meta.glob("/src/posts/*.{md,svx}", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function dateToRfc822(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toUTCString();
}

// --- Content extraction pipeline (mirrored from p/[slug].md/+server.ts) ---

const parseFrontmatter = (content: string) => {
  const frontmatterMatch = content.match(/---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!frontmatterMatch) {
    return { metadata: {}, body: content };
  }

  const frontmatter = frontmatterMatch[1];
  const metadata: Record<string, string> = {};

  frontmatter.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split(":");
    if (!key || !valueParts.length) return;
    let value = valueParts.join(":").trim();
    if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    }
    metadata[key.trim()] = value;
  });

  const body = content.slice(frontmatterMatch.index! + frontmatterMatch[0].length);
  return { metadata, body };
};

const stripScriptBlocks = (content: string) => {
  return content.replace(/<script[\s\S]*?<\/script>\s*/g, "").trim();
};

const parsePlaceholderAnnotations = (content: string): Map<string, string> => {
  const map = new Map<string, string>();
  const re = /<!--\s*llm-placeholder:\s*component=(\S+)\s+description="([^"]+)"\s*-->/g;
  let match;
  while ((match = re.exec(content)) !== null) {
    map.set(match[1], match[2]);
  }
  return map;
};

const placeholderFor = (name: string, annotations: Map<string, string>): string => {
  const desc = annotations.get(name);
  return desc
    ? `[Interactive content omitted: ${name} - ${desc}]`
    : `[Interactive content omitted: ${name}]`;
};

const replaceComponentTags = (content: string, annotations: Map<string, string>): string => {
  content = content.replace(/<([A-Z]\w+)\b[^>]*>[\s\S]*?<\/\1>/g, (_, name) =>
    placeholderFor(name, annotations),
  );
  content = content.replace(/<([A-Z]\w+)\b[^/>]*\/?>/g, (_, name) =>
    placeholderFor(name, annotations),
  );
  return content;
};

const stripSvelteTemplateBlocks = (content: string): string => {
  content = content.replace(/^\{#each\b[^}]*\}[\s\S]*?\{\/each\}\s*/gm, "");
  content = content.replace(/^\{#if\b[^}]*\}[\s\S]*?\{\/if\}\s*/gm, "");
  return content;
};

const stripSvelteHtmlBlocks = (content: string): string => {
  return content.replace(
    /^<(div|nav|section|aside|form|details|label)\b[^>]*>[\s\S]*?^<\/\1>\s*/gm,
    (block) => {
      if (/\{[#:/](?:if|each|await|key)\b/.test(block) || /bind:\w+/.test(block)) {
        return "";
      }
      return block;
    },
  );
};

const preserveCodeBlocks = (content: string, transform: (s: string) => string): string => {
  const parts = content.split(/(```[\s\S]*?```|`[^`]+`)/g);
  return parts.map((part, i) => (i % 2 === 1 ? part : transform(part))).join("");
};

const stripSvelteTemplateSyntax = (content: string): string => {
  content = content.replace(/\{[#:/](?:if|each|await|key)\b[^}]*\}/g, "");
  content = content.replace(/\{:else(?:\s+if\b[^}]*)?\}/g, "");
  content = content.replace(/\{@(?:const|html|debug)\b[^}]*\}/g, "");
  content = content.replace(/<svelte:\w+[^>]*\/?>/g, "");
  content = content.replace(/<\/svelte:\w+>/g, "");
  content = content.replace(/<!--\s*llm-placeholder:[^>]*-->\s*/g, "");
  content = preserveCodeBlocks(content, (text) => text.replace(/\{[a-zA-Z_$][^}]*\}/g, ""));
  return content;
};

const replaceFrontmatterRefs = (content: string, metadata: Record<string, string>): string => {
  return content.replace(/\{title\}/g, metadata.title || "");
};

const stripRawHtml = (content: string): string => {
  content = content.replace(
    /<\/?(div|span|nav|section|aside|article|form|label|input|button|details|summary|figure|figcaption)\b[^>]*>/g,
    "",
  );
  content = content.replace(/<img\b[^>]*>/g, "");
  return content;
};

const collapseBlankLines = (content: string): string => {
  return content.replace(/\n{3,}/g, "\n\n");
};

// --- End content extraction pipeline ---

const findRawPost = (slug: string): string | null => {
  for (const [filePath, content] of Object.entries(rawPosts)) {
    const match = filePath.match(/\/src\/posts\/(.+)\.(md|svx)$/);
    if (!match) continue;
    const [, fileSlug] = match;
    if (fileSlug === slug) {
      return content;
    }
  }
  return null;
};

const extractCleanBody = (rawContent: string): string => {
  const { metadata, body } = parseFrontmatter(rawContent);
  const annotations = parsePlaceholderAnnotations(body);

  let clean = body;
  clean = replaceComponentTags(clean, annotations);
  clean = stripScriptBlocks(clean);
  clean = stripSvelteTemplateBlocks(clean);
  clean = stripSvelteHtmlBlocks(clean);
  clean = replaceFrontmatterRefs(clean, metadata);
  clean = stripSvelteTemplateSyntax(clean);
  clean = stripRawHtml(clean);
  clean = collapseBlankLines(clean);
  return clean.trim();
};

export const GET: RequestHandler = async ({ url }) => {
  const siteUrl = url?.origin || SITE_URL;
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const items = sortedPosts
    .map((post) => {
      const rawContent = findRawPost(post.slug);
      const contentEncoded = rawContent
        ? `<content:encoded><![CDATA[${extractCleanBody(rawContent)}]]></content:encoded>`
        : "";

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl}/p/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/p/${post.slug}</guid>
      <pubDate>${dateToRfc822(post.date)}</pubDate>
      ${post.description ? `<description>${escapeXml(post.description)}</description>` : ""}
      ${contentEncoded}
    </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(rss.trim(), {
    headers: {
      "Content-Type": "application/rss+xml",
      "Cache-Control": "max-age=3600",
    },
  });
};
