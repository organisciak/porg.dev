<!--
  UnusualWordDisplay.svelte
  
  Description:
  This Svelte component displays unusual words with their definitions, parts of speech,
  example usage, and rarity. It features a card layout with a refresh button that cycles
  through a shuffled list of words.

  Features:
  - Displays an unusual word with its definition, part of speech, example, and rarity
  - Provides a refresh button to cycle through words
  - Supports dark mode using Tailwind CSS classes
  - Uses shadcn-svelte for Card and Button components
  - Uses FontAwesome for the refresh icon
  - Applies a fade transition when changing words

  Usage:
  1. Ensure your project has shadcn-svelte and FontAwesome installed and configured.
  2. Import the component in your Svelte file:
     import UnusualWordDisplay from './path/to/UnusualWordDisplay.svelte';
  3. Use the component in your Svelte template:
     <UnusualWordDisplay />
  
  Props:
  This component doesn't accept any props. The word list is defined internally.

  Customization:
  - To modify the word list, update the `unusualWords` array in the script section.
  - Adjust the Card width by modifying the `w-80` class in the outermost div.
  - Modify the transition by changing the `fade` import and its usage in the markup.

  Dependencies:
  - svelte
  - shadcn-svelte
  - @fortawesome/svelte-fontawesome
  - @fortawesome/free-solid-svg-icons
  - tailwindcss (for styling)

  Note: Ensure that the import paths for shadcn-svelte components are correct for your project structure.
-->

<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { Card, CardContent } from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import Fa from 'svelte-fa';
    import { faRotate } from '@fortawesome/free-solid-svg-icons';
  
    type Word = {
      word: string;
      pos: string;
      definition: string;
      example: string;
      rarity: number;
      potential_offensiveness: number;
      wiktionary: string;
    };
  
    let currentWord: Word | null = null;
    let isLoading = false;
  
    async function fetchRandomWord() {
        isLoading = true;
        try {
            const response = await fetch('/api/random-word');
            if (!response.ok) {
                throw new Error('Failed to fetch word');
            }
            currentWord = await response.json();
        } catch (error) {
            console.error('Error fetching word:', error);
            currentWord = {
                word: "Error",
                pos: "",
                definition: "Failed to load word. Please try again.",
                example: "",
                rarity: 0,
                potential_offensiveness: 0,
                wiktionary: ""
            };
        } finally {
            isLoading = false;
        }
    }
  
    function handleRefresh() {
        fetchRandomWord();
    }
  
    onMount(() => {
        fetchRandomWord();
    });
</script>
  
    <Card class="w-80 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
        <CardContent class="p-6">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {#if currentWord}
                        {currentWord.word}
                    {:else}
                        Loading...
                    {/if}
                </h2>
                <Button
                    variant="ghost"
                    size="icon"
                    on:click={handleRefresh}
                    disabled={isLoading}
                    class={`transition-opacity duration-500 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
                    aria-label="Refresh word"
                >
                    <Fa icon={faRotate} class="h-5 w-5" />
                </Button>
            </div>
            {#if currentWord}
                <div transition:fade={{ duration: 300 }}>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">{currentWord.pos}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{currentWord.definition}</p>
                    <p class="text-sm text-gray-700 dark:text-gray-300 italic mb-2">"{currentWord.example}"</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Rarity: {currentWord.rarity}/5</p>
                </div>
            {:else}
                <p class="text-sm text-gray-600 dark:text-gray-400">Loading word...</p>
            {/if}
        </CardContent>
    </Card>
