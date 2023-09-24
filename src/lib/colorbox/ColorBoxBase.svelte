<script lang="ts">
    import { fade } from 'svelte/transition';
    import { onMount } from "svelte";
    import tinycolor from "tinycolor2";

    export let colorname: string | null = null;
    export let csshex: string;
    export let fadeInDuration: number = 0;
    export let fadeInDelay: number = 0;
    export let showHex: boolean = true;

    let hexvis: boolean = false;
    let canvas: HTMLCanvasElement;

    const color = tinycolor(csshex);
    
    let textColor = color.clone();
    if (color.isDark()) {
            textColor.brighten(60);
        } else if (color.isLight()) {
            textColor.darken(60);
        }

    const bgColor = color.clone().brighten(9).toHexString();
    let borderColor: string;
    if (color.getLuminance() > .80) {
        borderColor = color.clone().darken(5).toHexString();
    } else {
        borderColor = color.clone().brighten(7).toHexString();
    }

  async function share() {
    if (navigator.share && navigator.canShare) {
      // Draw on the canvas
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = csshex;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add text
        ctx.fillStyle = textColor;
        ctx.font = "30px Arial";
        //const textMetrics = ctx.measureText(colorname);
        const x = 10;
        const y = 30;
        ctx.fillText(colorname, x, y);

      // Convert canvas to blob
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      const filesArray = [new File([blob], "image.png", { type: "image/png" })];

      // Check if sharing files is supported
      if (navigator.canShare({ files: filesArray })) {
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

  // Initialize canvas
  onMount(() => {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = csshex;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  });
        
</script>

<canvas bind:this={canvas} class="hidden" width="400" height="400"></canvas>

<div on:click={share} class="flex m-1 p-1 mb-6 border rounded-sm items-start justify-start"
style='background:{bgColor}; border-color: {borderColor};'  in:fade={{ duration: fadeInDuration }}>
  <div class="flex flex-col w-32 h-28 mb-4 text-sm p-1 items-start justify-start"
    in:fade={{ delay: fadeInDelay, duration: fadeInDuration }}
    style='background-color:{csshex}; color:{textColor.toString()}' 
    on:click={() => hexvis = true}>
    <div class="flex text-base">{#if colorname !== null}{colorname}{/if}</div>
      {#if hexvis && showHex}
          <div class="flex text-xs" in:fade={{ duration: 1000 }}>{csshex}</div>
      {/if}
  </div>
</div>
