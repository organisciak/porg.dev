<script lang="ts">
    import { page } from '$app/stores';

    import { onMount } from 'svelte';
    import { cmykToRgb, hexToRgb, rgbToHex, rgbColorToRGBDistance,
            cmykToHexByKey, rgbToHexByKey
           } from '$lib/utils/colorTools';
    import type { RGBColor, CMYKColor } from '$lib/utils/colorTools';
    import type { Guess, GuessHistory } from '$lib/colorguesser/types.ts';
    import { guessHistoryStore } from '$lib/colorguesser/guessHistoryStore';
	import ColorBoxBase from '$lib/colorbox/ColorBoxBase.svelte';
    import GuesserModeSelector from '$lib/colorguesser/GuesserModeSelector.svelte';
    import GuesserAnswerBox from '$lib/colorguesser/GuesserAnswerBox.svelte';
    import Modal from '$lib/components/Modal.svelte';
    import StarScore from '$lib/colorguesser/StarScore.svelte';
    import AttemptBreadCrumbs from '$lib/colorguesser/AttemptBreadCrumbs.svelte';
    import seedrandom from 'seedrandom';
    import colors from '../../colors/colors.json';

    import Fa from 'svelte-fa';
    import { faBullseye, faQuestion, faGear, faUser } from '@fortawesome/free-solid-svg-icons';

    type PlayMode = "INFINITE" | "DAILY" | "PRACTICE";
    type ColorMode = "RGB" | "CMYK";


    // init vars
    let showModal = false;
    let settingsModal = false;

    let playMode: PlayMode;
    let colorMode: ColorMode;
    const maxAttempts = 5;
    let attempts: number = 0;
    let dayScore: number = 0;
    let finished: boolean = false;
    let filteredGuesses: GuessHistory = [];
    let startedDaily: { RGB: boolean, CMYK: boolean } = {
        RGB: false,
        CMYK: false
    };
    // Attempts by color mode
    let dailyAttempts: { RGB: number, CMYK: number };
    let finishedDaily: { RGB: boolean, CMYK: boolean } = {
        RGB: false,
        CMYK: false
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

        finished = (playMode == 'DAILY') && (attempts > maxAttempts);
    }

    function getDailySeed() {
        const now = new Date();
        return now.getUTCFullYear() * 10000 + (now.getUTCMonth() + 1) * 100 + now.getUTCDate();
    }

    function getGameSeed(): string {
        const daySeed:number = getDailySeed();
        return `${daySeed}-${playMode}-${colorMode}-${attempts}`;
    }

    function getNextColor() {
        updateValues();

        const seed = getGameSeed();
        const rng = seedrandom(seed);
        const colorIndex = Math.floor(rng() * Object.keys(colors).length);

        const colorNames: string[] = Object.keys(colors);
        if (playMode === 'PRACTICE') {
            targetColorName = '';
        } else {
            targetColorName = colorNames[colorIndex];
            const colorHex: string = colors[targetColorName];
            target = hexToRgb(colorHex);

            /* set sliders to midpoint */
            rgbColors = { red: 127, green: 127, blue: 127} as RGBColor;
            cmykColors = { cyan: 50, magenta: 50, yellow: 50, black: 50} as CMYKColor;
        }
    }

    function guessFilter(guess: Guess, colorMode: ColorMode, playMode: PlayMode): boolean {
        return guess.colorMode === colorMode && guess.playMode === playMode;
    }

    function updateValues() {
        // Actions triggered by changes to the guessHistoryStore
        filteredGuesses = $guessHistoryStore.filter(guess => guessFilter(guess, colorMode, playMode));
        attempts = filteredGuesses.length;
        dayScore = filteredGuesses.reduce((acc, curr) => acc + curr.difference, 0);
        finished = (playMode == 'DAILY') && (attempts >= maxAttempts);
    }

    onMount(() => {
        getNextColor();
    });

    $: {
        rawPlayMode = $page.params.playMode.toUpperCase();
        rawColorMode = $page.params.colorMode.toUpperCase();
        // Typed
        playMode = rawPlayMode.toUpperCase() as PlayMode;
        colorMode = rawColorMode.toUpperCase() as ColorMode;
        getNextColor();
    };

    $: {
        dailyAttempts = {
            RGB: $guessHistoryStore.filter(guess => guessFilter(guess, 'RGB', 'DAILY')).length,
            CMYK: $guessHistoryStore.filter(guess => guessFilter(guess, 'CMYK', 'DAILY')).length
        }
        finishedDaily = {
            RGB: dailyAttempts.RGB >= maxAttempts,
            CMYK: dailyAttempts.CMYK >= maxAttempts,
        }
        startedDaily = {
            RGB: dailyAttempts.RGB > 0 && !finishedDaily.RGB,
            CMYK: dailyAttempts.CMYK > 0 && !finishedDaily.CMYK
        }
    };
    
    $: $guessHistoryStore && getNextColor();

    $: if (colorMode == "CMYK") {
        rgbColors = cmykToRgb(cmykColors);
    };

    $: if (playMode === "PRACTICE" && !startedDaily['CMYK'] && !startedDaily['RGB']) {
        target = rgbColors;
    }
    // whether to hide the game until explicitly started. This is done so
    // that we have a signal to turn off practice mode
    let startMenu: boolean = false;
    let practiceLock: boolean = false;
    $: startMenu = playMode == 'DAILY' && !(startedDaily[colorMode]);
    $: practiceLock = playMode === 'PRACTICE' && (startedDaily['RGB'] || startedDaily['CMYK']);

    const baseNameRef = {
        "red": "#ff0000",
        "green": "#00ff00",
        "blue": "#0000ff",
        "cyan": "#00ffff",
        "magenta": "#ff00ff",
        "yellow": "#ffff00",
        "black": "#000000"
    }
</script>
  
<Modal bind:showModal={showModal}>
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

<Modal bind:showModal={settingsModal}>
    <h2 slot="header">
		Settings
	</h2>
    <GuesserModeSelector colorMode={colorMode} playMode={playMode} practiceLock={(startedDaily['RGB'] || startedDaily['CMYK'])} />
</Modal>

<div class="flex flex-col items-center">

    <div class="flex-grow">
        <h1 class="text-2xl font-bold mb-3 bg-gradient-to-r from-cyan-600 via-violet-500 to-yellow-500 text-transparent bg-clip-text">Color Guess Challenge</h1>
        <div>
            <button on:click={() => (showModal = true)}><Fa class="text-blue-200" icon={faQuestion} /></button>
            <button on:click={() => (settingsModal = true)}><Fa class="text-blue-200" icon={faGear} /></button>
        </div>
        <div>
            {#if playMode.toLowerCase() === 'practice'}
                <span class="text-slate-400 text-xs uppercase mx-2">Color mode</span>
                {#each ['RGB', 'CMYK'] as mode}
                    {#if mode.toUpperCase() == colorMode}
                        <span class='font-extrabold mx-2'>{mode}</span>
                    {:else}
                        <a class='font-light mx-2' data-sveltekit-prefetch href="{playMode.toLowerCase()}-{mode.toLowerCase()}">{mode}</a>
                    {/if}
                {/each}
            {/if}
            <hr class='my-2 dark:border-gray-600 border-gray-300' />
        </div>
    </div>

    <div class="flex-grow">
    {#if finished || (playMode === 'INFINITE' && attempts > 0) }
            <div class="flex flex-col items-center">
                {#if playMode === 'INFINITE'}
                <p class="flex-auto text-gray-500 text-sm dark:text-gray-400">Infinite Score</p>
                {:else if playMode == 'DAILY'}
                <p class="flex-auto text-bold bg-gradient-to-r from-magenta  to-cyan-600  text-transparent bg-clip-text font-bold">Your Score</p>
                {/if}
                <div class="flex-auto">
                    <StarScore score={Math.floor(dayScore/attempts)} />
                </div>
            </div>
            {/if}
    </div>

    <div class="flex-grow border-slate-900 border-2 p-2 m-3 bg-clip-border rounded-lg">
        <!-- Target Color & Breadcrumb -->
        {#if finished }
            {#each $guessHistoryStore.filter(guess => guessFilter(guess, colorMode, playMode)) as guess }
                <GuesserAnswerBox guess={guess} />
            {/each}
        {:else if practiceLock }
            <div class='text-sm italic'>
            Practice is disabled while a daily game is going on. Try it later!
            </div>
        {:else if startMenu }
            <div class='text-sm w-64'>
                <h3 class="text-center">How to Play</h3>
                <p class='my-3'>You're given a 
                    <span class="font-semibold bg-gradient-to-r from-magenta  to-cyan-600  text-transparent bg-clip-text">target</span> color, and you have to guess what composition of 
                    {#if colorMode==='RGB' }
                        <span class='font-semibold text-red-500'>red</span>, <span class='font-semibold text-green-500'>green</span>, and <span class='font-semibold text-blue-500'>blue</span>
                    {:else if colorMode==='CMYK' }
                    <span class='font-semibold text-cyan-400'>cyan</span>, <span class='font-semibold text-magenta'>magenta</span>, <span class='font-semibold text-yellow-500'>yellow</span>, and <span class='font-semibold'>black</span>
                    {/if}
                combine to make the target.</p>

                <p class='my-3'>Get as close as you can. Each day has <span class="font-semibold">5</span> target colors to get as high a score as possible.</p>
                <p class='my-3'>Before you start, try <a data-sveltekit-prefetch href="practice-{colorMode.toLowerCase()}">Practice Mode</a>. There's also 
                    {#if colorMode==='RGB' }
                        a harder <a data-sveltekit-prefetch href="daily-cmyk">CMYK</a> mode.
                    {:else if colorMode==='CMYK' }
                        an easier <a data-sveltekit-prefetch href="daily-rgb">RGB</a> mode.
                    {/if}
                </p>
                <p class='my-3 italic text-xs'>
                    Tip: 
                    {#if colorMode==='RGB' }
                        RGB is additive: it gets lighter as you add color. 
                    {:else if colorMode==='CMYK' }
                        CMYK mode is based on inks, and is subtractive: it gets darker as you add color. Black is redundant - you can make any color without it if you like!
                    {/if}
                </p>
            </div>
            <!--Button that sets startedDaily[playMode]to true-->
            <button class="bg-cyan-400 hover:bg-cyan-500 focus:bg-cyan-500 text-white font-semibold py-2 px-6 rounded-full border border-cyan-500 shadow-lg justify-center" on:click={() => startedDaily[colorMode] = true}>Start</button>
        {:else }
            {#if playMode === 'DAILY'}
                <p class="mb-2"><AttemptBreadCrumbs bind:attempts /></p>
            {/if}
            <ColorBoxBase shareButton={false} showHex={false} textSize='xs' width={48} height={48} csshex={rgbToHex(target)} colorname={targetColorName} />
        {/if}
    </div>

    <div class="flex flex-grow flex-col items-center">
        <!-- RGB Sliders -->
        {#if colorMode === 'RGB' && !finished && !startMenu && !practiceLock }
            {#each Object.entries(rgbColors) as [color, value], index (color)}
                <div class="mb-2 w-full">
                    <label class="text-center flex flex-row justify-center items-center">
                        <span class='w-10 text-xs'>{color[0].toUpperCase() + color.slice(1)}</span>
                        <input type="range" min="0" max="255" value={value} on:input={(e) => rgbColors[color] = +(e.target.value ?? 0)}
                            class="bg-white w-48 flex-auto border-2 border-gray-500 rounded-lg cursor-pointer appearance-none" />
                        <span style="color:{rgbToHexByKey(value, color)}" class="w-8">{value}</span>
                    </label>
                </div>
            {/each}
        {/if}
        

        {#if colorMode === 'CMYK' && !finished && !startMenu && !practiceLock}
            {#each Object.entries(cmykColors) as [color, value], index (color)}
                <div class="mb-2 w-full">
                    <label class="text-center flex flex-row justify-center items-center">
                        <span class='w-14 text-xs'>{color[0].toUpperCase() + color.slice(1)}</span>
                        <input style="{cmykToHexByKey(100, color)}" type="range" min="0" max="100" value={value} on:input={(e) => cmykColors[color] = +e.target.value ?? 0}
                                class="bg-gradient-to-r from-white to-[{baseNameRef[color.toLowerCase()]}] w-48 flex-auto border-2 border-black rounded-lg cursor-pointer appearance-none" />
                        <span style="color:{cmykToHexByKey(value, color)}" class="w-8">{value}</span>
                    </label>

                </div>
            {/each}
        {/if}

        <!-- Submit  -->
        {#if playMode !== 'PRACTICE' && !finished && !startMenu }
            <button class="px-4 py-2  border-slate-800 border-2 p-5 bg-black rounded-lg hover:bg-gradient-to-r hover:from-cyan-600 hover:via-violet-500 hover:to-yellow-500 text-transparent bg-clip-text" on:click={submitGuess}>Submit</button>
        {/if}
    </div>

    <!-- Mode specific bottom message-->
    <div class='text-sm text-center'>
        {#if playMode === 'PRACTICE'}
        
            <hr class='my-2 dark:border-gray-600 border-gray-300' />
            <p class='my-1'>
                {#if finishedDaily['RGB']}
                    Play <a data-sveltekit-prefetch href="infinite-rgb">Infinite Mode</a>
                {:else}
                    Play <a data-sveltekit-prefetch href="daily-rgb">Daily Mode</a>
                {/if}
            </p>
            {#if colorMode == 'CMYK'}
                <p class='my-1'>
                    Or
                    {#if finishedDaily['CMYK']}
                        <a data-sveltekit-prefetch href="infinite-cmyk">CMYK Infinite Mode</a>
                    {:else}
                        <a data-sveltekit-prefetch href="daily-cmyk">CMYK Daily Mode</a>
                    {/if}
                </p>
            {/if}
        {:else if playMode == 'DAILY' && finished}
        <p class='my-1'>Challenge yourself again tomorrow, or try <a data-sveltekit-prefetch href="infinite-{colorMode.toLowerCase()}">Infinite Mode</a>.</p>
            {#if colorMode == 'RGB' && !finishedDaily['CMYK']}
                <p class='my-1'>Want a challenge? Play <a data-sveltekit-prefetch href="daily-cmyk">CMYK Daily Mode</a></p>
            {:else if colorMode == 'CMYK' && !finishedDaily['RGB']}
            <p class='my-1'>You finished CMYK. Try the RGB<a data-sveltekit-prefetch href="daily-rgb">Daily Mode</a></p>
            {/if}
        {/if}
    </div>
    
    <div class="flex-grow flex flex-col">
        <!-- Score History Display-->
        <div class="mt-2 text-center items-center mb-10">
            
            {#if (playMode === 'INFINITE' || playMode === 'DAILY') && attempts > 0}
            <div class="flex flex-col items-center">
                
                <div class="text-gray-500 text-sm dark:text-gray-400">
                    <hr class="border-t mt-4 mb-2 border-gray-300 dark:border-gray-600" />
                History<br />
                
            </div>
                <div class="flex items-center">
                    <Fa class="mr-1 text-gray-300 dark:text-gray-600" icon={faBullseye} />
                    <Fa class="m-1 text-gray-300 dark:text-gray-1000" icon={faUser} />
                    <span class="m-1 w-12 text-sm text-gray-300 dark:text-gray-600">Score</span>
                </div>
                <!--loop through filteredGuess from the back to the front, up to ten guesses-->
                {#each filteredGuesses.reverse().slice(0,25) as guess }
                    <div class="flex flex-row">
                        <div class="w-4 h-4 mx-1 bg-grey-500 rounded-sm" style="background-color:{rgbToHex(guess.targetColor)}"></div>
                        <div class="w-4 flex-none h-4 mx-1 bg-grey-500 rounded-sm" style="background-color:{rgbToHex(guess.guessColor)}"></div>
                        <div><StarScore score={guess.difference} /></div>
                    </div>
                {/each}
            </div>
            {/if}
        </div>
    </div>
</div>