<script lang='ts'>
    import StarScore from '$lib/colorguesser/StarScore.svelte';
    export let score: number;
    export let maxScore: number = 500;

</script>

<div class='text-lg my-2'>
    Your Score: <StarScore score={score} maxScore={maxScore} />
</div>