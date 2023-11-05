<script lang='ts'>
    import NotoMoonScale from '$lib/components/NotoMoonScale.svelte';
    // Show a score iconographically
    import { calculateBoundScore, rawScoreThreshold } from '$lib/huehunter/colorGuesser';
    export let score: number = 0;
    // The raw score at which the bound score is zero, made more forgiving slightly
    export let maxScore: number = rawScoreThreshold;
    let starCount: number = 0;

    $: starCount = calculateBoundScore(score, maxScore);
</script>

<div><NotoMoonScale score={starCount/2} maxScore={5} /></div>

