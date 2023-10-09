<script lang="ts">
    import { page } from '$app/stores';

    import { onMount } from 'svelte';
    import { cmykToRgb, rgbToHash } from '$lib/utils/colorTools';
    import type { RGBColor, CMYKColor } from '$lib/utils/colorTools';
    import type { Guess, GuessHistory } from '$lib/colorguesser/types.ts';
    import { guessHistoryStore } from '$lib/colorguesser/guessHistoryStore';
	import ColorBoxBase from '$lib/colorbox/ColorBoxBase.svelte';

    type PlayMode = "INFINITE" | "DAILY" | "PRACTICE";
    type ColorMode = "RGB" | "CMYK";

    // init vars
    let playMode: PlayMode;
    let colorMode: ColorMode;
    let guessHistory: GuessHistory = [];
    const maxAttempts = 5;
    let attempts: number = 0;
    let dayScore: number = 0;
    let lastScore: number = 0;
    let submitted: boolean = false;
    let finished: boolean = false;
    let filteredGuesses: GuessHistory = [];
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
    function getRandomInt(max: number) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    let target: RGBColor = {
        red: getRandomInt(255),
        green: getRandomInt(255),
        blue: getRandomInt(255)
        };
    
    // routing in +page.server.ts should ensure that these are valid
    let { rawPlayMode, rawColorMode } = $page.params;

    function calculateDifference(guess: RGBColor, target: RGBColor) {
        /* Calculate based on RGB - cmyk should have already been converted to rgb with reactive statement */
        const difference = Math.abs(guess.red - target.red) + Math.abs(guess.green - target.green) + Math.abs(guess.blue - target.blue);
        /* Use floor to be nicer to the user */
        const diffRelative = Math.floor(100 * difference / (255*3));
        return diffRelative;
    }

    function submitGuess() {
        const diffRelative = calculateDifference(rgbColors, target);

        // Add a guess to the history
        const newGuess = {
            colorMode,
            playMode,
            guessColor: rgbColors,
            targetColor: target,
            difference: diffRelative
        };
        guessHistoryStore.update(guessHistory => [...guessHistory, newGuess]);
        submitted = true;

        console.log('attempts', attempts);
        finished = (playMode == 'DAILY') && (attempts > maxAttempts);
        if (!finished) {
            getNextColor();
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

    function guessFilter(guess: Guess, colorMode: ColorMode, playMode: PlayMode): boolean {
        return guess.colorMode === colorMode && guess.playMode === playMode;
    }

    function updateValues() {
        filteredGuesses = $guessHistoryStore.filter(guess => guessFilter(guess, colorMode, playMode));
        attempts = filteredGuesses.length;
        dayScore = filteredGuesses.reduce((acc, curr) => acc + curr.difference, 0);
        lastScore = filteredGuesses[filteredGuesses.length - 1]?.difference;
        finished = (playMode == 'DAILY') && (attempts >= maxAttempts);
    }

    onMount(() => {
        getNextColor();
        updateValues();
    });

        
    $: {
        rawPlayMode = $page.params.playMode.toUpperCase();
        rawColorMode = $page.params.colorMode.toUpperCase();
        // Typed
        playMode = rawPlayMode.toUpperCase() as PlayMode;
        colorMode = rawColorMode.toUpperCase() as ColorMode;

        updateValues();
    };
    
    $: $guessHistoryStore && updateValues(); // Recompute when guessHistoryStore changes

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
    {#if finished }
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
    
    {#if !finished }
        <ColorBoxBase showHex={false} csshex={rgbToHash(target)} />
    {/if}
    <!-- RGB Sliders -->
    {#if colorMode === 'RGB' && !finished}
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


    {#if colorMode === 'CMYK' && !finished }
        {#each Object.entries(cmykColors) as [color, value], index (color)}
            <div class="mb-2">
                <label class="block text-center">
                    {color[0].toUpperCase() + color.slice(1)}
                    <input type="range" min="0" max="100" value={value} on:input={(e) => cmykColors[color] = +e.target.value ?? 0} class="w-48" />
                    <span>{value}</span> <!-- You might need a function to convert CMYK to RGB or use CSS functions to show the color here -->
                </label>
            </div>
        {/each}
    {/if}

    <!-- Submit & Score Display -->
    {#if playMode !== 'PRACTICE' && !finished }
        <button class="px-4 py-2 bg-blue-500 text-white rounded" on:click={submitGuess}>Submit</button>
        
        {#if playMode === 'DAILY'}
        <p class="mb-2">Attempts: {attempts}</p>
        <p class="mt-2">Score: {dayScore}{#if submitted}(Last guess: {lastScore}){/if}</p>
        {/if}
        {#if playMode === 'INFINITE'}
        <p class="mt-2">Avg Score: {Math.floor(dayScore/attempts)}{#if submitted}(Last guess: {lastScore}){/if}</p>
        {/if}
    {/if}
</div>
