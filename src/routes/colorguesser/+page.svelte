<script lang="ts">
    import { onMount } from 'svelte';
    import { cmykToRgb, rgbToHash } from '$lib/utils/colorTools';
    import type { RGBColor, CMYKColor } from '$lib/utils/colorTools';
	import ColorBoxBase from '$lib/colorbox/ColorBoxBase.svelte';

    let red = 0;
    let green = 0;
    let blue = 0;
    let cyan = 0;
    let magenta = 0;
    let yellow = 0;
    let black = 0;

    let targetRed = getRandomInt(255);
    let targetGreen = getRandomInt(255);
    let targetBlue = getRandomInt(255);

    let submitted = false;
    let difference: number;
    let diffRelative: number;
    let scores: { 'INFINITE': number[], "DAILY": number[] } = { "INFINITE": [], "DAILY": [] };
    let attempts = 0;
    let dayScore = 0;
    let colorHistory: RGBColor[] = [];
    let guessHistory: {'mode': "CMYK" | "RGB", color: RGBColor}[] = [];
    let colorMode: "RGB" | "CMYK" = "RGB";
    let playMode: "INFINITE" | "DAILY" | "PRACTICE" | "FINISHED" = "DAILY";

    if (playMode == "PRACTICE") {
        attempts = 5;
    }

    function getRandomInt(max: number) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    function calculateDifference() {
        /* Calculate based on RGB - cmyk should have already been converted to rgb with reactive statement */
        
        difference = Math.abs(red - targetRed) + Math.abs(green - targetGreen) + Math.abs(blue - targetBlue);
        /* Use floor to be nicer to the user */
        diffRelative = Math.floor(100 * difference / (255*3));
    }

    function submitGuess() {
        calculateDifference();
        if (playMode == 'INFINITE' || playMode == 'DAILY') {
            scores[playMode].push(diffRelative);
        }
        dayScore += diffRelative; // Maximum difference score is 765 (255 * 3), so we subtract to get the score
        submitted = true;
        attempts++;
        if (attempts >= 5 && playMode !== "INFINITE") {
            playMode = "FINISHED";
        } else {
            getNextColor();
        }
    }

    function getNextColor() {
        targetRed = getRandomInt(255);
        targetGreen = getRandomInt(255);
        targetBlue = getRandomInt(255);

        colorHistory.push([targetRed, targetGreen, targetBlue] as RGBColor);

        /* set sliders to midpoint */
        [red, green, blue] = [127, 127, 127] as RGBColor;
        [cyan, magenta, yellow, black] = [50, 50, 50, 50] as CMYKColor;
    }

    $: if (colorMode == "CMYK") {
        [red, green, blue] = cmykToRgb([cyan, magenta, yellow, black]) as RGBColor
    };

    $: if (playMode === "PRACTICE") {
        [targetRed, targetGreen, targetBlue] = [red, green, blue] as RGBColor;
    }

    $: targetBoxColor = `rgb(${targetRed}, ${targetGreen}, ${targetBlue})`;

    onMount(() => {
        getNextColor();
    });
</script>

<div style="display: flex; flex-direction: column; align-items: center;">
    <h1>Color Blend Challenge</h1>

    <!-- Display Mode -->
    <p>Mode: {playMode} | {colorMode}</p>

    <!-- Target Color -->
    {#if playMode == 'FINISHED'}
        {#each colorHistory as targetRGB}
            <div>TODO INCLUDE THE GUESS</div>
            <div style="width: 100px; height: 100px; background-color: {rgbToHash(targetRGB)}; margin: 10px;"></div>
        {/each}
    {/if}
    {#if playMode != 'FINISHED'}
        <ColorBoxBase showHex={false} csshex={rgbToHash([targetRed, targetGreen, targetBlue])} />
    {/if}
    <!-- RGB Sliders -->
    {#if colorMode === 'RGB' && playMode !== 'FINISHED'}
    <div>
        <label>
            Red
            <input type="range" min="0" max="255" bind:value={red} />
            <span style="color:rgb({red},0,0)">{red}</span>
        </label>
    </div>
    <div>
        <label>
            Green
            <input type="range" min="0" max="255" bind:value={green} />
            <span style="color:rgb(0,{green},0)">{green}</span>
        </label>
    </div>
    <div>
        <label>
            Blue
            <input type="range" min="0" max="255" bind:value={blue} />
            <span style="color:rgb(0,0,{blue})">{blue}</span>
        </label>
    </div>
    {/if}

    {#if colorMode === 'CMYK' && playMode !== 'FINISHED'}
    <div>
        <label>
            Cyan
            <input type="range" min="0" max="100" bind:value={cyan} />
            <span style="color:cmyk({cyan}%,0%,0%,0%)">{cyan}</span>
        </label>
    </div>
    <div>
        <label>
            Magenta
            <input type="range" min="0" max="100" bind:value={magenta} />
            <span style="color:cmyk(0%,{magenta}%,0%, 0%)">{magenta}</span>
        </label>
    </div>
    <div>
        <label>
            Yellow
            <input type="range" min="0" max="100" bind:value={yellow} />
            <span style="color:cmyk(0%,0%,{yellow}%,0%)">{yellow}</span>
        </label>
    </div>
    <div>
        <label>
            Black
            <input type="range" min="0" max="100" bind:value={black} />
            <span style="color:rgb(0%,0%,0%,0%,{black}%)">{black}</span>
        </label>
    </div>
    {/if}

    <!-- Submit & Score Display -->
    {#if playMode !== 'PRACTICE' && playMode !== 'FINISHED'}
        <p>Attempts: {attempts}</p>
        <button on:click={submitGuess}>Submit</button>
        {#if submitted}
            <p>Difference: {difference} ({diffRelative})</p>
        {/if}
        <p>Day Score: {dayScore}</p>
    {/if}
</div>

<style>
    label {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 10px;
    }

    input[type="range"] {
        width: 200px;
    }
</style>
