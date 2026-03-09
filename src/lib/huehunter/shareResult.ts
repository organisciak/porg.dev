import { calculateBoundScore, rawScoreThreshold } from "$lib/huehunter/colorGuesser";
import type { Guess } from "$lib/huehunter/types";

/** Fixed epoch for day numbering (2023-10-01 UTC) */
const EPOCH = Date.UTC(2023, 9, 1);

/** Return a sequential day number starting from the epoch. */
export function getDayNumber(date: Date = new Date()): number {
  const utcMs = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((utcMs - EPOCH) / 86_400_000) + 1;
}

/**
 * Convert a round's raw difference to a row of 5 emoji squares.
 * Filled squares use a color that reflects quality; unfilled are ⬛.
 */
export function scoreToBar(difference: number): string {
  const score = calculateBoundScore(difference, rawScoreThreshold, 10);
  const filled = Math.round(score / 2); // 0-10 → 0-5

  let block: string;
  if (score >= 8) block = "🟩";
  else if (score >= 5) block = "🟨";
  else if (score >= 3) block = "🟧";
  else block = "🟥";

  return block.repeat(filled) + "⬛".repeat(5 - filled);
}

/**
 * Build a deterministic, spoiler-free share string for a finished daily game.
 *
 * Example output:
 *   🎨 Hue Hunter Day 732
 *   RGB · 5/5
 *
 *   🟩🟩🟩🟩⬛
 *   🟨🟨🟨⬛⬛
 *   🟩🟩🟩🟩🟩
 *   🟧🟧⬛⬛⬛
 *   🟩🟩🟩🟩⬛
 *
 *   porg.dev/huehunter
 */
export function generateShareText(
  dailyGuesses: Guess[],
  colorMode: string,
  maxAttempts: number,
  date: Date = new Date(),
): string {
  const day = getDayNumber(date);
  const grid = dailyGuesses.map((g) => scoreToBar(g.difference)).join("\n");

  return [
    `🎨 Hue Hunter Day ${day}`,
    `${colorMode} · ${dailyGuesses.length}/${maxAttempts}`,
    "",
    grid,
    "",
    "porg.dev/huehunter",
  ].join("\n");
}
