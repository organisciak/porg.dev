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
  - lucide-svelte
  - tailwindcss (for styling)

  Note: Ensure that the import paths for shadcn-svelte components are correct for your project structure.
-->

<script lang="ts">
    import RandomItemLoader from '$lib/components/RandomItemLoader.svelte';
</script>

<RandomItemLoader apiEndpoint="/api/random-word" defaultTitle="Unusual Words">
    
    <svelte:fragment slot="default" let:currentItem={word}>
        {#if word}
            <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">{word.word}</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">{word.pos}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{word.definition}</p>
            <p class="text-sm text-gray-700 dark:text-gray-300 italic mb-2">"{word.example}"</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">Rarity: {word.rarity}/5</p>
        {/if}
    </svelte:fragment>
</RandomItemLoader>
