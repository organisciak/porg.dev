<script lang="ts">
    import { onMount } from 'svelte';
    import ColorBox from '$lib/colorbox/ColorBoxBase.svelte';
    import colors from './colors.json';
    
    // shuffle colors and type them
    const typedColors: { [key: string]: string } = colors;
    let displayedColors: string[] = [];
    let shuffledkeysArray: string[] = [];
    let isLoading = false;

    function shuffleArray<T>(array: T[]): T[] {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
        }
        return arr;
    }
    
    let isInitializing = true;
    const initSize = 150;
    const loadMoreSize = 50;
    const keysArray: string[] = Object.keys(typedColors);

    onMount(() => {
        shuffledkeysArray = shuffleArray(keysArray);
        displayedColors = shuffledkeysArray.slice(0, initSize); 

        window.scrollTo(0, 0);
        isInitializing = false;
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });

    async function handleScroll(event: Event): Promise<void> {
        if (isLoading) return;
        const scrollTop = window.scrollY;
        const offsetHeight = document.documentElement.offsetHeight;
        const scrollHeight = document.documentElement.scrollHeight;
        if (scrollHeight - scrollTop <= offsetHeight + 100) {
            isLoading = true;
            const nextColors: string[] = shuffledkeysArray.slice(displayedColors.length, displayedColors.length + loadMoreSize);

            displayedColors = [...displayedColors, ...nextColors];
            isLoading = false;
        }
        
    }
</script>

<svelte:window on:scroll={handleScroll} />

{#if isInitializing}
        <!-- Show a loading message or a spinner here -->
        <span class='font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-transparent bg-clip-text'>Loading...</span>
    {/if}

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
