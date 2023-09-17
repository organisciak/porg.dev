<script lang="ts">
	export const prerender = true;
	import Header from '$lib/header/Header.svelte';
	import '../app.css';
</script>

<Header />

<main>
	<slot />
</main>

<footer>
	<!-- TODO Footer-->
</footer>
