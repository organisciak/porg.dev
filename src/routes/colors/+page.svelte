<script lang="ts">
    import { onMount } from 'svelte';
    import ColorBox from '$lib/colorbox/ColorBoxBase.svelte';
    import colors from './colors.json';
    
    // shuffle colors and type them
    const typedColors: { [key: string]: string } = colors;
    let isLoading = false;

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
        window.scrollTo(0, 0);
        return () => {
            // Clean up the event listener
            window.removeEventListener('scroll', handleScroll);
        };
    });

    async function handleScroll(event: Event): Promise<void> {
        if (isLoading) return;
        const scrollTop = window.scrollY;
        const clientHeight = document.documentElement.clientHeight;
        const scrollHeight = document.documentElement.scrollHeight;

        if (scrollHeight - scrollTop <= clientHeight + 100) {
            isLoading = true;
            const nextColors: string[] = shuffledkeysArray.slice(displayedColors.length, displayedColors.length + 50);

            displayedColors = [...displayedColors, ...nextColors];
            isLoading = false;
        }
    }
</script>

<svelte:window on:scroll={handleScroll} />

<div class='colorcontainer'>
<div class="colors h-screen flex flex-wrap justify-center">
    {#each displayedColors as colorname, index (colorname)}
        <ColorBox colorname={colorname}
        csshex={typedColors[colorname]}
        fadeInDelay={500}
        fadeInDuration={500}
         />
    {/each}
</div>
</div>
