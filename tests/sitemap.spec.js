import { expect, test } from "@playwright/test";
import posts from "../src/lib/generated/posts.json" with { type: "json" };

const fallbackBaseUrl = "http://localhost:4173";

test("sitemap includes all post slugs", async ({ request }, testInfo) => {
  const baseUrl = testInfo.project.use.baseURL ?? fallbackBaseUrl;
  const response = await request.get(`${baseUrl}/sitemap.xml`);
  expect(response.ok()).toBeTruthy();

  const body = await response.text();
  for (const post of posts) {
    expect(body).toContain(`/p/${post.slug}`);
  }
});

test("sitemap is valid XML with urlset", async ({ request }, testInfo) => {
  const baseUrl = testInfo.project.use.baseURL ?? fallbackBaseUrl;
  const response = await request.get(`${baseUrl}/sitemap.xml`);
  expect(response.ok()).toBeTruthy();

  const contentType = response.headers()["content-type"] ?? "";
  expect(contentType).toContain("application/xml");

  const body = await response.text();
  expect(body).toContain("<?xml");
  expect(body).toContain("<urlset");
  expect(body).toContain("</urlset>");
});

test("sitemap uses request origin for URLs", async ({ request }, testInfo) => {
  const baseUrl = testInfo.project.use.baseURL ?? fallbackBaseUrl;
  const response = await request.get(`${baseUrl}/sitemap.xml`);
  const body = await response.text();
  expect(body).toContain(`<loc>${baseUrl}/</loc>`);
});
