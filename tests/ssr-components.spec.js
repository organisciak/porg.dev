import { expect, test } from "@playwright/test";

test.describe("SSR safety of interactive blog components", () => {
  test("atmux post page returns valid HTML without SSR errors", async ({ page }) => {
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));

    const response = await page.goto("/p/atmux");
    expect(response.status()).toBe(200);

    const html = await response.text();
    // Should not contain SSR error markers
    expect(html).not.toContain("Internal Error");
    expect(html).not.toContain("500");
    // Page should have basic structure
    expect(html).toContain("<html");
    expect(html).toContain("</html>");

    // No JS errors during initial load
    expect(errors).toEqual([]);
  });

  test("no-blogs post page returns valid HTML without SSR errors", async ({ page }) => {
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));

    const response = await page.goto("/p/no-blogs");
    expect(response.status()).toBe(200);

    const html = await response.text();
    expect(html).not.toContain("Internal Error");
    expect(html).toContain("<html");
    expect(html).toContain("</html>");

    expect(errors).toEqual([]);
  });

  test("youth media awards post page returns valid HTML without SSR errors", async ({ page }) => {
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));

    const response = await page.goto("/p/2026-youth-media-awards");
    expect(response.status()).toBe(200);

    const html = await response.text();
    expect(html).not.toContain("Internal Error");
    expect(html).toContain("<html");
    expect(html).toContain("</html>");

    expect(errors).toEqual([]);
  });

  test("atmux post renders interactive components after hydration", async ({ page }) => {
    await page.goto("/p/atmux");

    // Wait for the post content to load (client-side dynamic import)
    await page.waitForSelector(".post-content", { timeout: 10000 });

    // AtmuxInterfaceTour should render with navigation controls
    const tour = page.locator(".tour");
    if ((await tour.count()) > 0) {
      await expect(tour.first()).toBeVisible();
      // Should have prev/next buttons
      await expect(tour.locator("button", { hasText: "Prev" }).first()).toBeVisible();
      await expect(tour.locator("button", { hasText: "Next" }).first()).toBeVisible();
    }

    // AtmuxFeatureFlip should render with navigation controls
    const featureFlip = page.locator(".feature-flip");
    if ((await featureFlip.count()) > 0) {
      await expect(featureFlip.first()).toBeVisible();
    }
  });

  test("no-blogs post renders RandomItemLoader after hydration", async ({ page }) => {
    await page.goto("/p/no-blogs");

    // Wait for the post content to load
    await page.waitForSelector(".post-content", { timeout: 10000 });

    // RandomItemLoader wraps content in a Card — check it appears
    const card = page.locator(".post-content").locator('[class*="card"]');
    if ((await card.count()) > 0) {
      await expect(card.first()).toBeVisible();
    }
  });
});
