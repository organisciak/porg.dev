<script lang="ts">
    import { onMount } from 'svelte';
    import ColorBox from '$lib/colorbox/ColorBoxBase.svelte';
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
    let displayedColors: string[] = shuffledkeysArray.slice(0, 100); 

    onMount(() => {
        // Attach the scroll event listener to the window for mobile compatibility
        window.addEventListener('scroll', handleScroll);
        return () => {
            // Clean up the event listener
            window.removeEventListener('scroll', handleScroll);
        };
    });

    function handleScroll(event: Event): void {
        // Use window's scroll properties for more consistent behavior across devices
        const scrollTop = window.scrollY;
        const clientHeight = document.documentElement.clientHeight;
        const scrollHeight = document.documentElement.scrollHeight;

        if (scrollHeight - scrollTop <= clientHeight + 5) {
            const nextColors: string[] = shuffledkeysArray.slice(displayedColors.length, displayedColors.length + 30);
            displayedColors = [...displayedColors, ...nextColors];
        }
    }
</script>

<div class='colorcontainer'>
<div class='colors' on:scroll={handleScroll}>
    {#each displayedColors as colorname, index (colorname)}
        <ColorBox colorname={colorname}
        csshex={typedColors[colorname]}
        fadeInDelay={500}
        fadeInDuration={500}
         />
    {/each}
</div>
</div>

<style>
    div.colorcontainer {
       overflow: hidden;
    }
    div.colors {
        height: 100vh; /* corrected typo here */
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        overflow-y: auto; /* changed from 'scroll' to 'auto' */
        justify-content: center;
    }
</style>
