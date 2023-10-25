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
        if (playMode == 'DAILY' && attempts > 0) {
            startedDaily[colorMode] = true;
        }
        dayScore = filteredGuesses.reduce((acc, curr) => acc + curr.difference, 0);
        finished = (playMode == 'DAILY') && (attempts >= maxAttempts);
        if (finished) {
            startedDaily[colorMode] = false;
        }
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
            <p class='text-sm w-48'>This is the landing page before you start a game. I'll add some instructions here. Clicking 'start' disables practice mode.</p>
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
</div>