import { expect, test } from "@playwright/test";

test("post pages include BlogPosting JSON-LD", async ({ page, baseURL }) => {
  await page.goto("/p/no-blogs");

  const jsonLdScript = page.locator('script[type="application/ld+json"]');
  await expect(jsonLdScript).toHaveCount(1);

  const jsonText = await jsonLdScript.first().innerText();
  const data = JSON.parse(jsonText);

  const resolvedBase = baseURL ? baseURL.replace(/\/$/, "") : new URL(page.url()).origin;

  expect(data["@type"]).toBe("BlogPosting");
  expect(data.headline).toBe("No Blogs");
  expect(data.description).toBe("I don't have a blog");
  expect(data.datePublished).toBe("2025-05-09");
  expect(data.dateModified).toBe("2025-05-09");
  expect(data.url).toBe(`${resolvedBase}/p/no-blogs`);
  expect(data.author?.name).toBe("Peter Organisciak");
});
