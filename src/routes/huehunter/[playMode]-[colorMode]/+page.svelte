<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import seedrandom from "seedrandom";
  import { MetaTags } from "svelte-meta-tags";
  import Fa from "svelte-fa";
  import { faGithub, faLinkedinIn, faBluesky } from "@fortawesome/free-brands-svg-icons";
  import { Target, CircleHelp, Settings, User, ChartColumn, Share } from "lucide-svelte";

  /* Color tools */
  import {
    cmykToRgb,
    hexToRgb,
    rgbToHex,
    rgbColorToRGBDistance,
    cmykToHexByKey,
    rgbToHexByKey,
  } from "$lib/utils/colorTools";
  import type { RGBColor, CMYKColor } from "$lib/utils/colorTools";
  import type { Guess, GuessHistory, GuessStats } from "$lib/huehunter/types.ts";

  /* Svelte components */
  import ColorBoxBase from "$lib/colorbox/ColorBoxBase.svelte";
  import GuesserModeSelector from "$lib/huehunter/GuesserModeSelector.svelte";
  import GuesserAnswerBox from "$lib/huehunter/GuesserAnswerBox.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import HueHunterScore from "$lib/huehunter/HueHunterScore.svelte";
  import AttemptBreadCrumbs from "$lib/huehunter/AttemptBreadCrumbs.svelte";

  /* Stores */
  import {
    guessHistoryStore,
    cullOldRecords,
    guessHistoryStats,
  } from "$lib/huehunter/guessHistoryStore";

  /* Data */
  import colors from "../../colors/colors.json";
  import { calculateBoundScore, moonScale, rawScoreThreshold } from "$lib/huehunter/colorGuesser";
  // import { darkModeSetting } from '$lib/stores/darkModeStore.js';

  /* Variable Defaults */
  type PlayMode = "INFINITE" | "DAILY" | "PRACTICE";
  type ColorMode = "RGB" | "CMYK";

  const meta = {
    title: "Hue Hunter",
    description: "A color guessing game",
    url: "https://www.porg.dev/huehunter",
  };
  // Generate stars for the background
  let stars: { x: number; y: number; size: number; twinkleDelay: number; brightness: number }[] =
    [];
  let mounted = false;

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
  let startedDaily: { RGB: boolean; CMYK: boolean } = {
    RGB: false,
    CMYK: false,
  };

  // Attempts by color mode
  let dailyAttempts: { RGB: number; CMYK: number };
  let finishedDaily: { RGB: boolean; CMYK: boolean } = {
    RGB: false,
    CMYK: false,
  };
  let rgbColors: RGBColor = {
    red: 0,
    green: 0,
    blue: 0,
  };
  let cmykColors: CMYKColor = {
    cyan: 0,
    magenta: 0,
    yellow: 0,
    black: 0,
  };

  let shareable: boolean = false;
  let currentDifference: number = 0;

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  let target: RGBColor = {
    red: getRandomInt(255),
    green: getRandomInt(255),
    blue: getRandomInt(255),
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
    scoreByDate: [],
  };

  $: {
    if (playMode == "PRACTICE") {
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
      difference: diffRelative,
    };
    guessHistoryStore.update((guessHistory) => [...guessHistory, newGuess]);

    finished = playMode == "DAILY" && attempts > maxAttempts;
  }

  function getDailySeed() {
    const now = new Date();
    return now.getUTCFullYear() * 10000 + (now.getUTCMonth() + 1) * 100 + now.getUTCDate();
  }

  function getGameSeed(): string {
    const daySeed: number = getDailySeed();
    return `${daySeed}-${playMode}-${colorMode}-${attempts}`;
  }

  function getNextColor() {
    updateValues();
    const colorNames: string[] = Object.keys(colors);
    const seed: string = getGameSeed();
    const rng = seedrandom(seed);
    let colorIndex: number = Math.floor(rng() * Object.keys(colors).length);

    if (playMode == "PRACTICE") {
      colorIndex = Math.floor(Math.random() * Object.keys(colors).length);
    }
    targetColorName = colorNames[colorIndex];
    const colorHex: string = colors[targetColorName];
    target = hexToRgb(colorHex);

    /* set sliders to midpoint */
    rgbColors = { red: 127, green: 127, blue: 127 } as RGBColor;
    cmykColors = { cyan: 50, magenta: 50, yellow: 50, black: 50 } as CMYKColor;
  }

  function guessFilter(guess: Guess, colorMode: ColorMode, playMode: PlayMode): boolean {
    return guess.colorMode === colorMode && guess.playMode === playMode;
  }

  function updateValues() {
    // Actions triggered by changes to the guessHistoryStore
    filteredGuesses = $guessHistoryStore.filter((guess) => guessFilter(guess, colorMode, playMode));
    attempts = filteredGuesses.length;
    dayScore = filteredGuesses.reduce((acc, curr) => acc + curr.difference, 0);
    finished = playMode == "DAILY" && attempts >= maxAttempts;
  }

  //let darkModeClass = '';
  onMount(() => {
    stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() > 0.8 ? 3 : Math.random() > 0.5 ? 2 : 1,
      twinkleDelay: Math.random() * 4,
      brightness: 0.35 + Math.random() * 0.65,
    }));
    mounted = true;

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
    const beHelpful: boolean = true;
    const normalizedScore: number = Math.min(
      5,
      calculateBoundScore(rawScore, rawScoreThreshold, 20) / 4 + (beHelpful ? 0.2 : 0),
    );
    const moonScore: string = moonScale(normalizedScore, 5);
    const date = new Date();
    const msg: string = `${date.getMonth() + 1}/${date.getDate()} ${colorMode}\n${moonScore}\n`;

    if (shareable) {
      navigator
        .share({
          title: meta.title,
          text: msg,
          url: "https://hues.red",
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
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
  }

  $: {
    dailyAttempts = {
      RGB: $guessHistoryStore.filter((guess) => guessFilter(guess, "RGB", "DAILY")).length,
      CMYK: $guessHistoryStore.filter((guess) => guessFilter(guess, "CMYK", "DAILY")).length,
    };
    finishedDaily = {
      RGB: dailyAttempts.RGB >= maxAttempts,
      CMYK: dailyAttempts.CMYK >= maxAttempts,
    };
    startedDaily = {
      RGB: dailyAttempts.RGB > 0 && !finishedDaily.RGB,
      CMYK: dailyAttempts.CMYK > 0 && !finishedDaily.CMYK,
    };
  }

  $: $guessHistoryStore && getNextColor();

  $: if (colorMode == "CMYK") {
    rgbColors = cmykToRgb(cmykColors);
  }

  $: if (playMode === "PRACTICE" && !startedDaily["CMYK"] && !startedDaily["RGB"]) {
    practiceColor = rgbColors;
  }
  // whether to hide the game until explicitly started. This is done so
  // that we have a signal to turn off practice mode
  let startMenu: boolean = false;
  let practiceLock: boolean = false;
  $: startMenu = playMode == "DAILY" && !startedDaily[colorMode] && !finished;
  $: practiceLock = playMode === "PRACTICE" && (startedDaily["RGB"] || startedDaily["CMYK"]);

  const baseNameRef = {
    red: "#ff0000",
    green: "#00ff00",
    blue: "#0000ff",
    cyan: "#00ffff",
    magenta: "#ff00ff",
    yellow: "#ffff00",
    black: "#000000",
  };

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
    if (colorMode === "RGB") {
      rgbColors[color] = +(e.target.value ?? 0);
    } else {
      cmykColors[color] = +(e.target.value ?? 0);
    }
  }

  function textShadowCSS(color: string, amountOfColor: number) {
    let bgColor: string;
    let opacity: number;
    // if color is red, blue or green, use white text shadow
    if (["red", "green", "blue"].includes(color)) {
      bgColor = "#ffffff";
      opacity = 1 - amountOfColor / 255;
    } else {
      bgColor = "#000000";
      opacity = 1 - amountOfColor / 100;
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
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
    rel="stylesheet"
  />

  <meta name="theme-color" content={baseNameRef["magenta"]} />
  <link rel="icon" type="image/webp" sizes="16x16" href="/huehunter-assets/favicon-16x16.webp" />
  <link rel="icon" type="image/webp" sizes="32x32" href="/huehunter-assets/favicon-32x32.webp" />
  <link
    rel="apple-touch-icon"
    type="image/webp"
    sizes="180x180"
    href="/huehunter-assets/apple-touch-icon.webp"
  />
  <link rel="manifest" href="/huehunter-assets/huehunter-manifest.json" />

  <MetaTags
    title={meta.title}
    canonical={meta.url}
    description={meta.description}
    openGraph={{
      siteName: "porg.dev",
      type: "website",
      url: meta.url,
      locale: "en_US",
      title: meta.title,
      description: meta.description,
      images: [
        {
          url: "https://www.porg.dev/huehunter-assets/hue-splash.webp",
          alt: `${meta.title} splash image`,
          width: 1024,
          height: 1024,
          type: "image/png",
        },
      ],
    }}
    twitter={{
      handle: "@porg",
      site: "@porg",
      cardType: "summary_large_image",
      title: meta.title,
      description: meta.description,
      image: "https://www.porg.dev/huehunter-assets/hue-splash.webp",
      imageAlt: `${meta.title} splash image`,
    }}
  />
</svelte:head>

<div class="snes-page">
  <div class="stars-container">
    {#if mounted}
      {#each stars as star}
        <div
          class="star"
          style="left: {star.x}%; top: {star.y}%; width: {star.size}px; height: {star.size}px; animation-delay: {star.twinkleDelay}s; opacity: {star.brightness};"
        ></div>
      {/each}
    {/if}
  </div>

  <div class="scanlines"></div>

  <Modal bind:showModal={statsModal}>
    <h2 slot="header" class="modal-title">Stats</h2>
    {#if stats.colorsGuessed > 3}
      <div class="stats-grid">
        {#if stats.streak > 0}
          <div class="stat-card accent-cyan">
            <h4 class="stat-title">Streak</h4>
            <p>{stats.streak} days in a row</p>
          </div>
        {/if}

        <div class="stat-card accent-violet">
          <h4 class="stat-title">Days Played</h4>
          <p>{stats.daysPlayed}</p>
        </div>

        <div class="stat-card accent-red">
          <h4 class="stat-title">Average Score</h4>
          <p>{Math.round(10 * stats.averageScore) / 10}/10</p>
        </div>

        <div class="stat-card stat-wide">
          <h4 class="stat-title">Distribution of Scores</h4>
          <div class="histogram">
            {#each stats.histogram as count, index}
              <div class="histogram-bar">
                <div
                  class="histogram-fill"
                  style="height:{0.1 + 8 * (count / stats.colorsGuessed)}rem"
                ></div>
                <span class="histogram-label">{index}</span>
              </div>
            {/each}
          </div>
        </div>

        <div class="stat-card stat-wide">
          <h4 class="stat-title">Recent Scores</h4>
          <div class="score-list">
            {#each stats.scoreByDate as recentScore}
              <div class="score-row">
                <span class="score-date">{recentScore.date.toDateString()}</span>
                <HueHunterScore score={recentScore.score} />
              </div>
            {/each}
          </div>
        </div>
      </div>
    {:else}
      <p class="modal-note">Play a few games to see your stats!</p>
    {/if}
  </Modal>

  <Modal bind:showModal>
    <h2 slot="header" class="modal-title">About {meta.title}</h2>

    <div class="modal-section">
      <h3 class="modal-subtitle">Goal</h3>
      <p class="panel-body">
        Guess the composition of colors that make up a target color. Get as close as you can!
      </p>
    </div>

    <div class="modal-section">
      <h3 class="modal-subtitle">Modes</h3>
      <div class="mode-grid">
        <div class="mode-card">
          <h4 class="mode-title">
            <a class="mode-link" href="daily-{colorMode.toLowerCase()}">Daily</a>
          </h4>
          <p class="panel-body">Guess 5 colors specific to today.</p>
        </div>
        <div class="mode-card">
          <h4 class="mode-title">
            <a class="mode-link" href="infinite-{colorMode.toLowerCase()}">Infinite</a>
          </h4>
          <p class="panel-body">Guess as many colors as you like.</p>
        </div>
        <div class="mode-card">
          <h4 class="mode-title">
            <a class="mode-link" href="practice-{colorMode.toLowerCase()}">Practice</a>
          </h4>
          <p class="panel-body">See the result of your color selection.</p>
        </div>
      </div>
    </div>

    <div class="modal-section">
      <h3 class="modal-subtitle">Color Modes</h3>
      <div class="mode-grid">
        <div class="mode-card">
          <h4 class="mode-title">
            <a class="mode-link" href="{playMode.toLowerCase()}-rgb">RGB</a>
          </h4>
          <p class="panel-body">Red, Green, Blue. Additive like light.</p>
          <img
            src="/huehunter-assets/color-mix_RGBmix.webp"
            alt="RGB color mix"
            class="mode-image"
          />
        </div>
        <div class="mode-card">
          <h4 class="mode-title">
            <a class="mode-link" href="{playMode.toLowerCase()}-cmyk">CMYK</a>
          </h4>
          <p class="panel-body">Cyan, Magenta, Yellow, Black. Subtractive like ink.</p>
          <img
            src="/huehunter-assets/color-mix_CMYKmix.webp"
            alt="CMYK color mix"
            class="mode-image"
          />
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <p class="panel-body">
        Created in Denver with ❤️ by <a href="https://www.porg.dev">Peter Organisciak</a>
      </p>
      <div class="modal-social">
        <a
          href="https://bsky.app/profile/porg.dev"
          aria-label="Follow me on Bluesky"
          target="_blank"
          rel="me"
          class="social-icon"
        >
          <Fa icon={faBluesky} />
        </a>
        <a
          href="https://github.com/organisciak"
          aria-label="Follow me on Github"
          target="_blank"
          class="social-icon"
        >
          <Fa icon={faGithub} />
        </a>
        <a
          href="https://www.linkedin.com/in/organisciak/"
          aria-label="LinkedIn"
          target="_blank"
          class="social-icon"
        >
          <Fa icon={faLinkedinIn} />
        </a>
      </div>
    </div>
  </Modal>

  <Modal bind:showModal={settingsModal}>
    <h2 slot="header" class="modal-title">Settings</h2>
    <div class="modal-section">
      <GuesserModeSelector
        {colorMode}
        {playMode}
        practiceLock={startedDaily["RGB"] || startedDaily["CMYK"]}
      />
    </div>
  </Modal>

  <Modal bind:showModal={aboutModal}>
    <h2 slot="header" class="modal-title">About</h2>
    <p class="modal-note">More Hue Hunter lore coming soon.</p>
  </Modal>

  <div class="content">
    <div class="pixel-border-top"></div>

    <div class="title-block">
      <div class="title-row">
        <h1 class="title" class:hero={startMenu}>
          <a class="title-link" href="/huehunter/daily-rgb">{meta.title}</a>
        </h1>
        <div class="action-bar">
          <button
            class="icon-button cyan"
            type="button"
            aria-label="How to play"
            on:click={() => (showModal = true)}
          >
            <CircleHelp />
          </button>
          <button
            class="icon-button magenta"
            type="button"
            aria-label="Settings"
            on:click={() => (settingsModal = true)}
          >
            <Settings />
          </button>
          <button
            class="icon-button yellow"
            type="button"
            aria-label="Stats"
            on:click={() => (stats = guessHistoryStats()) && (statsModal = true)}
          >
            <ChartColumn />
          </button>
        </div>
      </div>
      <p class="subtitle">Guess the mix. Chase the moons.</p>
      <div class="status-chips">
        <span class="chip">Play: {playMode}</span>
        <span class="chip accent">Mode: {colorMode}</span>
        {#if playMode === "DAILY"}
          <span class="chip">Tries: {attempts}/{maxAttempts}</span>
        {/if}
        {#if finished}
          <span class="chip success">Run complete</span>
        {:else if startMenu}
          <span class="chip warning">Ready</span>
        {/if}
      </div>

      {#if playMode === "PRACTICE"}
        <div class="mode-toggle">
          <span class="mode-label">Color mode</span>
          {#each ["RGB", "CMYK"] as mode}
            {#if mode.toUpperCase() == colorMode}
              <span class="mode-link active">{mode}</span>
            {:else}
              <a
                class="mode-link"
                data-sveltekit-prefetch
                href="{playMode.toLowerCase()}-{mode.toLowerCase()}"
              >
                {mode}
              </a>
            {/if}
          {/each}
        </div>
      {/if}
    </div>

    <div class="game-grid">
      <div class="panel main-panel">
        <div class="panel-title">
          {#if startMenu}
            How to play
          {:else if finished}
            Results
          {:else if playMode === "PRACTICE"}
            Practice board
          {:else}
            Target
          {/if}
        </div>

        {#if startMenu}
          <div class="instructions">
            <p class="panel-body">
              You're given a <span class="highlight">target</span> color, and you have to guess what
              composition of
              {#if colorMode === "RGB"}
                <span class="tone red"> red</span>, <span class="tone green">green</span>, and
                <span class="tone blue">blue</span>
              {:else if colorMode === "CMYK"}
                <span class="tone cyan"> cyan</span>, <span class="tone magenta">magenta</span>,
                <span class="tone yellow">yellow</span>, and <span class="tone black">black</span>
              {/if}
              combine to make the target.
            </p>

            <p class="panel-body centered">
              {#if colorMode === "RGB"}
                <img
                  src="/huehunter-assets/color-mix_RGBmix.webp"
                  alt="RGB color mix"
                  class="instruction-image"
                />
              {:else if colorMode === "CMYK"}
                <img
                  src="/huehunter-assets/color-mix_CMYKmix.webp"
                  alt="CMYK color mix"
                  class="instruction-image"
                />
              {/if}
            </p>

            <p class="panel-body">
              Get as close as you can. Each day has <span class="highlight">5</span> target colors to
              get as high a score as possible.
            </p>
            <p class="panel-body">
              Before you start, try <a
                data-sveltekit-prefetch
                class="inline-link"
                href="practice-{colorMode.toLowerCase()}">Practice Mode</a
              >. There's also
              {#if colorMode === "RGB"}
                a harder <a data-sveltekit-prefetch class="inline-link" href="daily-cmyk">CMYK</a> mode.
              {:else if colorMode === "CMYK"}
                an easier <a data-sveltekit-prefetch class="inline-link" href="daily-rgb">RGB</a> mode.
              {/if}
            </p>
            <p class="panel-note">
              Tip:
              {#if colorMode === "RGB"}
                RGB is additive: it gets lighter as you add color.
              {:else if colorMode === "CMYK"}
                CMYK mode is based on inks, and is subtractive: it gets darker as you add color.
                Black is redundant.
              {/if}
            </p>
          </div>
          <div class="panel-actions">
            <button
              class="guesser-button-lg"
              type="button"
              on:click={() => (startedDaily[colorMode] = true)}>Start</button
            >
            <a
              class="guesser-button-sm secondary button-link"
              data-sveltekit-prefetch
              href="practice-{colorMode.toLowerCase()}"
              on:click={() => (startedDaily[colorMode] = true)}
            >
              Practice
            </a>
          </div>
        {:else if finished}
          <div class="answers-list">
            {#each $guessHistoryStore.filter( (guess) => guessFilter(guess, colorMode, playMode), ) as guess}
              <GuesserAnswerBox {guess} />
            {/each}
          </div>
        {:else}
          <div class="target-panel">
            {#if practiceLock}
              <p class="panel-note">
                Practice is disabled while a daily game is going on. Try it later!
              </p>
            {:else}
              {#if playMode === "DAILY"}
                <div class="breadcrumbs">
                  <AttemptBreadCrumbs bind:attempts />
                </div>
              {/if}
              {#if playMode == "PRACTICE"}
                <div class="color-duo">
                  <div class="color-panel">
                    <ColorBoxBase
                      shareButton={false}
                      showHex={false}
                      textSize="xs"
                      csshex={rgbToHex(practiceColor)}
                      colorname="Your Color"
                    />
                  </div>
                  <div class="color-panel">
                    <ColorBoxBase
                      shareButton={false}
                      showHex={false}
                      textSize="xs"
                      csshex={rgbToHex(target)}
                      colorname="Target Color"
                    />
                  </div>
                </div>
              {:else}
                <div class="color-panel">
                  <ColorBoxBase
                    shareButton={false}
                    showHex={false}
                    textSize="xs"
                    csshex={rgbToHex(target)}
                    colorname={targetColorName}
                  />
                </div>
              {/if}
            {/if}
          </div>
        {/if}
      </div>

      <div class="panel side-panel">
        <div class="panel-title">Status</div>
        {#if finished || (playMode === "INFINITE" && attempts > 0)}
          <div class="score-block">
            {#if playMode === "INFINITE"}
              <p class="score-label">Infinite score</p>
            {:else if playMode == "DAILY"}
              <p class="score-label">Your score</p>
            {/if}
            <div class="score-value">
              <HueHunterScore score={dayScore / attempts} />
            </div>
            {#if playMode == "DAILY" && shareable}
              <button
                class="guesser-button-sm"
                type="button"
                on:click={() => share(dayScore / attempts)}
              >
                <Share class="button-icon" />
                Share score
              </button>
            {/if}

            {#if calculateBoundScore(dayScore / attempts, rawScoreThreshold, 10) < 4.5}
              <p class="panel-note">Having trouble? Try practice mode.</p>
              <a
                class="guesser-button-sm secondary button-link"
                data-sveltekit-prefetch
                href="practice-{colorMode.toLowerCase()}"
              >
                Practice
              </a>
            {/if}
          </div>
        {:else}
          <p class="panel-note">Adjust the sliders to match the target color.</p>
        {/if}

        {#if playMode == "PRACTICE"}
          <div class="practice-score">
            <span class="score-label">Current difference</span>
            <HueHunterScore score={currentDifference} />
          </div>
        {/if}

        <div class="mode-message">
          {#if playMode === "PRACTICE"}
            {#if finishedDaily["RGB"]}
              <p class="panel-body">
                Play <a data-sveltekit-prefetch class="inline-link" href="infinite-rgb"
                  >Infinite RGB</a
                >
              </p>
            {/if}
            {#if colorMode == "CMYK" && finishedDaily["CMYK"]}
              <p class="panel-body">
                Or <a data-sveltekit-prefetch class="inline-link" href="infinite-cmyk"
                  >Infinite CMYK</a
                >
              </p>
            {/if}
          {:else if playMode == "DAILY" && finished}
            <p class="panel-body">
              Challenge yourself again tomorrow, or try
              <a
                data-sveltekit-prefetch
                class="inline-link"
                href="infinite-{colorMode.toLowerCase()}">Infinite Mode</a
              >
            </p>

            {#if colorMode == "RGB" && !finishedDaily["CMYK"]}
              <p class="panel-body">
                Want a challenge? Play <a
                  data-sveltekit-prefetch
                  class="inline-link"
                  href="daily-cmyk">CMYK Daily Mode</a
                >
              </p>
            {:else if colorMode == "CMYK" && !finishedDaily["RGB"]}
              <p class="panel-body">
                You finished CMYK. Try the RGB <a
                  data-sveltekit-prefetch
                  class="inline-link"
                  href="daily-rgb">Daily Mode</a
                >
              </p>
            {/if}
          {/if}
        </div>
      </div>
    </div>

    {#if !finished && !startMenu}
      <div class="panel controls-panel">
        <div class="panel-title">Mixing console</div>
        {#if !practiceLock}
          <div class="slider-grid">
            {#each Object.entries(colorMode === "RGB" ? rgbColors : cmykColors) as [color, value]}
              <label class="slider-row">
                <span class="slider-label">{color[0].toUpperCase() + color.slice(1)}</span>
                <input
                  class="slider"
                  style="background-color:{colorMode === 'RGB'
                    ? rgbToHexByKey(value, color)
                    : cmykToHexByKey(value, color)}"
                  type="range"
                  min="0"
                  max={colorMode === "RGB" ? 255 : 100}
                  {value}
                  on:input={(e) => sliderChange(e, color)}
                />
                <span
                  style="{textShadowCSS(color, value)}; color:{colorMode === 'RGB'
                    ? rgbToHexByKey(value, color)
                    : cmykToHexByKey(value, color)}"
                  class="slider-value"
                >
                  {value}
                </span>
              </label>
            {/each}
          </div>
        {:else}
          <p class="panel-note">
            Practice is disabled while a daily game is going on. Try it later!
          </p>
        {/if}

        <div class="controls-actions">
          {#if playMode !== "PRACTICE"}
            <button class="guesser-button-lg" type="button" on:click={submitGuess}>Submit</button>
          {:else}
            <button class="guesser-button-lg" type="button" on:click={getNextColor}
              >Next Practice Color</button
            >
            {#if !finishedDaily["RGB"]}
              <a
                class="guesser-button-lg secondary button-link"
                data-sveltekit-prefetch
                href="/huehunter/daily-rgb"
              >
                Start Daily{colorMode == "CMYK" ? " RGB" : ""} Game
              </a>
            {/if}
            {#if colorMode == "CMYK" && !finishedDaily["CMYK"]}
              <a
                class="guesser-button-lg secondary button-link"
                data-sveltekit-prefetch
                href="/huehunter/daily-cmyk"
              >
                Start Daily CMYK Game
              </a>
            {/if}
            {#if !finishedDaily["CMYK"] || !finishedDaily["RGB"]}
              <p class="panel-note">Daily games do not show the color you're mixing.</p>
            {/if}
          {/if}
        </div>
      </div>
    {/if}

    {#if (playMode === "INFINITE" || playMode === "DAILY") && attempts > 0 && !finished}
      <div class="panel history-panel">
        <div class="panel-title">History</div>
        <div class="history-legend">
          <Target class="legend-icon" />
          <User class="legend-icon" />
          <span class="legend-label">Score</span>
        </div>
        <div class="history-list">
          {#each filteredGuesses.reverse().slice(0, 25) as guess}
            <div class="history-row">
              <div
                class="history-swatch"
                style="background-color:{rgbToHex(guess.targetColor)}"
              ></div>
              <div
                class="history-swatch"
                style="background-color:{rgbToHex(guess.guessColor)}"
              ></div>
              <HueHunterScore score={guess.difference} />
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  :global(body) {
    overflow-x: hidden;
  }

  .snes-page {
    --snes-bg: #0a0a1a;
    --snes-panel: rgba(18, 18, 40, 0.92);
    --snes-border: #2c2c50;
    --snes-text: #cfd6ff;
    --snes-subtle: #88ccff;
    --snes-accent: #ffcc00;
    --snes-cyan: #00ccff;
    --snes-magenta: #ff4fd8;
    --snes-yellow: #ffcc00;
    --snes-red: #ff5f5f;
    --snes-green: #6bff8c;
    --snes-blue: #4fa3ff;

    font-family: "Press Start 2P", monospace;
    min-height: 100vh;
    color: var(--snes-text);
    background:
      radial-gradient(circle at 20% 20%, rgba(0, 204, 255, 0.08), transparent 45%),
      radial-gradient(circle at 80% 10%, rgba(255, 0, 102, 0.12), transparent 40%),
      linear-gradient(180deg, #0a0a1a 0%, #15152f 55%, #0a0a1a 100%);
    position: relative;
    overflow: hidden;
  }

  .snes-page a {
    color: var(--snes-accent);
    text-decoration: none;
  }

  .snes-page a:hover {
    color: #fff;
    text-shadow: 0 0 10px rgba(255, 204, 0, 0.6);
  }

  .stars-container {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  .star {
    position: absolute;
    background: #fff;
    border-radius: 0;
    animation: twinkle 2.2s ease-in-out infinite;
  }

  @keyframes twinkle {
    0%,
    100% {
      opacity: var(--star-opacity, 0.6);
    }
    50% {
      opacity: 0.2;
    }
  }

  .scanlines {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 30;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.15) 0px,
      rgba(0, 0, 0, 0.15) 1px,
      transparent 1px,
      transparent 2px
    );
  }

  .content {
    position: relative;
    z-index: 10;
    max-width: 1100px;
    margin: 0 auto;
    padding: 2.5rem 1.5rem 4rem;
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
    animation: boot-in 0.5s ease-out;
  }

  @keyframes boot-in {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .pixel-border-top {
    width: 100%;
    max-width: 920px;
    height: 8px;
    margin: 0 auto;
    background: repeating-linear-gradient(
      90deg,
      #ffcc00 0px,
      #ffcc00 8px,
      #ff6600 8px,
      #ff6600 16px,
      #ff0066 16px,
      #ff0066 24px,
      #cc00ff 24px,
      #cc00ff 32px,
      #00ccff 32px,
      #00ccff 40px
    );
    image-rendering: pixelated;
  }

  .title-block {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .title {
    margin: 0;
    font-size: clamp(1.2rem, 3.5vw, 2.2rem);
    color: #fff;
    text-shadow:
      3px 3px 0 #ff6600,
      -1px -1px 0 #00ccff,
      0 0 20px rgba(255, 102, 0, 0.5);
    letter-spacing: 0.12em;
  }

  .title.hero {
    font-size: clamp(1.6rem, 4.8vw, 2.6rem);
  }

  .title-link {
    color: inherit;
  }

  .subtitle {
    margin: 0;
    font-size: 0.55rem;
    color: var(--snes-subtle);
    line-height: 1.6;
  }

  .action-bar {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .icon-button {
    width: 40px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--snes-border);
    background: #14142b;
    color: var(--snes-text);
    box-shadow:
      0 4px 0 #05050f,
      0 0 0 2px #0a0a1a;
    cursor: pointer;
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease;
  }

  .icon-button :global(svg) {
    width: 18px;
    height: 18px;
  }

  .icon-button:hover {
    transform: translateY(-2px);
    box-shadow:
      0 6px 0 #05050f,
      0 0 0 2px #0a0a1a;
  }

  .icon-button:active {
    transform: translateY(2px);
    box-shadow:
      0 2px 0 #05050f,
      0 0 0 2px #0a0a1a;
  }

  .icon-button.cyan {
    color: var(--snes-cyan);
  }

  .icon-button.magenta {
    color: var(--snes-magenta);
  }

  .icon-button.yellow {
    color: var(--snes-yellow);
  }

  .status-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .chip {
    background: #1a1a33;
    border: 1px solid var(--snes-border);
    padding: 0.2rem 0.4rem;
    font-size: 0.45rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--snes-text);
  }

  .chip.accent {
    color: var(--snes-accent);
  }

  .chip.success {
    color: var(--snes-green);
    border-color: #2b4a34;
  }

  .chip.warning {
    color: var(--snes-yellow);
  }

  .mode-toggle {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
    font-size: 0.5rem;
  }

  .mode-label {
    color: var(--snes-subtle);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .mode-link {
    color: var(--snes-text);
    padding: 0.2rem 0.35rem;
    border: 1px solid transparent;
  }

  .mode-link.active {
    color: var(--snes-accent);
    border-color: var(--snes-accent);
  }

  .mode-card .mode-link {
    color: var(--snes-accent);
    padding: 0;
    border: none;
  }

  .game-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5rem;
    align-items: start;
  }

  .panel {
    background: var(--snes-panel);
    border: 2px solid var(--snes-border);
    padding: 1rem;
    box-shadow: 0 0 18px rgba(0, 0, 0, 0.4);
  }

  .panel-title {
    margin: 0 0 0.75rem;
    font-size: 0.6rem;
    color: var(--snes-accent);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .panel-body {
    font-size: 0.55rem;
    line-height: 1.7;
    color: var(--snes-text);
    margin: 0.5rem 0;
  }

  .panel-note {
    font-size: 0.5rem;
    color: var(--snes-subtle);
    margin: 0.5rem 0;
  }

  .inline-link {
    color: var(--snes-accent);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .centered {
    text-align: center;
  }

  .highlight {
    color: var(--snes-accent);
  }

  .tone.red {
    color: var(--snes-red);
  }
  .tone.green {
    color: var(--snes-green);
  }
  .tone.blue {
    color: var(--snes-blue);
  }
  .tone.cyan {
    color: var(--snes-cyan);
  }
  .tone.magenta {
    color: var(--snes-magenta);
  }
  .tone.yellow {
    color: var(--snes-yellow);
  }
  .tone.black {
    color: #f5f5f5;
  }

  .instructions {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .instruction-image {
    width: 180px;
    height: 180px;
    image-rendering: pixelated;
  }

  .panel-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .answers-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .target-panel {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .breadcrumbs {
    display: flex;
    justify-content: center;
  }

  .color-duo {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 0.75rem;
  }

  .color-panel {
    min-height: 180px;
    height: clamp(180px, 28vw, 240px);
  }

  .score-block {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .score-label {
    font-size: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--snes-subtle);
    margin: 0;
  }

  .score-value {
    font-size: 0.75rem;
  }

  .practice-score {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .mode-message {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .controls-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .slider-grid {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .slider-row {
    display: grid;
    grid-template-columns: 90px 1fr 60px;
    gap: 0.75rem;
    align-items: center;
  }

  .slider-label {
    font-size: 0.5rem;
    color: #fff;
    text-transform: uppercase;
  }

  .slider {
    appearance: none;
    width: 100%;
    height: 12px;
    border: 2px solid #090910;
    background: #1c1c35;
    box-shadow: inset 0 0 0 2px #0a0a1a;
    cursor: pointer;
  }

  .slider::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    background: var(--snes-accent);
    border: 2px solid #0a0a1a;
  }

  .slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: var(--snes-accent);
    border: 2px solid #0a0a1a;
  }

  .slider-value {
    font-size: 0.5rem;
    text-align: right;
  }

  .controls-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    align-items: flex-start;
  }

  .guesser-button-lg,
  .guesser-button-sm {
    --button-shadow: #7a1f00;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-family: inherit;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border: 2px solid #0a0a1a;
    background: linear-gradient(180deg, #ffcc00 0%, #ff6600 100%);
    color: #1a1a1a;
    box-shadow:
      0 4px 0 var(--button-shadow),
      0 0 0 2px #0a0a1a;
    cursor: pointer;
    text-decoration: none;
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease;
  }

  .guesser-button-lg.secondary,
  .guesser-button-sm.secondary {
    --button-shadow: #1a3d88;
    background: linear-gradient(180deg, #00ccff 0%, #3366ff 100%);
    color: #0a0a1a;
  }

  .guesser-button-lg:hover,
  .guesser-button-sm:hover {
    transform: translateY(-1px);
    box-shadow:
      0 5px 0 var(--button-shadow),
      0 0 0 2px #0a0a1a;
  }

  .guesser-button-lg:active,
  .guesser-button-sm:active {
    transform: translateY(2px);
    box-shadow:
      0 2px 0 var(--button-shadow),
      0 0 0 2px #0a0a1a;
  }

  .guesser-button-lg:focus-visible,
  .guesser-button-sm:focus-visible,
  .icon-button:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }

  .guesser-button-sm {
    font-size: 0.48rem;
    padding: 0.35rem 0.6rem;
  }

  .guesser-button-lg {
    font-size: 0.55rem;
    padding: 0.5rem 1rem;
  }

  .button-link {
    display: inline-flex;
  }

  .snes-page :global(.button-icon) {
    width: 14px;
    height: 14px;
  }

  .history-panel {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .history-legend {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--snes-subtle);
    font-size: 0.45rem;
  }

  .history-legend :global(.legend-icon) {
    width: 16px;
    height: 16px;
    opacity: 0.6;
  }

  .legend-label {
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .history-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .history-row {
    display: grid;
    grid-template-columns: 18px 18px auto;
    gap: 0.5rem;
    align-items: center;
  }

  .history-swatch {
    width: 16px;
    height: 16px;
    border: 1px solid var(--snes-border);
  }

  .modal-title {
    font-size: 0.7rem;
    text-align: center;
    color: var(--snes-accent);
    margin: 0.5rem 0 0.75rem;
    text-transform: uppercase;
  }

  .modal-subtitle {
    font-size: 0.55rem;
    color: var(--snes-accent);
    margin: 0 0 0.5rem;
    text-transform: uppercase;
  }

  .modal-section {
    margin: 0.75rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .modal-footer {
    margin-top: 1rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .modal-social {
    display: flex;
    justify-content: center;
    gap: 0.75rem;
  }

  .social-icon {
    color: var(--snes-accent);
    font-size: 1.2rem;
  }

  .mode-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 0.75rem;
  }

  .mode-card {
    background: #161633;
    border: 1px solid var(--snes-border);
    padding: 0.75rem;
  }

  .mode-title {
    margin: 0 0 0.4rem;
    font-size: 0.55rem;
    color: #fff;
  }

  .mode-image {
    width: 96px;
    height: 96px;
    margin-top: 0.5rem;
    image-rendering: pixelated;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.75rem;
  }

  .stat-card {
    background: #161633;
    border: 1px solid var(--snes-border);
    padding: 0.75rem;
    font-size: 0.5rem;
    color: var(--snes-text);
  }

  .stat-card.accent-cyan {
    border-color: rgba(0, 204, 255, 0.6);
  }

  .stat-card.accent-violet {
    border-color: rgba(204, 0, 255, 0.6);
  }

  .stat-card.accent-red {
    border-color: rgba(255, 102, 0, 0.6);
  }

  .stat-card.stat-wide {
    grid-column: 1 / -1;
  }

  .stat-title {
    margin: 0 0 0.4rem;
    font-size: 0.55rem;
    color: #fff;
  }

  .histogram {
    display: flex;
    gap: 0.2rem;
    align-items: flex-end;
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }

  .histogram-bar {
    width: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
  }

  .histogram-fill {
    width: 100%;
    background: linear-gradient(180deg, #ffcc00, #ff0066);
  }

  .histogram-label {
    font-size: 0.4rem;
    color: var(--snes-subtle);
  }

  .score-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-top: 0.5rem;
  }

  .score-row {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    font-size: 0.5rem;
  }

  .score-date {
    color: var(--snes-subtle);
  }

  .modal-note {
    font-size: 0.55rem;
    text-align: center;
    color: var(--snes-subtle);
  }

  @media (max-width: 900px) {
    .title-row {
      flex-direction: column;
      align-items: flex-start;
    }

    .action-bar {
      width: 100%;
    }

    .game-grid {
      grid-template-columns: 1fr;
    }

    .slider-row {
      grid-template-columns: 70px 1fr 50px;
    }
  }

  @media (max-width: 640px) {
    .content {
      padding: 2rem 1rem 3rem;
    }

    .title {
      font-size: 1.4rem;
    }

    .instruction-image {
      width: 140px;
      height: 140px;
    }

    .mode-grid,
    .stats-grid {
      grid-template-columns: 1fr;
    }

    .slider-row {
      grid-template-columns: 60px 1fr 50px;
    }
  }
</style>
