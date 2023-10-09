import type { RGBColor } from '$lib/utils/colorTools';

export type Guess = { colorMode: string,
    playMode: string,
    guessColor: RGBColor,
    targetColor: RGBColor,
    difference: number,
  }

export type GuessHistory = Guess[];