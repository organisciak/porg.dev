<script lang="ts">
    import { page } from '$app/stores';

    import { onMount } from 'svelte';
    import { cmykToRgb, hexToRgb, rgbToHex, rgbColorToRGBDistance } from '$lib/utils/colorTools';
    import type { RGBColor, CMYKColor } from '$lib/utils/colorTools';
    import type { Guess, GuessHistory } from '$lib/colorguesser/types.ts';
    import { guessHistoryStore } from '$lib/colorguesser/guessHistoryStore';
	import ColorBoxBase from '$lib/colorbox/ColorBoxBase.svelte';
    import GuesserModeSelector from '$lib/colorguesser/GuesserModeSelector.svelte';
    import GuesserAnswerBox from '$lib/colorguesser/GuesserAnswerBox.svelte';
    import GuesserScore from '$lib/colorguesser/GuesserScore.svelte';
    import Modal from '$lib/components/Modal.svelte';
    import StarScore from '$lib/colorguesser/StarScore.svelte';
    import AttemptBreadCrumbs from '$lib/colorguesser/AttemptBreadCrumbs.svelte';
    import seedrandom from 'seedrandom';
    import colors from '../../colors/colors.json';

    import Fa from 'svelte-fa';
    import { faBullseye, faQuestion, faUser } from '@fortawesome/free-solid-svg-icons';

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
    
    let targetColorName: string | undefined;
    // routing in +page.server.ts should ensure that these are valid
    let { rawPlayMode, rawColorMode } = $page.params;

    function submitGuess() {
        const diffRelative = rgbColorToRGBDistance(rgbColors, target);

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

        finished = (playMode == 'DAILY') && (attempts > maxAttempts);
        if (!finished) {
            getNextColor();
        }
    }

    function getDailySeed() {
        const now = new Date();
        return now.getUTCFullYear() * 10000 + (now.getUTCMonth() + 1) * 100 + now.getUTCDate();
    }

    function getGameSeed(): number {
        const daySeed:number = getDailySeed();
        const attemptMod:number = attempts * 100;
        const playMod:number = playMode === 'INFINITE' ? 2000 : 0;
        const colorMod:number = colorMode === 'CMYK' ? 1000 : 0;
        return daySeed + playMod + colorMod + attemptMod;
    }

    function getNextColor() {
        const seed = getGameSeed();
        const rng = seedrandom(seed);
        const colorIndex = Math.floor(rng() * Object.keys(colors).length);

        const colorNames: string[] = Object.keys(colors);
        targetColorName = colorNames[colorIndex];
        const colorHex: string = colors[targetColorName];
        console.log(seed, colorIndex, colorHex, hexToRgb(colorHex), targetColorName);
        target = hexToRgb(colorHex);

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

    <!-- Attempt bread crumbs-->
    {#if playMode === 'DAILY' && attempts > 0}
        <p class="mb-2"><AttemptBreadCrumbs bind:attempts /></p>
    {/if}
    
    <!-- Target Color -->
    {#if finished }
    <GuesserScore score={dayScore} />
        {#each $guessHistoryStore.filter(guess => guessFilter(guess, colorMode, playMode)) as guess }
            <GuesserAnswerBox guess={guess} />
        {/each}
    {/if}
    
    {#if !finished }
        <ColorBoxBase shareButton={false} showHex={false} csshex={rgbToHex(target)} colorname={targetColorName} />
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

    <!-- Submit  -->
    {#if playMode !== 'PRACTICE' && !finished }
        <button class="px-4 py-2 bg-blue-500 text-white rounded" on:click={submitGuess}>Submit</button>
    {/if}

    <!-- Score Display-->
    <div class="mt-2 text-center items-center">
        {#if playMode === 'DAILY' && attempts > 0}
            <p class="mt-2">Score: {dayScore}
                {#if submitted && lastScore}(Last guess: <StarScore score={lastScore} />{lastScore}){/if}
            </p>
        {/if}
        {#if playMode === 'INFINITE' && attempts > 0}
        <div class="flex flex-col items-center">
            <p class="flex-auto text-gray-500 text-sm dark:text-gray-400">Score</p>
            <div class="flex-auto">
                <StarScore score={Math.floor(dayScore/attempts)} />
            </div>
        </div>
        {/if}
        {#if (playMode === 'INFINITE' || playMode === 'DAILY') && attempts > 0}
        <div class="flex flex-col items-center">
            
            <div class="text-gray-500 text-sm dark:text-gray-400">
                <hr class="border-t mt-4 mb-2 border-gray-300 dark:border-gray-600" />
            History<br />
            
        </div>
            <div class="flex items-center">
                <Fa class="m-1 flex-auto text-gray-300 dark:text-gray-1000" icon={faUser} />
                <Fa class="m-1 text-gray-300 dark:text-gray-600" icon={faBullseye} />
                <span class="m-1 w-12 text-sm text-gray-300 dark:text-gray-600">Score</span>
            </div>
            <!--loop through filteredGuess from the back to the front, up to ten guesses-->
            {#each filteredGuesses.reverse().slice(0,25) as guess }
                <div class="flex flex-row">
                    <div class="w-4 flex-none h-4 mx-1 bg-grey-500 rounded-sm" style="background-color:{rgbToHex(guess.guessColor)}"></div>
                    <div class="w-4 h-4 mx-1 bg-grey-500 rounded-sm" style="background-color:{rgbToHex(guess.targetColor)}"></div>
                    <div><StarScore score={guess.difference} /></div>
                </div>
            {/each}
        </div>
        {/if}
    </div>
</div>
