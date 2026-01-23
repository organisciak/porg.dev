<script lang='ts'>
    import type { Guess } from '$lib/huehunter/types.ts';
    import { rgbToHex } from '$lib/utils/colorTools';
    import { Target } from 'lucide-svelte';
    import { User } from 'lucide-svelte';

    export let guess: Guess;

    import { getTextColor } from '$lib/utils/colorBox';
  import HueHunterScore from './HueHunterScore.svelte';
    const guessTextColor = getTextColor(rgbToHex(guess.guessColor));
    const targetTextColor = getTextColor(rgbToHex(guess.targetColor));
</script>

<div class="guess-row">
    <div class="guess-chip" style="color: {targetTextColor}; background-color: {rgbToHex(guess.targetColor)};">
        <Target class="guess-icon" />
        Target
    </div>

    <div class="guess-score">
        <HueHunterScore score={guess.difference} size="base" />
    </div>

    <div class="guess-chip" style="color: {guessTextColor}; background-color: {rgbToHex(guess.guessColor)};">
        <User class="guess-icon" />
        Guess
    </div>
</div>

<style>
    .guess-row {
        display: grid;
        grid-template-columns: minmax(90px, 1fr) auto minmax(90px, 1fr);
        gap: 0.75rem;
        align-items: center;
        font-size: 0.5rem;
    }

    .guess-chip {
        min-height: 44px;
        padding: 0.35rem 0.4rem;
        border: 1px solid #2f2f58;
        box-shadow: inset 0 0 0 1px #0a0a1a;
        display: flex;
        align-items: center;
        gap: 0.25rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
    }

    .guess-score {
        display: flex;
        justify-content: center;
    }

    .guess-chip :global(.guess-icon) {
        width: 14px;
        height: 14px;
    }
</style>
