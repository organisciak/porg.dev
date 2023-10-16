<script lang="ts">
    import { fade } from 'svelte/transition';
    import { onMount } from 'svelte';
    import ColorBoxCanvas from '$lib/colorbox/ColorBoxCanvas.svelte';
    import { getTertiaryColors } from '$lib/utils/colorBox';
    import Fa from 'svelte-fa';
    import { faShare } from '@fortawesome/free-solid-svg-icons';

    export let colorname: string | null = null;
    export let csshex: string;
    export let fadeInDuration: number = 0;
    export let fadeInDelay: number = 0;
    export let showHex: boolean = true;
    export let shareButton: boolean = true;
    export let border: boolean = false;
    // tailwind text size extension
    export let textSize: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" = "base";
    export let width: number = 32;
    export let height: number = 28;

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
            shareable = true
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
            text: colorname ? csshex : 'Color share',
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

{#if shareButton && shareable}
<ColorBoxCanvas hidden={true} bind:getBlob={getBlob} bind:canvas={canvas} colorname={colorname} csshex={csshex} />
{/if}

<div class="flex m-1 {border ? "p-1" : ""} mb-6 border rounded-sm items-start justify-start"
style='background:{bgColor}; border-color: {borderColor};'  in:fade={{ duration: fadeInDuration }}>
<div role="button" tabindex="0" class="relative flex flex-col w-{width} h-{height} {border ? "mb-4" : "m-1"} text-sm p-1 items-start justify-start"
    in:fade={{ delay: fadeInDelay, duration: fadeInDuration }}
    style='background-color:{csshex}; color:{textColor}' 
    aria-label="{showHex ? "Select to see CSS": "Select-to-see-color is Disabled"}"
    title="{colorname}"
    on:click={() => hexvis = true}
    on:keydown={(e) => {if (e.key === 'Enter') hexvis = true}}>
    
    <div class="flex text-{textSize} select-none">
        {#if colorname !== null}{colorname}{/if}
    </div>

    <div class="flex">
        {#if shareButton && shareable}
            <button 
                class="absolute bottom-0 right-0 bg-transparent p-2"
                on:click={share}
                on:keydown={(e) => {if (e.key === 'Enter') share()}}
                aria-label="Share this color"
                title="Share this color"
                tabindex="0">
                <span class="text-lg" style="color:{bgColor}"><Fa icon={faShare} /></span>
            </button>
        {/if}

        {#if hexvis && showHex}
          <div class="text-xs" in:fade={{ duration: 1000 }}>{csshex}</div>
         {/if}
    </div>
  </div>
</div>
