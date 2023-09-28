<script lang="ts">
	import "../app.postcss";
    import Header from '$lib/header/Header.svelte';

	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	
	inject({ mode: dev ? 'development' : 'production' });
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
