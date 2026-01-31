import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import postsData from "$lib/generated/posts.json";

type FileType = "md" | "svx";

interface PostMetadata {
  title: string;
  date: string;
  description?: string;
  slug: string;
  fileType: FileType;
}

export const load: PageServerLoad = async () => {
  try {
    const posts: PostMetadata[] = postsData;
    return { posts };
  } catch (err) {
    console.error("Error loading posts:", err);
    throw error(500, "Could not load blog posts");
  }
};
