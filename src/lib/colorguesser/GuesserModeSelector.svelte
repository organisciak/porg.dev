<script lang='ts'>
    type PlayMode = "INFINITE" | "DAILY" | "PRACTICE";
    type ColorMode = "RGB" | "CMYK";
    export let playMode: PlayMode;
    export let colorMode: ColorMode;
</script>

<div>
    <span class="text-slate-400 text-xs uppercase mx-2">Play mode</span>
    {#each ['Daily', 'Infinite', 'Practice'] as mode}
        {#if mode.toUpperCase() == playMode}
            <span class='font-extrabold mx-2'>{mode}</span>
        {:else}
            <a class="font-light mx-2" data-sveltekit-prefetch href="{mode.toLowerCase()}-{colorMode.toLowerCase()}">{mode}</a>
        {/if}
    {/each}

    <br /><span class="text-slate-400 text-xs uppercase mx-2">Color mode</span>
    {#each ['RGB', 'CMYK'] as mode}
        {#if mode.toUpperCase() == colorMode}
            <span class='font-extrabold mx-2'>{mode}</span>
        {:else}
            <a class='font-light mx-2' data-sveltekit-prefetch href="{playMode.toLowerCase()}-{mode.toLowerCase()}">{mode}</a>
        {/if}
    {/each}
    <hr class='my-2' />

</div>