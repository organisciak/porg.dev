import { expect, test } from "@playwright/test";

/** Inject a fake completed daily game into localStorage and reload. */
async function injectFakeGame(page, opts = {}) {
  const { attempts = 5, colorMode = "RGB" } = opts;
  await page.evaluate(
    ({ attempts, colorMode }) => {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const year = today.getFullYear();
      const key = `guessHistory_${year}${month}${day}`;

      const fakeGuesses = Array.from({ length: attempts }, (_, i) => ({
        colorMode,
        playMode: "DAILY",
        guessColor: { red: 100, green: 100, blue: 100 },
        targetColor: { red: 120, green: 80, blue: 140 },
        difference: 30 + i * 15,
      }));

      localStorage.setItem(key, JSON.stringify(fakeGuesses));
      const records = JSON.parse(localStorage.getItem("guessHistoryRecords") || "[]");
      if (!records.includes(key)) {
        records.push(key);
        localStorage.setItem("guessHistoryRecords", JSON.stringify(records));
      }
      localStorage.setItem("lastUpdated", today.toString());
    },
    { attempts, colorMode },
  );
  await page.reload();
}

test.describe("Hue Hunter share result", () => {
  test("daily game page loads without errors", async ({ page }) => {
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));

    const response = await page.goto("/huehunter/daily-rgb");
    expect(response.status()).toBe(200);
    expect(errors).toEqual([]);
  });

  test("share buttons appear after completing daily game", async ({ page }) => {
    await page.goto("/huehunter/daily-rgb");
    await injectFakeGame(page);

    // The copy result button should be visible
    const copyBtn = page.locator("button", { hasText: /Copy result/i });
    await expect(copyBtn).toBeVisible({ timeout: 5000 });
  });

  test("copy result button produces Wordle-style share text", async ({ page, context }) => {
    // Grant clipboard permissions so we can read what was copied
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/huehunter/daily-rgb");
    await injectFakeGame(page, { attempts: 5, colorMode: "RGB" });

    const copyBtn = page.locator("button", { hasText: /Copy result/i });
    await expect(copyBtn).toBeVisible({ timeout: 5000 });
    await copyBtn.click();

    // After clicking, button should show "Copied!" feedback
    await expect(page.locator("button", { hasText: /Copied!/i })).toBeVisible({ timeout: 3000 });

    // Read clipboard
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());

    // Must contain key Wordle-style markers
    expect(clipboardText).toMatch(/🎨 Hue Hunter Day \d+/);
    expect(clipboardText).toContain("RGB · 5/5");
    expect(clipboardText).toContain("porg.dev/huehunter");

    // Should have 5 emoji grid rows
    const gridLines = clipboardText.split("\n").filter((l) => /[🟩🟨🟧🟥⬛]/.test(l));
    expect(gridLines).toHaveLength(5);

    // Each grid row should have exactly 5 emoji blocks
    for (const line of gridLines) {
      const blocks = [...line].filter((c) => ["🟩", "🟨", "🟧", "🟥", "⬛"].includes(c));
      expect(blocks.length).toBe(5);
    }

    // No raw color values leaked — no CSS/hex format, no actual channel numbers
    expect(clipboardText).not.toMatch(/#[0-9a-f]{3,6}/i);
    expect(clipboardText).not.toMatch(/\d{1,3},\s*\d{1,3},\s*\d{1,3}/);
  });
});
