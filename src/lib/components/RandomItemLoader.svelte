<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { Card, CardContent } from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import Fa from 'svelte-fa';
    import { faRotate } from '@fortawesome/free-solid-svg-icons';

    export let apiEndpoint: string;
    export let defaultTitle: string = 'Item';

    let currentItem: any | null = null;
    let isLoading = false;

    async function fetchRandomItem() {
        isLoading = true;
        try {
            const response = await fetch(apiEndpoint);
            if (!response.ok) {
                throw new Error('Failed to fetch item');
            }
            currentItem = await response.json();
        } catch (error) {
            console.error('Error fetching item:', error);
            currentItem = null;
        } finally {
            isLoading = false;
        }
    }

    function handleRefresh() {
        fetchRandomItem();
    }

    onMount(() => {
        fetchRandomItem();
    });
</script>

<Card class="w-80 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
    <CardContent class="p-6">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200">
                <slot name="title" {currentItem}>
                    {currentItem ? defaultTitle : 'Loading...'}
                </slot>
            </h2>
            <Button
                variant="ghost"
                size="icon"
                on:click={handleRefresh}
                disabled={isLoading}
                class={`transition-opacity duration-500 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
                aria-label="Refresh item"
            >
                <Fa icon={faRotate} class="h-5 w-5" />
            </Button>
        </div>
        {#if currentItem}
            <div transition:fade={{ duration: 300 }}>
                <slot {currentItem} />
            </div>
        {:else}
            <p class="text-sm text-gray-600 dark:text-gray-400">Loading {defaultTitle.toLowerCase()}...</p>
        {/if}
    </CardContent>
</Card>
