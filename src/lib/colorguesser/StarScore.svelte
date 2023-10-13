<script lang='ts'>
    // Show a score iconographically
    import BarScale from '$lib/components/BarScale.svelte';

    // import FiveStarScale from '$lib/components/FiveStarScale.svelte';
    export let score: number = 0;
    export let colorGuess: string = 'rgb(139 92 246)';
    export let maxScore: number = 176.30 + 10; // The raw score at which the bound score is zero, made more forgiving sliglty
    let starCount: number = 0;

    /*  normalize the score to a 0-10 scale, where zero is any number where the scale is
     greater than maxScore, and everything else is linearly scaled to 10.
    ] */
    const calculateBoundScore = function(score:number) {
        if (score > maxScore) {
            return 0;
        } else {
            return Math.round(10 * (maxScore - score) / maxScore);
        }
    }
    $: starCount = calculateBoundScore(score);
</script>

<BarScale score={starCount} maxScore={10} 
    colorStart={colorGuess} />

