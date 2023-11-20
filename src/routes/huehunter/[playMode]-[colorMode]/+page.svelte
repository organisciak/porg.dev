<script lang="ts">
    import { page } from '$app/stores';
    import { onMount, onDestroy } from 'svelte';
    import seedrandom from 'seedrandom';
    import { MetaTags } from 'svelte-meta-tags';
    import Fa from 'svelte-fa';
    import { faBullseye, faQuestion, faGear, faUser, faChartSimple } from '@fortawesome/free-solid-svg-icons';
    import { faGithub, faLinkedinIn, faMastodon, faTwitter } from '@fortawesome/free-brands-svg-icons';

    /* Color tools */
    import { cmykToRgb, hexToRgb, rgbToHex, rgbColorToRGBDistance,
            cmykToHexByKey, rgbToHexByKey
           } from '$lib/utils/colorTools';
    import type { RGBColor, CMYKColor } from '$lib/utils/colorTools';
    import type { Guess, GuessHistory, GuessStats } from '$lib/huehunter/types.ts';

    /* Svelte components */
	import ColorBoxBase from '$lib/colorbox/ColorBoxBase.svelte';
    import GuesserModeSelector from '$lib/huehunter/GuesserModeSelector.svelte';
    import GuesserAnswerBox from '$lib/huehunter/GuesserAnswerBox.svelte';
    import Modal from '$lib/components/Modal.svelte';
    import HueHunterScore from '$lib/huehunter/HueHunterScore.svelte';
    import AttemptBreadCrumbs from '$lib/huehunter/AttemptBreadCrumbs.svelte';

    /* Stores */
    import { isCollapsed } from '$lib/stores/headerCollapse';
    import { guessHistoryStore, cullOldRecords, guessHistoryStats } from '$lib/huehunter/guessHistoryStore';

    /* Data */
    import colors from '../../colors/colors.json';
    import { calculateBoundScore, moonScale, rawScoreThreshold } from '$lib/huehunter/colorGuesser';
    // import { darkModeSetting } from '$lib/stores/darkModeStore.js';

    /* Variable Defaults */
    type PlayMode = "INFINITE" | "DAILY" | "PRACTICE";
    type ColorMode = "RGB" | "CMYK";

    const meta = {
		title: 'Hue Hunter',
		description: 'A color guessing game',
		url: 'https://www.porg.dev/huehunter'
	}
    $isCollapsed = true;
    onDestroy(() => {
        $isCollapsed = false;
    });

    // init vars
    let showModal = false;
    let settingsModal = false;
    let statsModal = false;
    let aboutModal = false;

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

    let shareable: boolean = false;
    let currentDifference: number = 0;

    function getRandomInt(max: number) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    let target: RGBColor = {
        red: getRandomInt(255),
        green: getRandomInt(255),
        blue: getRandomInt(255)
        };
    let practiceColor: RGBColor;
    
    let targetColorName: string | undefined;
    // routing in +page.server.ts should ensure that these are valid
    let { rawPlayMode, rawColorMode } = $page.params;

    let stats: GuessStats = {
        colorsGuessed: 0,
        daysPlayed: 0,
        histogram: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        averageScore: 0,
        scoreByDate: []
    }; 

    $: {
        if (playMode == 'PRACTICE') {
            currentDifference = rgbColorToRGBDistance(rgbColors, target);
        }
    }

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
        const colorNames: string[] = Object.keys(colors);
        const seed: string = getGameSeed();
        const rng = seedrandom(seed);
        let colorIndex: number = Math.floor(rng() * Object.keys(colors).length);

        if (playMode == 'PRACTICE') {
            colorIndex =  Math.floor(Math.random() * Object.keys(colors).length);
        }
        targetColorName = colorNames[colorIndex];
        const colorHex: string = colors[targetColorName];
        target = hexToRgb(colorHex);

        /* set sliders to midpoint */
        rgbColors = { red: 127, green: 127, blue: 127} as RGBColor;
        cmykColors = { cyan: 50, magenta: 50, yellow: 50, black: 50} as CMYKColor;
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

    //let darkModeClass = '';
    onMount(() => {
        getNextColor();
        cullOldRecords();

        if (navigator.share && navigator.canShare) {
            shareable = true;
        }

        /*darkModeSetting.subscribe((setting) => {
            if (setting === 'system') {
            darkModeClass = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : '';
            } else {
            darkModeClass = setting;
            }
        });*/
    });

    async function share(rawScore: number) {
        const beHelpful:boolean = true;
        const normalizedScore:number = Math.min(5,
            calculateBoundScore(rawScore, rawScoreThreshold, 20)/4 + (beHelpful ? .2 : 0)
            );
        const moonScore:string = moonScale(normalizedScore, 5);
        const date = new Date();
        const msg:string = `${date.getMonth()+1}/${date.getDate()} ${colorMode}\n${moonScore}\n`;

        
        if (shareable) {
            navigator.share({
                title: meta.title,
                text: msg,
                url: 'https://hues.red'
            })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
        } else {
            alert("Web Share API not supported.");
        }
    }

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
        practiceColor = rgbColors;
    }
    // whether to hide the game until explicitly started. This is done so
    // that we have a signal to turn off practice mode
    let startMenu: boolean = false;
    let practiceLock: boolean = false;
    $: startMenu = playMode == 'DAILY' && !(startedDaily[colorMode]) && !finished;
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

    /*const complementaryColor = {
        "red": "cyan",
        "green": "magenta",
        "blue": "yellow",
        "cyan": "red",
        "magenta": "green",
        "yellow": "blue",
        "black": "white"
    }*/

    function sliderChange(e, color: string) {
        if (colorMode === 'RGB') {
            rgbColors[color] = +(e.target.value ?? 0)
        } else {
            cmykColors[color] = +(e.target.value ?? 0)
        }
    };

    function textShadowCSS(color: string, amountOfColor: number) {
        let bgColor: string;
        let opacity: number;
        // if color is red, blue or green, use white text shadow
        if (['red', 'green', 'blue'].includes(color)) {
            bgColor = "#ffffff";
            opacity = 1 - amountOfColor / 255;
        } else {
            bgColor = "#000000";
            opacity = 1- amountOfColor / 100;
        }
        // convert opacity to hex
        const opacityBase16 = Math.round(opacity * 255).toString(16);
        //const bgColor: string = baseNameRef[complementaryColor[color]] + opacityBase16;
        const cssString = `text-shadow: -1px -1px 0px ${bgColor}${opacityBase16},
            -1px  1px 0px ${bgColor}${opacityBase16},        
             1px -1px 0px ${bgColor}${opacityBase16},
             1px  1px 0px ${bgColor}${opacityBase16}`;
        return cssString;
    }
</script>

<svelte:head>

    <meta name="theme-color" content="{baseNameRef['magenta']}">
    <link rel="icon" type="image/webp" sizes="16x16" href="/huehunter-assets/favicon-16x16.webp" />
    <link rel="icon" type="image/webp" sizes="32x32" href="/huehunter-assets/favicon-32x32.webp" />
    <link rel="apple-touch-icon" type="image/webp" sizes="180x180" href="/huehunter-assets/apple-touch-icon.webp">
    <link rel="manifest" href="/huehunter-assets/huehunter-manifest.json">

    <MetaTags 
        title="{meta.title}"
        canonical="{meta.url}"
        description="{meta.description}"
        openGraph={{
            siteName: 'porg.dev',
            type: 'website',
            url: meta.url,
            locale: 'en_US',
            title: meta.title,
            description: meta.description,
            images: [
            {
                url: 'https://www.porg.dev/huehunter-assets/hue-splash.webp',
                alt: `${meta.title} splash image`,
                width: 1024,
                height: 1024,
                type: 'image/png'
            }
            ]
        }}
        twitter={{
            handle: '@porg',
            site: '@porg',
            cardType: 'summary_large_image',
            title: meta.title,
            description: meta.description,
            image: 'https://www.porg.dev/huehunter-assets/hue-splash.webp',
            imageAlt: `${meta.title} splash image`
        }}
        />
</svelte:head>
<Modal bind:showModal={statsModal}>
    <h2 slot="header" class="text-center cmy-text-gradient">
		Stats
	</h2>
    <div class="flex flex-wrap max-w-lg items-center text-center justify-center">
    {#if stats.colorsGuessed > 3}

        {#if stats.streak > 0}
        <div class="bg-cyan-100 dark:bg-cyan-700 p-4 m-2 rounded-md">
            <h4 class="font-semibold">Streak</h4>
            <p>{stats.streak} days in a row</p>
        </div>
        {/if}

        <div class="bg-violet-100 dark:bg-violet-700 p-4 m-2 rounded-md">
            <h4 class="font-semibold">Days Played</h4>
            <p>{stats.daysPlayed}</p>
        </div>
        
        <div class="bg-red-100 dark:bg-red-700 p-4 m-2 rounded-md">
            <h4 class="font-semibold">Average Score</h4>
            <p>{Math.round(10*stats.averageScore)/10}/10</p>
        </div>

        <div class="flex-auto p-4 m-2 rounded-md w-full  text-center items-center">
            <h4 class="font-semibold">Distribution of Scores</h4>
            <div>
                {#each stats.histogram as count, index }
                    <div class="w-4 h-full m-px flex-col text-center text-xs text-gray-300 inline-block align-baseline">
                        <div class=" bg-violet-500 rounded-sm"
                            style="height:{0.1+8*(count/stats.colorsGuessed)}rem">
                        </div>
                        {index}
                    </div>
                {/each}
            </div>
        </div>

        <div class="p-4 rounded-md w-full text-center items-center">
            <h4 class="font-semibold">Recent Scores</h4>
                {#each stats.scoreByDate as recentScore}
                    <div>
                        <span>{recentScore.date.toDateString()}</span>: <span><HueHunterScore score={recentScore.score} /></span>
                    </div>
                {/each}
        </div>

    {:else}
        Play a few games to see your stats!
    {/if}
    </div>
</Modal>

<Modal bind:showModal={showModal}>
	<h2 slot="header" class="text-center cmy-text-gradient">
		About {meta.title}
	</h2>

    <div class='text-center'>
        <h3 class='mt-3'>
            Goal
        </h3>
       Guess the composition of colors that make up a target color. Get as close as you can! 
        
        <h3 class='mt-3'>Modes</h3>
        <div class="flex flex-row text-center">
            <p><a data-sveltekit-prefetch href="daily-{colorMode.toLowerCase()}" class='font-semibold'>Daily</a><br />Guess 5 colors specific to today</p>
            <p><a data-sveltekit-prefetch href="infinite-{colorMode.toLowerCase()}" class='font-semibold'>Infinite</a><br />Guess as many colors as you like</p>
            <p><a data-sveltekit-prefetch href="practice-{colorMode.toLowerCase()}" class='font-semibold'>Practice</a><br />See the result of your color selection</p>
        </div>

        <h3 class='mt-3'>Color Modes</h3>
        <div class="flex flex-row text-center">
            <div class="m-1 p-1">
                <p><a data-sveltekit-prefetch href="{playMode.toLowerCase()}-rgb" class='font-semibold'>RGB</a><br />Red, Green, Blue<br />These are additive, like light. As you add colors, the final color grows lighter.</p>
                <img src="/huehunter-assets/color-mix_RGBmix.webp" alt="RGB color mix" class="inline-block w-24 h-24" />
            </div>
            <div class="m-1 p-1">
                <p><a data-sveltekit-prefetch href="{playMode.toLowerCase()}-cmyk" class='font-semibold'>CMYK (hard mode!)</a><br />Cyan, Magenta, Yellow, Black<br />These are subtractive, like ink. As you add colors, the final color gets darker.</p>
                <img src="/huehunter-assets/color-mix_CMYKmix.webp" alt="CMYK color mix" class="inline-block w-24 h-24" />
            </div>
        </div>
    </div>
    <hr class='my-2 dark:border-gray-600 border-gray-300' />
    <div class='text-center flex flex-col'>
        <p>Created in Denver with ❤️ by <a href="https://www.porg.dev">Peter Organisciak</a></p>
        <div class="flex text-center items-center justify-center">
            <a href="https://sigmoid.social/@porg" aria-label="Follow me on Mastodon" target="_blank"rel="me" class="p-1 text-lg hover:-rotate-6"><Fa icon={faMastodon} /></a>
            <a href="https://github.com/organisciak"  aria-label="Follow me on Github" target="_blank" class="p-1 text-lg hover:-rotate-6"><Fa icon={faGithub} /></a>
            <a href="https://twitter.com/POrg" target="_blank" aria-label="Please don't follow me on X" class="p-1 text-lg hover:-rotate-6"><Fa icon={faTwitter} /></a>
            <a href="https://www.linkedin.com/in/organisciak/" aria-label="I have a LinkedIn, I suppose" target="_blank" class="p-1 text-lg hover:-rotate-6"><Fa icon={faLinkedinIn} /></a>
        </div>
    </div>
</Modal>

<Modal bind:showModal={settingsModal}>
    <h2 slot="header" class="text-center cmy-text-gradient">
		Settings
	</h2>
    <GuesserModeSelector colorMode={colorMode} playMode={playMode} practiceLock={(startedDaily['RGB'] || startedDaily['CMYK'])} />
        
    <!--<select bind:value={$darkModeSetting}>
          <option value="system">System</option>
          <option value="dark">Dark</option>
          <option value="light">Light</option>
    </select>-->
</Modal>

<Modal bind:showModal={aboutModal}>
    <h2 slot="header" class="text-center cmy-text-gradient">
		About
	</h2>
</Modal>

<div class="flex flex-col items-center">

    <!-- Header / Controls -->
    <div class="flex-none flex-row w-full text-center items-center">
        <h1 class="title mt-4 text-2xl" class:text-4xl={startMenu} class:mt-8={startMenu}>
            <a class="font-bold cmy-text-gradient" href="/huehunter/daily-rgb">{meta.title}</a>
        </h1>
        <div class="flex text-lg justify-center items-center" class:text-xl={startMenu}>
            <button class="flex flex-initial w-10 h-10 justify-center items-center" on:click={() => (showModal = true)}><Fa class="text-cyan-500" icon={faQuestion} /></button>
            <button class="flex flex-initial w-10 h-10 justify-center items-center" on:click={() => (settingsModal = true)}><Fa class="text-magenta" icon={faGear} /></button>
            <button class="flex flex-initial w-10 h-10 justify-center items-center" on:click={() => (stats = guessHistoryStats()) && (statsModal = true) }><Fa class="text-yellow-500" icon={faChartSimple} /></button>
        </div>
        <div>
            {#if playMode === 'PRACTICE'}
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

    <!-- Score / Share Display-->
    <div class="flex-none">
    {#if finished || (playMode === 'INFINITE' && attempts > 0) }
            <div class="flex flex-col items-center mt-2">
                {#if playMode === 'INFINITE'}
                <p class="flex-auto text-gray-500 text-sm dark:text-gray-400">Infinite Score</p>
                {:else if playMode == 'DAILY'}
                <p class="flex-auto text-bold text-2xl bg-gradient-to-r from-magenta  to-cyan-600  text-transparent bg-clip-text font-bold">Your Score</p>
                {/if}
                <div class="flex-auto">
                    <HueHunterScore score={dayScore/attempts} />
                </div>
                {#if playMode == 'DAILY' && shareable}
                <p class="flex-auto mt-4">
                    <button class="guesser-button-lg text-base p-2" on:click={() => share(dayScore/attempts)}>Share score</button>
                </p>
                {/if}

                {#if calculateBoundScore(dayScore/attempts, rawScoreThreshold, 10) < 4.5 }

                    <p class='mt-4 mb-1 italic text-sm'>Having trouble? </p>
                    <p class='my-1'>
                        <button class="guesser-button-sm">
                            <a data-sveltekit-prefetch href="practice-{colorMode.toLowerCase()}">Practice</a>
                        </button>
                    </p>
                {/if}
            </div>
    {/if}
    </div>

    {#if startMenu}
        <!-- Instructions -->
        <div class="flex items-center flex-col max-w-md w-5/6 flex-initial border-slate-900 border-2 p-2 m-4 bg-clip-border rounded-lg">
            <div class='text-sm w-auto'>
                <h3 class="text-center">How to Play</h3>
                <p class='my-3'>You're given a 
                    <span class="font-semibold bg-gradient-to-r from-magenta  to-cyan-600  text-transparent bg-clip-text">target</span> color, and you have to guess what composition of 
                    {#if colorMode==='RGB' }
                        <span class='font-semibold text-red-500'>red</span>, <span class='font-semibold text-green-500'>green</span>, and <span class='font-semibold text-blue-500'>blue</span>
                    {:else if colorMode==='CMYK' }
                    <span class='font-semibold text-cyan-400'>cyan</span>, <span class='font-semibold text-magenta'>magenta</span>, <span class='font-semibold text-yellow-500'>yellow</span>, and <span class='font-semibold'>black</span>
                    {/if}
                combine to make the target.</p>

                <p class="text-center">
                    {#if colorMode==='RGB' }
                        <img src="/huehunter-assets/color-mix_RGBmix.webp" class="inline-block w-48 h-48" />
                    {:else if colorMode==='CMYK' }
                        <img src="/huehunter-assets/color-mix_CMYKmix.webp" class="inline-block w-48 h-48" />
                    {/if}
                </p>

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
            <div class="flex flex-col">
                <button class="guesser-button-lg" on:click={() => startedDaily[colorMode] = true}>Start</button>
                <button class="guesser-button-sm mt-3" on:click={() => startedDaily[colorMode] = true}><a href="practice-{colorMode}">Practice</a></button>
            </div>
        </div>
    {:else if finished}
        <!-- Score Display-->
        <div class="flex items-center flex-col w-auto flex-initial border-slate-900 border-2 p-2 m-4 bg-clip-border rounded-lg">
            {#each $guessHistoryStore.filter(guess => guessFilter(guess, colorMode, playMode)) as guess }
                <GuesserAnswerBox guess={guess} />
            {/each}
        </div>
    {:else}
        <!-- Target Color & Breadcrumb -->
        <div class="flex items-center flex-col w-64 h-64 flex-initial border-slate-900 border-2 p-2 m-4 bg-clip-border rounded-lg">
            {#if practiceLock }
                <div class='text-sm italic'>
                Practice is disabled while a daily game is going on. Try it later!
                </div>
            {:else }
                {#if playMode === 'DAILY'}
                    <div class="flex-none">
                        <p class="mb-2"><AttemptBreadCrumbs bind:attempts /></p>
                    </div>
                {/if}
                {#if playMode == "PRACTICE"}
                    <div class="flex-grow w-full flex flex-row">
                        <div class="h-full flex-1">
                            <ColorBoxBase shareButton={false} showHex={false}
                                textSize='xs' width="full" height="full" csshex={rgbToHex(practiceColor)} colorname="Your Color" />
                        </div>
                        <div class="h-full flex-1">
                        <ColorBoxBase shareButton={false} showHex={false}
                            textSize='xs' width="full" height="full" csshex={rgbToHex(target)} colorname="Target Color" />
                        </div>
                    </div>
                {:else}
                    <div class="flex-grow w-full">
                        <ColorBoxBase shareButton={false} showHex={false}
                            textSize='xs' width="full" height="full" csshex={rgbToHex(target)} colorname={targetColorName} />
                    </div>
                {/if}
            {/if}
        </div>
    {/if}

    {#if playMode == 'PRACTICE'}
    <div class="flex flex-col items-center w-full max-w-xl mb-2 px-2">
        <div class="flex-auto">
            Score: <HueHunterScore score={currentDifference} />
        </div>
    </div>
    {/if}

    <!--Sliders / Submit-->
    {#if !finished && !startMenu}
    <div class="flex flex-col items-center w-full max-w-xl my-2 px-2">
        <!-- RGB / CMYK Sliders -->
        {#if !practiceLock }
            {#each Object.entries(colorMode === 'RGB' ? rgbColors : cmykColors) as [color, value]}
                <div class="font-bold text-base my-2 w-full max-w-lg">
                    <label class="text-center flex flex-row justify-center items-center">
                        <span class='w-20'>{color[0].toUpperCase() + color.slice(1)}</span>
                        <input 
                            style="background-color:{colorMode === 'RGB' ? rgbToHexByKey(value, color): cmykToHexByKey(value, color)}"
                            type="range"
                            min="0"
                            max="{colorMode === 'RGB' ? 255 : 100}"
                            value={value}
                            on:input={(e) => sliderChange(e, color)}
                            class="appearance-none h-7 flex-auto border-2 border-black rounded-lg cursor-pointer" />
                        <span style="{textShadowCSS(color, value)}; color:{colorMode === 'RGB' ? rgbToHexByKey(value, color) : cmykToHexByKey(value, color)}"
                        class="w-10">
                            {value}</span>
                    </label>
                </div>
            {/each}
        {/if}
        

        <!-- Submit  -->
        {#if playMode !== 'PRACTICE'}
            <button class="guesser-button-lg mt-4" on:click={submitGuess}>Submit</button>
        {:else}
            <button class="guesser-button-lg mt-4" on:click={getNextColor}>Next Practice Color</button>
            {#if !finishedDaily['RGB']}
                <button class="guesser-button-lg mt-4">
                    <a data-sveltekit-prefetch  href="/huehunter/daily-rgb">
                        Start Daily{colorMode == 'CMYK' ?" RGB ": " "}Game
                    </a>
                </button>
            {/if}
            {#if (colorMode == 'CMYK') && (!finishedDaily['CMYK']) }
                <button class="guesser-button-lg mt-4">
                    <a data-sveltekit-prefetch href="/huehunter/daily-cmyk">Start Daily CMYK Game</a>
                </button>
            {/if}
            {#if !finishedDaily['CMYK'] || !finishedDaily['RGB']}
                <p class="italic text-xs text-center mb-2">Daily Games don't show the color you're mixing</p>
            {/if}
        {/if}
    </div>
    {/if}

    <!-- Mode specific bottom message-->
    <div class='text-sm text-center'>
        {#if playMode === 'PRACTICE'}
        
            <hr class='my-2 dark:border-gray-600 border-gray-300' />
            <p class='my-1'>
                {#if finishedDaily['RGB']}
                    Play <a data-sveltekit-prefetch href="infinite-rgb">Infinite RGB</a>
                {/if}
            </p>
            {#if (colorMode == 'CMYK') && finishedDaily['CMYK']}
                <p class='my-1'>
                    Or <a data-sveltekit-prefetch href="infinite-cmyk">Infinite CMYK</a>
                </p>
            {/if}
        {:else if playMode == 'DAILY' && finished}
            <p class='my-1'>
                Challenge yourself again tomorrow, or try
                <a data-sveltekit-prefetch href="infinite-{colorMode.toLowerCase()}">Infinite Mode</a>
            </p>
            
            {#if colorMode == 'RGB' && !finishedDaily['CMYK']}
                <p class='my-1'>Want a challenge? Play <a data-sveltekit-prefetch href="daily-cmyk">CMYK Daily Mode</a></p>
            {:else if colorMode == 'CMYK' && !finishedDaily['RGB']}
            <p class='my-1'>You finished CMYK. Try the RGB <a data-sveltekit-prefetch href="daily-rgb">Daily Mode</a></p>
            {/if}
        {/if}
    </div>
    
    <div class="flex-initial flex-col">
        <!-- Score History Display-->
        <div class="mt-2 text-center items-center mb-10">
            
            {#if (playMode === 'INFINITE' || playMode === 'DAILY') && attempts > 0 && !finished}
            <div class="flex flex-col items-center">
                
                <div class="text-gray-500 text-sm dark:text-gray-400">
                    <hr class="border-t mt-4 mb-2 border-gray-300 dark:border-gray-600" />
                History<br />
                
            </div>
                <div class="flex flex-row my-px">
                    <Fa class="m-1 text-gray-300 dark:text-gray-600" icon={faBullseye} />
                    <Fa class="m-1 text-gray-300 dark:text-gray-600" icon={faUser} />
                    <span class="m-1 w-16 text-sm text-gray-300 dark:text-gray-600">Score</span>
                </div>
                <!--loop through filteredGuess from the back to the front, up to ten guesses-->
                {#each filteredGuesses.reverse().slice(0,25) as guess }
                    <div class="flex flex-row my-px">
                        <div class="w-4 h-4 mx-1 bg-grey-500 rounded-sm" style="background-color:{rgbToHex(guess.targetColor)}"></div>
                        <div class="w-4 flex-none h-4 mx-1 bg-grey-500 rounded-sm" style="background-color:{rgbToHex(guess.guessColor)}"></div>
                        <div><HueHunterScore score={guess.difference} /></div>
                    </div>
                {/each}
            </div>
            {/if}
        </div>
    </div>
</div>

<style lang='postcss'>
    @media (display-mode: standalone) {
		h1.title {
            @apply mt-8;
        }
	}
    .guesser-button {
        @apply bg-cyan-400 dark:bg-cyan-700 ;
        @apply hover:bg-cyan-500 hover:dark:bg-cyan-700;
        @apply focus:bg-cyan-500 focus:dark:bg-cyan-700 ;
        @apply border-black border-2;
        @apply hover:bg-gradient-to-r hover:from-cyan-600 hover:via-violet-500 hover:to-yellow-500 text-transparent bg-clip-text;
        @apply rounded-full justify-center;
        @apply font-semibold;
        @apply shadow-lg;
    }

    .guesser-button-sm {
        @apply guesser-button;
        @apply py-1 px-2;
        @apply text-sm;
    }

    .guesser-button-lg {
        @apply guesser-button;
        @apply py-2 px-6;
    }

    .cmy-text-gradient {
        @apply bg-gradient-to-r from-cyan-600 via-magenta to-yellow-500 text-transparent bg-clip-text;
    }

    .thumb {
        @apply bg-white;
        width: 1rem;
        @apply appearance-none;
        @apply h-6 w-6;
        @apply rounded-lg;
        @apply border-2;
        @apply border-black;
        @apply border-solid;
    }

    input[type="range"]::-moz-range-thumb {
        @apply thumb;
    }

    input[type="range"]::-webkit-slider-thumb {
        @apply thumb;
        }
        
</style>