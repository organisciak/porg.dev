<script lang='ts'>
    export let attempts: number = 0;
    export let maxAttempts: number = 5;

    let remaining: number;
    $: remaining = attempts < maxAttempts ? maxAttempts-attempts: 0;
</script>

<div class='flex flex-row flex-wrap justify-center'>
    {#each Array(attempts) as _, i}
        <div class='w-5 h-1 m-1 rounded-full bg-gray-500 dark:bg-gray-500'></div>
    {/each}
    {#if remaining > 0}
        <div class='w-5 h-1 m-1 rounded-full bg-violet-500'></div>
    {/if}
    {#if remaining > 1}
        {#each Array(remaining - 1) as _, i}
            <div class='w-5 h-1 m-1 rounded-full bg-gray-300 dark:bg-gray-700'></div>
        {/each}
    {/if}
</div>
