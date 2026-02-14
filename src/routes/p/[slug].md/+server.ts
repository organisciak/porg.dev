import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import posts from "$lib/generated/posts.json";

type FileType = "md" | "svx";

interface PostMetadata {
  title?: string;
  date?: string;
  description?: string;
  image?: string;
  keywords?: string;
  tags?: string;
  modified?: string;
  updated?: string;
  slug: string;
  fileType: FileType;
}

const rawPosts = import.meta.glob("/src/posts/*.{md,svx}", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const parseFrontmatter = (content: string) => {
  const frontmatterMatch = content.match(/---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!frontmatterMatch) {
    return {
      metadata: {},
      body: content,
    };
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
  return {
    metadata,
    body,
  };
};

const stripScriptBlocks = (content: string) => {
  return content.replace(/<script[\s\S]*?<\/script>\s*/g, "").trim();
};

/** Parse `<!-- llm-placeholder: component=Name description="..." -->` comments. */
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

/** Replace Svelte component tags (PascalCase) with LLM-friendly placeholders. */
const replaceComponentTags = (content: string, annotations: Map<string, string>): string => {
  // Tags with bodies: <Component ...>...</Component>
  content = content.replace(/<([A-Z]\w+)\b[^>]*>[\s\S]*?<\/\1>/g, (_, name) =>
    placeholderFor(name, annotations),
  );
  // Self-closing: <Component ... /> or <Component ...> (without closing tag)
  content = content.replace(/<([A-Z]\w+)\b[^/>]*\/?>/g, (_, name) =>
    placeholderFor(name, annotations),
  );
  return content;
};

/** Strip top-level Svelte template blocks ({#each}...{/each}, {#if}...{/if}) entirely. */
const stripSvelteTemplateBlocks = (content: string): string => {
  // Remove top-level {#each}...{/each} blocks (these render data-driven UI)
  content = content.replace(/^\{#each\b[^}]*\}[\s\S]*?\{\/each\}\s*/gm, "");
  // Remove top-level {#if}...{/if} blocks (may include {:else})
  content = content.replace(/^\{#if\b[^}]*\}[\s\S]*?\{\/if\}\s*/gm, "");
  return content;
};

/** Strip HTML blocks that contain Svelte template syntax or bindings. */
const stripSvelteHtmlBlocks = (content: string): string => {
  // Match top-level HTML tags whose bodies contain Svelte control-flow or bind: attributes.
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

/** Strip Svelte-specific template syntax that leaks into markdown output. */
const stripSvelteTemplateSyntax = (content: string): string => {
  // Remove block-level Svelte directives
  content = content.replace(/\{[#:/](?:if|each|await|key)\b[^}]*\}/g, "");
  content = content.replace(/\{:else(?:\s+if\b[^}]*)?\}/g, "");
  // Remove @const, @html, @debug directives
  content = content.replace(/\{@(?:const|html|debug)\b[^}]*\}/g, "");
  // Remove svelte: special elements
  content = content.replace(/<svelte:\w+[^>]*\/?>/g, "");
  content = content.replace(/<\/svelte:\w+>/g, "");
  // Remove llm-placeholder annotation comments
  content = content.replace(/<!--\s*llm-placeholder:[^>]*-->\s*/g, "");
  // Remove Svelte expression bindings like {variable}, but preserve code blocks
  content = preserveCodeBlocks(content, (text) => text.replace(/\{[a-zA-Z_$][^}]*\}/g, ""));
  return content;
};

/**
 * Apply a transform to text outside of fenced code blocks and inline code.
 * Prevents stripping legitimate template expressions in code examples.
 */
const preserveCodeBlocks = (content: string, transform: (s: string) => string): string => {
  const parts = content.split(/(```[\s\S]*?```|`[^`]+`)/g);
  return parts.map((part, i) => (i % 2 === 1 ? part : transform(part))).join("");
};

/** Strip remaining raw HTML tags that aren't useful in markdown output. */
const stripRawHtml = (content: string): string => {
  content = content.replace(
    /<\/?(div|span|nav|section|aside|article|form|label|input|button|details|summary|figure|figcaption)\b[^>]*>/g,
    "",
  );
  content = content.replace(/<img\b[^>]*>/g, "");
  return content;
};

/** Replace {title} with actual title value from frontmatter. */
const replaceFrontmatterRefs = (content: string, metadata: Record<string, string>): string => {
  return content.replace(/\{title\}/g, metadata.title || "");
};

/** Collapse excessive blank lines to at most two consecutive newlines. */
const collapseBlankLines = (content: string): string => {
  return content.replace(/\n{3,}/g, "\n\n");
};

const buildMarkdown = (
  meta: { title: string; date?: string; description?: string },
  body: string,
) => {
  const parts = [`# ${meta.title}`];
  if (meta.date) {
    parts.push("", `_Date: ${meta.date}_`);
  }
  if (meta.description) {
    parts.push("", meta.description);
  }
  parts.push("", "---", "", body.trim());
  return parts.join("\n");
};

const findRawPost = (slug: string) => {
  for (const [filePath, content] of Object.entries(rawPosts)) {
    const match = filePath.match(/\/src\/posts\/(.+)\.(md|svx)$/);
    if (!match) continue;
    const [, fileSlug, extension] = match;
    if (fileSlug === slug) {
      return {
        content,
        fileType: extension as FileType,
      };
    }
  }
  return null;
};

export const GET: RequestHandler = async ({ params }) => {
  const { slug } = params;

  try {
    const postRecord = (posts as PostMetadata[]).find((post) => post.slug === slug) ?? null;
    const rawPost = findRawPost(slug);

    if (!rawPost) {
      throw error(404, `Post not found: ${slug}`);
    }

    const { metadata, body } = parseFrontmatter(rawPost.content);

    // Parse llm-placeholder annotations before any processing
    const annotations = parsePlaceholderAnnotations(body);

    // Pipeline: replace components → strip scripts → strip template blocks →
    // strip Svelte HTML blocks → resolve frontmatter refs → strip remaining
    // template syntax → strip raw HTML → clean up
    let cleanBody = body;
    cleanBody = replaceComponentTags(cleanBody, annotations);
    cleanBody = stripScriptBlocks(cleanBody);
    cleanBody = stripSvelteTemplateBlocks(cleanBody);
    cleanBody = stripSvelteHtmlBlocks(cleanBody);
    cleanBody = replaceFrontmatterRefs(cleanBody, metadata);
    cleanBody = stripSvelteTemplateSyntax(cleanBody);
    cleanBody = stripRawHtml(cleanBody);
    cleanBody = collapseBlankLines(cleanBody);

    const finalTitle = metadata.title || postRecord?.title || slug;
    const finalDate = metadata.date || postRecord?.date;
    const finalDescription = metadata.description || postRecord?.description;

    const markdown = buildMarkdown(
      {
        title: finalTitle,
        date: finalDate,
        description: finalDescription,
      },
      cleanBody,
    );

    return new Response(markdown, {
      headers: {
        "content-type": "text/markdown; charset=utf-8",
      },
    });
  } catch (err) {
    console.error(`Error building markdown mirror for ${slug}:`, err);
    throw error(500, "Could not build markdown mirror");
  }
};
