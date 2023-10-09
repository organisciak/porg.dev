<script lang="ts">
    import { page } from '$app/stores';

    import { onMount } from 'svelte';
    import { cmykToRgb, rgbToHash } from '$lib/utils/colorTools';
    import type { RGBColor, CMYKColor } from '$lib/utils/colorTools';
    import type { GuessHistory } from '$lib/colorguesser/types.ts';
    import { guessHistoryStore } from '$lib/colorguesser/guessHistoryStore';
	import ColorBoxBase from '$lib/colorbox/ColorBoxBase.svelte';

    type PlayMode = "INFINITE" | "DAILY" | "PRACTICE" | "FINISHED";
    type ColorMode = "RGB" | "CMYK";

    let playMode: PlayMode;
    let colorMode: ColorMode;
    
    // routing in +page.server.ts should ensure that these are valid
    let { rawPlayMode, rawColorMode } = $page.params;
    
    $: {
        rawPlayMode = $page.params.playMode.toUpperCase();
        rawColorMode = $page.params.colorMode.toUpperCase();
        playMode = rawPlayMode.toUpperCase() as PlayMode;
        colorMode = rawColorMode.toUpperCase() as ColorMode;
    };

    
    let rgbColors: RGBColor = {
        red: 0,
        green: 0,
        blue: 0
    };

    let cmykColors: CMYKColor = {
        cyan: 0,
        magenta: 0,
        yellow: 0,
        black: 0
    };

    let target: RGBColor = {
        red: getRandomInt(255),
        green: getRandomInt(255),
        blue: getRandomInt(255)
    };

    let submitted: boolean = false;
    let difference: number;
    let diffRelative: number;
    let scores: { 'INFINITE': number[], "DAILY": number[] } = { "INFINITE": [], "DAILY": [] };
    let guessHistory: GuessHistory = [];

    function getRandomInt(max: number) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    let attempts: number = 0;
    let dayScore: number = 0;
    
    $: $guessHistoryStore && updateValues(); // Recompute when guessHistoryStore changes

    onMount(() => {
        getNextColor();
        updateValues();
    });

    function updateValues() {
        const filteredGuesses = $guessHistoryStore.filter(guess => guess.colorMode === colorMode && guess.playMode === playMode);
        attempts = filteredGuesses.length;
        dayScore = filteredGuesses.reduce((acc, curr) => acc + curr.difference, 0);
    }

    function calculateDifference(guess: RGBColor, target: RGBColor) {
        /* Calculate based on RGB - cmyk should have already been converted to rgb with reactive statement */
        difference = Math.abs(guess.red - target.red) + Math.abs(guess.green - target.green) + Math.abs(guess.blue - target.blue);
        /* Use floor to be nicer to the user */
        diffRelative = Math.floor(100 * difference / (255*3));
        return diffRelative;
    }

    function submitGuess() {
        diffRelative = calculateDifference(rgbColors, target);
        if (playMode == 'INFINITE' || playMode == 'DAILY') {
            scores[playMode].push(diffRelative);
        }
        // Add a guess to the history
        const newGuess = {
            colorMode,
            playMode,
            guessColor: rgbColors,
            targetColor: target,
            difference: diffRelative
        };
        guessHistoryStore.update(guessHistory => [...guessHistory, newGuess]);
        //dayScore += diffRelative; // Maximum difference score is 765 (255 * 3), so we subtract to get the score
        submitted = true;

        if (playMode == "DAILY") {
            if (attempts >= 5 && playMode !== "INFINITE") {
                playMode = "FINISHED";
            } else {
                getNextColor();
            }
        }
        
    }

    function getNextColor() {
        target.red = getRandomInt(255);
        target.green = getRandomInt(255);
        target.blue = getRandomInt(255);

        /* set sliders to midpoint */
        rgbColors = { red: 127, green: 127, blue: 127} as RGBColor;
        cmykColors = { cyan: 50, magenta: 50, yellow: 50, black: 50} as CMYKColor;
    }

    $: if (colorMode == "CMYK") {
        rgbColors = cmykToRgb(cmykColors);
    };

    $: if (playMode === "PRACTICE") {
        target = rgbColors;
    }
</script>

<div class="flex flex-col items-center">
    <h1 class="text-2xl font-bold mb-4">Color Blend Challenge</h1>
    <!-- Mode Selectors -->
    <div>
        <a href="daily-rgb">Daily RGB</a> |
        <a href="practice-rgb">Practice RGB</a> |
        <a href="infinite-rgb">Infinite RGB</a> |
        <a href="daily-cmyk">Daily CMYK</a> |
        <a href="practice-cmyk">Practice CMYK</a> |
        <a href="infinite-cmyk">Infinite CMYK</a>
    </div>

    {#key playMode}
    <!-- Display Mode -->
    <p class="mb-4">Mode: {playMode} | {colorMode}</p>
    {/key}
    <!-- Target Color -->
    {#if playMode == 'FINISHED'}
        {#each guessHistory.filter(guess => guess.playMode === playMode && guess.colorMode === colorMode) as {guessColor, targetColor, difference}, index}
            <div class="flex space-x-4 items-center mb-2">
                <!-- Display the guessed color -->
                <div class="w-12 h-12" style="background-color: {rgbToHash(guessColor)};"></div>
                
                <!-- Display the target color -->
                <div class="w-12 h-12" style="background-color: {rgbToHash(targetColor)};"></div>

                <!-- Display the difference -->
                <p>Difference: {difference}</p>
            </div>
        {/each}
    {/if}
    
    {#if playMode != 'FINISHED'}
        <ColorBoxBase showHex={false} csshex={rgbToHash(target)} />
    {/if}
    <!-- RGB Sliders -->
    {#if colorMode === 'RGB' && playMode !== 'FINISHED'}
        {#each Object.entries(rgbColors) as [color, value], index (color)}
            <div class="mb-2">
                <label class="block text-center">
                    {color[0].toUpperCase() + color.slice(1)}
                    <input type="range" min="0" max="255" value={value} on:input={(e) => rgbColors[color] = +(e.target.value ?? 0)} class="w-48" />
                    <span style="color:rgb({color === 'red' ? value : 0},{color === 'green' ? value : 0},{color === 'blue' ? value : 0})">{value}</span>
                </label>
            </div>
        {/each}
    {/if}


    {#if colorMode === 'CMYK' && playMode !== 'FINISHED'}
        {#each Object.entries(cmykColors) as [color, value], index (color)}
            <div class="mb-2">
                {color}, {value}
                <label class="block text-center">
                    {color[0].toUpperCase() + color.slice(1)}
                    <input type="range" min="0" max="100" value={value} on:input={(e) => cmykColors[color] = +e.target.value ?? 0} class="w-48" />
                    <span>{value}</span> <!-- You might need a function to convert CMYK to RGB or use CSS functions to show the color here -->
                </label>
            </div>
        {/each}
    {/if}

    <!-- Submit & Score Display -->
    {#if playMode !== 'PRACTICE' && playMode !== 'FINISHED'}
        <p class="mb-2">Attempts: {attempts}</p>
        <button class="px-4 py-2 bg-blue-500 text-white rounded" on:click={submitGuess}>Submit</button>
        {#if submitted}
            <p class="mt-2">Difference: {difference} ({diffRelative})</p>
        {/if}
        <p class="mt-2">Day Score: {dayScore}</p>
    {/if}
</div>
