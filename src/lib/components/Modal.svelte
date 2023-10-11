<script lang='ts'>
    /* Basic Modal, customized from https://svelte.dev/examples/modal */
	export let showModal: boolean;

	let dialog: HTMLDialogElement;

	$: if (dialog && showModal) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
    class="max-w-xl rounded-none p-0 transition-transform duration-300 ease-out transform-gpu"
    class:scale-95={showModal}
    class:scale-100={showModal}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="p-4" on:click|stopPropagation>
		<slot name="header" />
		<hr class="border-t border-gray-300" />
		<slot />
		<hr class="border-t border-gray-300" />
		<!-- svelte-ignore a11y-autofocus -->
		<button class="block w-full px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        autofocus on:click={() => dialog.close()}>Close</button>
	</div>
</dialog>

<style>
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>