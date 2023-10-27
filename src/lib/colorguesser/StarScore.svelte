<script lang='ts'>
    // Show a score iconographically
    import BarScale from '$lib/components/BarScale.svelte';
    import { calculateBoundScore } from '$lib/colorguesser/colorGuesser';

    // import FiveStarScale from '$lib/components/FiveStarScale.svelte';
    export let score: number = 0;
    export let colorGuess: string = 'rgb(139 92 246)';
    export let maxScore: number = 176.30 + 10; // The raw score at which the bound score is zero, made more forgiving sliglty
    let starCount: number = 0;

    $: starCount = calculateBoundScore(score, maxScore);
</script>

<BarScale score={starCount} maxScore={10} 
    colorStart={colorGuess} />

