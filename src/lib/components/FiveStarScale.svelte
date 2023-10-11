<script lang='ts'>
    // Show a five-star scale, using half-pts when necessary
    import Fa from 'svelte-fa';
    import { faStar, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons';
    // import regular faStar for empty stars
    import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';

    export let score: number = 0;

    let fullStars: number;
    let halfStars: number;
    let emptyStars: number;
    
    $: {
        fullStars = Math.floor(score);
        halfStars = Math.ceil(score - fullStars);
        emptyStars = 5 - fullStars - halfStars;
    }
</script>

<div class="flex flex-row">
    {#each Array(fullStars) as _}
        <Fa icon={faStar} class="text-yellow-500" />
    {/each}
    {#each Array(halfStars) as _}
        <Fa icon={faStarHalfStroke} class="text-yellow-500" />
    {/each}
    {#each Array(emptyStars) as _}
        <Fa icon={faStarEmpty} class="text-yellow-500" />
    {/each}
</div>

