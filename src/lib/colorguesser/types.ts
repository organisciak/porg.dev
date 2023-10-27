import type { RGBColor } from '$lib/utils/colorTools';

export type Guess = { colorMode: string,
    playMode: string,
    guessColor: RGBColor,
    targetColor: RGBColor,
    difference: number,
  }

export type GuessHistory = Guess[];

export type GuessHistoryKeyed = {date:DateKey, history:GuessHistory};

type DateScore = {
  'date': DateKey,
  'score': number
}

export type DateKey = string;

export type GuessStats = {
  colorsGuessed:number,
  daysPlayed:number,
  histogram: number[],
  averageScore: number,
  scoreByDate: DateScore[]
};