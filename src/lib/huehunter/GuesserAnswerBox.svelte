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

<div class="flex space-x-4 items-center mb-2">
    <!-- Display the target color -->
    <div class="w-24 h-16 p-1 text-xs rounded-md flex-initial" style="color: {targetTextColor}; background-color: {rgbToHex(guess.targetColor)};">
        <Target class="m-1" />Target
    </div>

    <div>
        <HueHunterScore score={guess.difference} size="base" />
    </div>

    <!-- Display the guessed color -->
    <div class="w-24 h-16 p-1 text-xs rounded-md flex-initial" style="color: {guessTextColor}; background-color: {rgbToHex(guess.guessColor)};">
        <User class="m-1" /> Guess
    </div>
    
</div>