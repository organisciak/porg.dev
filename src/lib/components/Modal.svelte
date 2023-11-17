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
    class="max-w-xl bg-transparent rounded-md p-0 transition-transform duration-300 ease-out transform-gpu"
    class:scale-95={showModal}
    class:scale-100={showModal}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="border-slate-900 border-2 p-2 m-4 rounded-lg bg-white dark:bg-slate-800 dark:text-slate-300" on:click|stopPropagation>
		<slot name="header" />
		<hr class="border-t border-gray-300 dark:border-gray-600" />
		<slot />
		
		<!-- svelte-ignore a11y-autofocus -->
		<p class='my-1 text-center'>
		<button class="text-center  guesser-button-lg"
        autofocus on:click={() => dialog.close()}>Close</button>
		</p>
	</div>
</dialog>

<style lang='postcss'>
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

	.guesser-button {
        @apply bg-cyan-400 dark:bg-cyan-700 ;
        @apply hover:bg-cyan-500 hover:dark:bg-cyan-700;
        @apply focus:bg-cyan-500 focus:dark:bg-cyan-700 ;
        @apply border-black border-2;
        @apply hover:bg-gradient-to-r hover:from-cyan-600 hover:via-violet-500 hover:to-yellow-500 text-transparent bg-clip-text;
        @apply rounded-full justify-center;
        @apply font-semibold;
        @apply shadow-lg;
    }

    .guesser-button-lg {
        @apply guesser-button;
        @apply py-2 px-6;
    }
</style>