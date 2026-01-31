import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

const fallbackBaseUrl = "http://localhost:4173";

const getLatestPost = async () => {
  const postsPath = new URL("../src/lib/generated/posts.json", import.meta.url);
  const raw = await readFile(postsPath, "utf-8");
  const posts = JSON.parse(raw);

  if (!Array.isArray(posts) || posts.length === 0) {
    throw new Error("posts.json did not contain any posts");
  }

  return posts.reduce((latest, post) => {
    if (!latest) return post;
    return new Date(post.date).getTime() > new Date(latest.date).getTime() ? post : latest;
  }, null);
};

test("llms.txt exposes primary pages and recent posts", async ({ request }, testInfo) => {
  const baseUrl = testInfo.project.use.baseURL ?? fallbackBaseUrl;
  const response = await request.get(`${baseUrl}/llms.txt`);
  expect(response.ok()).toBeTruthy();

  const contentType = response.headers()["content-type"] ?? "";
  expect(contentType).toContain("text/plain");

  const body = await response.text();
  expect(body).toContain("# porg.dev");
  expect(body).toContain("## Primary Pages");
  expect(body).toContain(`- Blog Posts: ${baseUrl}/p`);
  expect(body).toContain(`- RSS Feed: ${baseUrl}/rss.xml`);
  expect(body).toContain("## Recent Blog Posts");

  const latestPost = await getLatestPost();
  expect(body).toContain(`- ${latestPost.title}: ${baseUrl}/p/${latestPost.slug}`);
});
