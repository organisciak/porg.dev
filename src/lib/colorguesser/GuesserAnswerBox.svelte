<script lang='ts'>
    import type { Guess } from '$lib/colorguesser/types.ts';
    import { rgbToHex } from '$lib/utils/colorTools';
    export let guess: Guess;

    import { getTextColor } from '$lib/utils/colorBox';
    const guessTextColor = getTextColor(rgbToHex(guess.guessColor));
    const targetTextColor = getTextColor(rgbToHex(guess.targetColor));
</script>

<div class="flex space-x-4 items-center mb-2">
    <!-- Display the guessed color -->
    <div class="w-24 h-24 p-1 text-xs rounded-md flex-initial" style="color: {guessTextColor}; background-color: {rgbToHex(guess.guessColor)};">Your Guess</div>
    
    <!-- Display the target color -->
    <div class="w-24 h-24 p-1 text-xs rounded-md flex-initial" style="color: {targetTextColor}; background-color: {rgbToHex(guess.targetColor)};">Target</div>
</div>