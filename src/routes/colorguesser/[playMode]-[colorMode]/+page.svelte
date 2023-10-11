<script lang="ts">
    import { page } from '$app/stores';

    import { onMount } from 'svelte';
    import { cmykToRgb, rgbToHex } from '$lib/utils/colorTools';
    import type { RGBColor, CMYKColor } from '$lib/utils/colorTools';
    import type { Guess, GuessHistory } from '$lib/colorguesser/types.ts';
    import { guessHistoryStore } from '$lib/colorguesser/guessHistoryStore';
	import ColorBoxBase from '$lib/colorbox/ColorBoxBase.svelte';
    import GuesserModeSelector from '$lib/colorguesser/GuesserModeSelector.svelte';
    import GuesserAnswerBox from '$lib/colorguesser/GuesserAnswerBox.svelte';
    import GuesserScore from '$lib/colorguesser/GuesserScore.svelte';
    import Modal from '$lib/components/Modal.svelte';
    import StarScore from '$lib/colorguesser/StarScore.svelte';

    import Fa from 'svelte-fa';
    import { faQuestion } from '@fortawesome/free-solid-svg-icons';

    type PlayMode = "INFINITE" | "DAILY" | "PRACTICE";
    type ColorMode = "RGB" | "CMYK";


    // init vars
    let showModal = false;
    let playMode: PlayMode;
    let colorMode: ColorMode;
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
        target = {
            red: getRandomInt(255),
            green: getRandomInt(255),
            blue: getRandomInt(255)
        };

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

<Modal bind:showModal>
	<h2 slot="header">
		About the Color Guess Challenge
	</h2>

    <div>
        <h3>
            Goal
        </h3>
       Get as low of a score as possible. 
        
        <h3>Modes</h3>
        <ol>
            <li><span class='font-semibold'>Infinite</span> - Guess as many colors as you can. Your score is the average of all your guesses.</li>
            <li><span class='font-semibold'>Daily</span> - Guess 5 colors. Your score is the sum of your guesses.</li>
            <li><span class='font-semibold'>Practice</span> - See the result of your slider color selection.</li>
        </ol>

        <h3>Color Modes</h3>
        <ol>
            <li><span class='font-semibold'>RGB</span> - Red, Green, Blue. The colors of light.</li>
            <li><span class='font-semibold'>CMYK (hard mode!)</span> - Cyan, Magenta, Yellow, Black. The colors of ink.</li>
        </ol>

    </div>
</Modal>


<div class="flex flex-col items-center">
    <h1 class="text-2xl font-bold mb-4">Color Guess Challenge <button on:click={() => (showModal = true)}><Fa class="text-blue-200" icon={faQuestion} /></button></h1>
    <!-- Mode Selectors -->
    <GuesserModeSelector colorMode={colorMode} playMode={playMode}/>

    <!-- Target Color -->
    {#if finished }
    <GuesserScore score={dayScore} />
        {#each $guessHistoryStore.filter(guess => guessFilter(guess, colorMode, playMode)) as guess }
            <GuesserAnswerBox guess={guess} />
        {/each}
    {/if}
    
    {#if !finished }
        <ColorBoxBase shareButton={false} showHex={false} csshex={rgbToHex(target)} />
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
        <p class="mt-2">Score: {dayScore}
            {#if submitted && lastScore}(Last guess: <StarScore score={lastScore} />{lastScore}){/if}
        </p>
        {/if}
        {#if playMode === 'INFINITE'}
        <p class="mt-2">
            {#if attempts > 0}Avg Score: <StarScore score={Math.floor(dayScore/attempts)} />{/if}
            {#if submitted && lastScore}<br/>Last: <StarScore score={lastScore} />{/if}
        </p>
        {/if}
    {/if}
</div>
