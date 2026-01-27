import { expect, test } from "@playwright/test";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:4173";

test("rss feed uses request origin and includes posts", async ({ request }) => {
  const response = await request.get(`${baseUrl}/rss.xml`);
  expect(response.ok()).toBeTruthy();

  const contentType = response.headers()["content-type"] ?? "";
  expect(contentType).toContain("application/rss+xml");

  const body = await response.text();
  expect(body).toContain(`<atom:link href="${baseUrl}/rss.xml"`);
  expect(body).toContain(`<link>${baseUrl}/p/no-blogs</link>`);
});
