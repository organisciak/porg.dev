<script lang="ts">
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
  class="snes-dialog"
  class:visible={showModal}
>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="snes-modal" on:click|stopPropagation>
    <slot name="header" />
    <div class="modal-divider"></div>
    <slot />

    <!-- svelte-ignore a11y-autofocus -->
    <p class="modal-actions">
      <button class="guesser-button-lg" type="button" autofocus on:click={() => dialog.close()}>
        Close
      </button>
    </p>
  </div>
</dialog>

<style lang="postcss">
  .snes-dialog {
    width: min(90vw, 720px);
    background: transparent;
    border: none;
    padding: 0;
    opacity: 0;
    transform: translateY(8px) scale(0.96);
    transition:
      transform 0.2s ease-out,
      opacity 0.2s ease-out;
  }

  .snes-dialog.visible {
    opacity: 1;
    transform: translateY(0) scale(1);
  }

  .snes-modal {
    background: rgba(18, 18, 40, 0.96);
    border: 2px solid #2c2c50;
    padding: 1rem;
    margin: 1.25rem;
    color: #cfd6ff;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  }

  .modal-divider {
    border-top: 1px solid #2f2f58;
    margin: 0.75rem 0;
  }

  .modal-actions {
    margin-top: 1rem;
    text-align: center;
  }

  dialog::backdrop {
    background: rgba(0, 0, 0, 0.6);
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

  .guesser-button-lg {
    --button-shadow: #7a1f00;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    font-family: inherit;
    font-size: 0.55rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 0.5rem 1rem;
    border: 2px solid #0a0a1a;
    background: linear-gradient(180deg, #ffcc00 0%, #ff6600 100%);
    color: #1a1a1a;
    box-shadow:
      0 4px 0 var(--button-shadow),
      0 0 0 2px #0a0a1a;
    cursor: pointer;
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease;
    text-decoration: none;
  }

  .guesser-button-lg:hover {
    transform: translateY(-1px);
    box-shadow:
      0 5px 0 var(--button-shadow),
      0 0 0 2px #0a0a1a;
  }

  .guesser-button-lg:active {
    transform: translateY(2px);
    box-shadow:
      0 2px 0 var(--button-shadow),
      0 0 0 2px #0a0a1a;
  }

  .guesser-button-lg:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 2px;
  }
</style>
