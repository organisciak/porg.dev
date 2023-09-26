<script lang="ts">
	import "../app.postcss";
    import Header from '$lib/header/Header.svelte';

	import { MetaTags } from 'svelte-meta-tags';
 	import { page } from '$app/stores';

	 $: metaTags = {
		title: 'Peter Organisciak',
		titleTemplate: '%s | porg.dev',
		description: 'Applied AI Researcher', // Default description.
		...$page.data.metaTagsChild // Override with child page meta tags if they exist.
	};

</script>

<svelte:head>
	<link href="https://sigmoid.social/@porg" rel="me">
</svelte:head>

<MetaTags {...metaTags} />

<Header></Header>

<main>
	<slot></slot>
</main>

<footer>
	<!-- TODO Footer-->
</footer>
