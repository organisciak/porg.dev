import { expect, test } from "@playwright/test";

test("post pages include canonical, OG, and Twitter meta tags", async ({ page, baseURL }) => {
  await page.goto("/p/no-blogs");

  const resolvedBase = baseURL ? baseURL.replace(/\/$/, "") : new URL(page.url()).origin;

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    `${resolvedBase}/p/no-blogs`
  );

  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "article");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "No Blogs");
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    "content",
    "I don't have a blog"
  );
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    `${resolvedBase}/p/no-blogs`
  );

  const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(ogImage).toBeTruthy();
  expect(ogImage?.startsWith("http")).toBe(true);

  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image"
  );
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", "No Blogs");
  await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute(
    "content",
    "I don't have a blog"
  );
  const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute("content");
  expect(twitterImage).toBeTruthy();
  expect(twitterImage?.startsWith("http")).toBe(true);
});
