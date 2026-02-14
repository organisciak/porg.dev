import { expect, test } from "@playwright/test";

const fallbackBaseUrl = "http://localhost:4173";

test("rss feed uses request origin and includes posts", async ({ request }, testInfo) => {
  const baseUrl = testInfo.project.use.baseURL ?? fallbackBaseUrl;
  const response = await request.get(`${baseUrl}/rss.xml`);
  expect(response.ok()).toBeTruthy();

  const contentType = response.headers()["content-type"] ?? "";
  expect(contentType).toContain("application/rss+xml");

  const body = await response.text();
  expect(body).toContain(`<atom:link href="${baseUrl}/rss.xml"`);
  expect(body).toContain(`<link>${baseUrl}/p/no-blogs</link>`);
  expect(body).toContain(`<link>${baseUrl}/p/2026-youth-media-awards</link>`);
});

test("rss feed includes content:encoded with full post body", async ({ request }, testInfo) => {
  const baseUrl = testInfo.project.use.baseURL ?? fallbackBaseUrl;
  const response = await request.get(`${baseUrl}/rss.xml`);
  expect(response.ok()).toBeTruthy();

  const body = await response.text();

  // Verify the content namespace is declared
  expect(body).toContain('xmlns:content="http://purl.org/rss/1.0/modules/content/"');

  // Verify content:encoded elements exist in CDATA sections
  expect(body).toContain("<content:encoded><![CDATA[");
  expect(body).toContain("]]></content:encoded>");

  // Each post item should have content:encoded
  const contentEncodedCount = (body.match(/<content:encoded>/g) || []).length;
  const itemCount = (body.match(/<item>/g) || []).length;
  expect(contentEncodedCount).toBe(itemCount);
});
