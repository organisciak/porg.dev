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

<div class="score-display">
    <NotoMoonScale score={starCount/2} maxScore={5} />
</div>

<style>
    .score-display {
        display: inline-flex;
        align-items: center;
        color: #ffcc00;
        filter: drop-shadow(0 0 6px rgba(255, 204, 0, 0.35));
    }
</style>
