<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import * as Card from "$lib/components/ui/card";
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

<Card.Root class="h-full">
    <Card.Header>
        <Card.Title>
            <slot name="title" {currentItem}>
                {currentItem ? defaultTitle : 'Loading...'}
            </slot>
            <Button
                variant="ghost"
                size="icon"
                on:click={handleRefresh}
                disabled={isLoading}
                class={`m-0 p-0 transition-opacity duration-500 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
                aria-label="Refresh item"
            >
                <Fa icon={faRotate} class="h-5 w-5" />
            </Button>
        </Card.Title>
    </Card.Header>
    <Card.Content>
        {#if currentItem}
            <div transition:fade={{ duration: 300 }}>
                <slot {currentItem} />
            </div>
        {:else}
            <p class="text-sm text-gray-600 dark:text-gray-400">Loading {defaultTitle.toLowerCase()}...</p>
        {/if}
    </Card.Content>
    <Card.Footer>
        <slot name="footer" />
    </Card.Footer>
</Card.Root>
