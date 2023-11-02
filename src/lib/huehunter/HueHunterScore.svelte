<script lang='ts'>
    // Show a score iconographically
    import BarScale from '$lib/components/BarScale.svelte';
    import { calculateBoundScore, rawScoreThreshold } from '$lib/huehunter/colorGuesser';
    export let score: number = 0;
    export let colorGuess: string = 'rgb(139 92 246)';
    // The raw score at which the bound score is zero, made more forgiving slightly
    export let maxScore: number = rawScoreThreshold;
    export let size: 'base' | 'lg' = 'base';
    let starCount: number = 0;

    $: starCount = calculateBoundScore(score, maxScore);
</script>

<BarScale score={starCount} size={size}
    maxScore={10} 
    colorStart={colorGuess} />

