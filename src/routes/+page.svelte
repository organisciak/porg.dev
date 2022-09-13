<script lang="ts">
	import Card from '$lib/Card.svelte';
</script>

<svelte:head>
	<title>New Perspectives</title>
	<meta name="description" content="New Perspectives card deck" />
</svelte:head>

<section>
	<h1>
		New Perspectives
	</h1>

	<Card />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}
</style>
