<script lang='ts'>
    // Show a score iconographically
    import BarScale from '$lib/components/BarScale.svelte';

    // import FiveStarScale from '$lib/components/FiveStarScale.svelte';
    export let score: number = 0;
    export let minScore: number = 0;
    export let maxScore: number = 100;
    export let colorGuess: string = 'rgb(139 92 246)';
    export let colorTarget: string = 'rgb(107 114 128)';
    let starCount: number = 0;
    const calculateStars = function(score: number, minScore: number, maxScore: number) {
        // This isn't linear - it's a curve that's been tweaked heuristically
        const percentile = (score - minScore) / (maxScore - minScore);
        let starCount: number;
        if (percentile < 0.05) {
            starCount = 5;
        } else if (percentile < 0.08) {
            starCount = 4.5;
        } else if (percentile < 0.13) {
            starCount = 4;
        } else if (percentile < 0.17) {
            starCount = 3.5;
        } else if (percentile < 0.22) {
            starCount = 3;
        } else if (percentile < 0.25) {
            starCount = 2.5;
        } else if (percentile < 0.30) {
            starCount = 2;
        } else if (percentile < 0.37) {
            starCount = 1.5;
        } else if (percentile < 0.42) {
            starCount = 1;
        } else if (percentile < 0.60) {
            starCount = .5;
        } else {
            starCount = 0;
        }
        return starCount;
    }
    $: starCount = calculateStars(score, minScore, maxScore);
</script>

<BarScale score={starCount*2} maxScore=10 
    colorStart={colorGuess}
    colorEnd={colorTarget} />

