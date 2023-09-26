<script lang="ts">
	import "../app.postcss";
    import Header from '$lib/header/Header.svelte';

 	import { page } from '$app/stores';

</script>

<svelte:head>
	<link href="https://sigmoid.social/@porg" rel="me">
</svelte:head>

<Header></Header>

<main>
	<slot></slot>
</main>

<footer>
	<!-- TODO Footer-->
</footer>
