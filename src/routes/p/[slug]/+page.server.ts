import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import postsData from "$lib/generated/posts.json";

type FileType = "md" | "svx";

interface PostMetadata {
  title: string;
  date: string;
  description?: string;
  image?: string;
  keywords?: string;
  tags?: string;
  modified?: string;
  updated?: string;
  slug: string;
  fileType: FileType;
}

export const load: PageServerLoad = async ({ params, url }) => {
  const { slug } = params;
  const canonicalUrl = new URL(url.pathname, url.origin).toString();

  try {
    const posts: PostMetadata[] = postsData;
    const post = posts.find((p) => p.slug === slug);

    if (!post) {
      throw error(404, `Post not found: ${slug}`);
    }

    return {
      slug,
      postType: post.fileType,
      metadata: post,
      canonicalUrl,
    };
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) {
      throw err;
    }
    console.error(`Error loading post ${slug}:`, err);
    throw error(500, "Could not load blog post");
  }
};
