<script lang="ts">
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import ColorBoxCanvas from "$lib/colorbox/ColorBoxCanvas.svelte";
  import { getTertiaryColors } from "$lib/utils/colorBox";
  import { Share } from "lucide-svelte";

  export let colorname: string | null = null;
  export let csshex: string;
  export let fadeInDuration: number = 0;
  export let fadeInDelay: number = 0;
  export let showHex: boolean = true;
  export let shareButton: boolean = true;
  export let border: boolean = false;
  // ALWAYS SAFELIST POSSIBLE VALUES if writing tailwind classes dynamically
  export let textSize: "xs" | "sm" | "base" | "lg" | "xl" | "inherit" = "inherit";
  // height and width are now set dynamically based on the parent container (i.e. always full here)
  // the below is now removed
  //export let width: 28 | 32 | 48 | 64 | 72 | "full" = 32;
  //export let height: 28 | 32 | 48 | 64 | 72 | "full" = 28;

  let shareable: boolean = false;
  let hexvis: boolean = false;
  let canvas: HTMLCanvasElement;
  let getBlob: () => Promise<Blob>;

  let bgColor: string;
  let borderColor: string;
  let textColor: string;

  $: {
    ({ bgColor, borderColor, textColor } = getTertiaryColors(csshex));
  }

  onMount(() => {
    if (navigator.share && navigator.canShare) {
      shareable = true;
    } else {
      shareButton = false;
    }
  });
  async function share() {
    if (shareable && shareButton) {
      // Convert canvas to blob
      const blob = await getBlob();

      const filesArray = [new File([blob], "image.png", { type: "image/png" })];

      // Check if sharing files is supported
      if (shareable && navigator.canShare({ files: filesArray })) {
        navigator
          .share({
            files: filesArray,
            title: colorname ? colorname : csshex,
            text: colorname ? csshex : "Color share",
          })
          .then(() => console.log("Successfully shared"))
          .catch((error) => console.log("Error sharing:", error));
      } else {
        console.log("File sharing is not supported");
      }
    } else {
      alert("Web Share API not supported.");
    }
  }
</script>

<div
  class="flex flex-col {border
    ? 'p-1 pb-4'
    : 'p-1'} h-full w-full items-start justify-start rounded-sm border"
  style="background:{bgColor}; border-color: {borderColor};"
  in:fade|global={{ duration: fadeInDuration }}
>
  {#if shareButton && shareable}
    <ColorBoxCanvas hidden={true} bind:getBlob bind:canvas {colorname} {csshex} />
  {/if}

  <div
    role="button"
    tabindex="0"
    class="flex h-full w-full flex-col items-start p-1 text-sm"
    in:fade|global={{ delay: fadeInDelay, duration: fadeInDuration }}
    style="background-color:{csshex}; color:{textColor}"
    aria-label={showHex ? "Select to see CSS" : "Select-to-see-color is Disabled"}
    title={colorname}
    on:click={() => (hexvis = true)}
    on:keydown={(e) => {
      if (e.key === "Enter") hexvis = true;
    }}
  >
    <!-- Colorname -->
    <div class="flex text-{textSize} select-none">
      {#if colorname !== null}{colorname}{/if}
    </div>

    <!-- Hex and Share -->
    <div class="flex">
      {#if shareButton && shareable}
        <button
          class="absolute bottom-0 right-0 bg-transparent p-2"
          on:click={share}
          on:keydown={(e) => {
            if (e.key === "Enter") share();
          }}
          aria-label="Share this color"
          title="Share this color"
          tabindex="0"
        >
          <span class="text-lg" style="color:{bgColor}"><Share /></span>
        </button>
      {/if}

      {#if hexvis && showHex}
        <div class="text-xs" in:fade|global={{ duration: 1000 }}>{csshex}</div>
      {/if}
    </div>
  </div>
</div>
