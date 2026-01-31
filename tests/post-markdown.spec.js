import { expect, test } from "@playwright/test";

test("markdown mirror returns post content", async ({ request }) => {
  const response = await request.get("/p/no-blogs.md");
  expect(response.ok()).toBe(true);

  const contentType = response.headers()["content-type"];
  expect(contentType).toContain("text/markdown");

  const body = await response.text();
  expect(body).toContain("# No Blogs");
  expect(body).toContain("_Date: 2025-05-09_");
  expect(body).toContain("I don't have a blog");
});
