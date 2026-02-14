import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

const fallbackBaseUrl = "http://localhost:4173";

const loadPosts = async () => {
  const postsPath = new URL("../src/lib/generated/posts.json", import.meta.url);
  const raw = await readFile(postsPath, "utf-8");
  const posts = JSON.parse(raw);
  if (!Array.isArray(posts) || posts.length === 0) {
    throw new Error("posts.json did not contain any posts");
  }
  return posts;
};

test("llms-full.txt returns 200 and lists all posts", async ({ request }, testInfo) => {
  const baseUrl = testInfo.project.use.baseURL ?? fallbackBaseUrl;
  const posts = await loadPosts();
  const response = await request.get(`${baseUrl}/llms-full.txt`);
  expect(response.status()).toBe(200);
  const body = await response.text();

  for (const post of posts) {
    expect(body).toContain(`/p/${post.slug}`);
    expect(body).toContain(`/p/${post.slug}.md`);
    expect(body).toContain(post.title);
  }
});

test("llms-full.txt has correct content type", async ({ request }, testInfo) => {
  const baseUrl = testInfo.project.use.baseURL ?? fallbackBaseUrl;
  const response = await request.get(`${baseUrl}/llms-full.txt`);
  const contentType = response.headers()["content-type"];
  expect(contentType).toContain("text/plain");
});

test("llms-full.txt references llms.txt", async ({ request }, testInfo) => {
  const baseUrl = testInfo.project.use.baseURL ?? fallbackBaseUrl;
  const response = await request.get(`${baseUrl}/llms-full.txt`);
  const body = await response.text();
  expect(body).toContain("/llms.txt");
});
