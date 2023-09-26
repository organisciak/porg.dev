<script lang="ts">
    import { onMount } from 'svelte';
    import ColorBox from '$lib/colorbox/ColorBoxBase.svelte';
    import colors from './colors.json';
    import type { MetaTagsProps } from 'svelte-meta-tags';
    
    // shuffle colors and type them
    const typedColors: { [key: string]: string } = colors;
    let displayedColors: string[][] = [];
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
        // Include index, for unique keying in infinite scroll
        displayedColors = shuffledkeysArray.slice(0, initSize)
            .map((colorname, i) => [i.toString(), colorname]); 

        window.scrollTo(0, 0);
        isInitializing = false;
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });

    async function handleScroll(): Promise<void> {
        if (isLoading) return;
        const scrollTop = window.scrollY;
        const offsetHeight = document.documentElement.offsetHeight;
        const scrollHeight = document.documentElement.scrollHeight;
        if (scrollHeight - scrollTop <= offsetHeight + 100) {
            isLoading = true;
            const startAt:number = displayedColors.length % shuffledkeysArray.length;
            let nextColors: string[] = shuffledkeysArray.slice(startAt, startAt + loadMoreSize);
            if (nextColors.length < loadMoreSize) {
                nextColors = [...nextColors, ...shuffledkeysArray.slice(0, loadMoreSize - nextColors.length)]
            };
            const nextColorsIndexed: string[][] = nextColors.map((colorname, i) => [i.toString(), colorname]);
            displayedColors = [...displayedColors, ...nextColorsIndexed];
            isLoading = false;
        }
        
    }

    export const load = async ({ url }) => {
		const meta = {
        title: 'Endless Colors',
        description: 'Explore a vast collection of cheeky color swatches to find the perfect shade for your design projects',
        url: new URL(url.pathname, url.origin).href
		}

		// Define meta tags for this specific child page.
		const metaTags: MetaTagsProps = Object.freeze({
			title: meta.title,
			description: meta.description,
			url: meta.url,
            openGraph:{
                siteName: 'porg.dev',
                type: 'website',
                url: meta.url,
                locale: 'en_US',
                title: meta.title,
                description: meta.description,
                images: [
                    {
                        url: 'https://www.porg.dev/opengraph/IMG_20230925_192846.png',
                        alt: 'Color: Unstoppable Urban Flamino Uprising',
                        width: 800,
                        height: 800,
                        type: 'image/png'
                    },
                    {
                        url: 'https://www.porg.dev/opengraph/IMG_20230925_193210.png',
                        alt: 'Color: Nana\'s Old Couch',
                        width: 800,
                        height: 800,
                        type: 'image/png'
                    },
                    {
                        url: 'https://www.porg.dev/opengraph/IMG_20230925_194217.png',
                        alt: 'Color: Unicorn\'s Unexpected Ube',
                        width: 800,
                        height: 800,
                        type: 'image/png'
                    },
                    {
                        url: 'https://www.porg.dev/opengraph/IMG_20230926_120405.png',
                        alt: 'Color: That Weird Stain On My Carpet Beige',
                        width: 800,
                        height: 800,
                        type: 'image/png'
                    }
                ]
			},
			twitter: {
				handle: '@porg',
				site: '@porg',
				title: meta.title,
				description: meta.description,
                image: 'https://www.porg.dev/opengraph/IMG_20230926_120405.png',
                imageAlt: 'Color: That Weird Stain On My Carpet Beige'
			}
		});

		return {
			metaTagsChild: metaTags // Return meta tags so they can be consumed by layout.svelte.
		};
	};
</script>

<svelte:window on:scroll={handleScroll} />

{#if isInitializing}
        <span class='font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-transparent bg-clip-text'>Loading...</span>
    {/if}

<div class='colorcontainer'>
<div class="colors h-screen flex flex-wrap justify-center">
    {#each displayedColors as [, colorname] }
        <ColorBox colorname={colorname}
        csshex={typedColors[colorname]}
        fadeInDelay={500}
        fadeInDuration={500}
         />
    {/each}
</div>
</div>
