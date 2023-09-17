<script lang="ts">
    import ColorBox from '$lib/ColorBox.svelte';
    import colors from './colors.json';
    
    // shuffle colors and type them
    const typedColors: { [key: string]: string } = colors;
    
    // todo make reactive
    function shuffleArray<T>(array: T[]): T[] {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
        }
        return arr;
    }
    const keysArray: string[] = Object.keys(colors);
    const shuffledkeysArray: string[] = shuffleArray(keysArray);
    let displayedColors: string[] = shuffledkeysArray; //.slice(0, 50); 

    // TODO doesn't work yet - probably needs to be reactive
    function handleScroll(event: Event): void {
        const target = event.target as HTMLElement;

        if (target.scrollHeight - target.scrollTop === target.clientHeight) {
            // When scrolled to the bottom, load more colors
            const nextColors: string[] = shuffledkeysArray.slice(displayedColors.length, displayedColors.length + 10);
            displayedColors = [...displayedColors, ...nextColors];
        }
    }
</script>

<div class='colorcontainer' on:scroll={handleScroll}>
    {#each displayedColors as colorname (colorname)}
        <ColorBox colorname={colorname} csshex={typedColors[colorname]} />
    {/each}
</div>

<style>
    div.colorcontainer {
        display: flex;
        flex-wrap: wrap;
        overflow-y: scroll;
        justify-content: center;
    }
</style>

