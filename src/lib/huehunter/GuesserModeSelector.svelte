<script lang='ts'>
    type PlayMode = "INFINITE" | "DAILY" | "PRACTICE";
    type ColorMode = "RGB" | "CMYK";
    export let playMode: PlayMode;
    export let colorMode: ColorMode;
    export let practiceLock: boolean = false;
</script>

<div class="mode-selector">
    <div class="mode-row">
        <span class="mode-label">Play mode</span>
        {#each ['Daily', 'Infinite', 'Practice'] as mode}
            {#if mode.toUpperCase() == playMode}
                <span class="mode-option active">{mode}</span>
            {:else if (mode === 'Practice') && practiceLock}
                <span class="mode-option disabled">{mode}</span>
            {:else}
                <a class="mode-option" data-sveltekit-prefetch href="{mode.toLowerCase()}-{colorMode.toLowerCase()}">{mode}</a>
            {/if}
        {/each}
    </div>

    <div class="mode-row">
        <span class="mode-label">Color mode</span>
        {#each ['RGB', 'CMYK'] as mode}
            {#if mode.toUpperCase() == colorMode}
                <span class="mode-option active">{mode}</span>
            {:else}
                <a class="mode-option" data-sveltekit-prefetch href="{playMode.toLowerCase()}-{mode.toLowerCase()}">{mode}</a>
            {/if}
        {/each}
    </div>
</div>

<style>
    .mode-selector {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        font-size: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #cfd6ff;
    }

    .mode-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.4rem;
    }

    .mode-label {
        color: #88ccff;
    }

    .mode-option {
        padding: 0.2rem 0.4rem;
        border: 1px solid transparent;
        color: inherit;
        text-decoration: none;
    }

    .mode-option.active {
        color: #ffcc00;
        border-color: #ffcc00;
    }

    .mode-option.disabled {
        color: #555;
    }
</style>
