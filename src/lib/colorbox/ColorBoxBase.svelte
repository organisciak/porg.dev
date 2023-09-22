<script lang="ts">
    import { fade } from 'svelte/transition';
    import tinycolor from "tinycolor2";

    export let colorname: string | null = null;
    export let csshex: string;
    export let fadeInDuration: number = 0;
    export let fadeInDelay: number = 0;
    export let showHex: boolean = true;

    let hexvis: boolean = false;

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
        
</script>

<div class="flex m-1 p-1 mb-6 border rounded-sm items-start justify-start"
style='background:{bgColor}; border-color: {borderColor};'  in:fade={{ duration: 300 }}>
  <div class="flex flex-col w-32 h-28 mb-4 text-sm p-1 items-start justify-start"
    in:fade={{ delay: fadeInDelay, duration: fadeInDuration }}
    style='background-color:{csshex}; color:{textColor.toString()}' 
    on:click={() => hexvis = true}>
    <div class="flex text-sm">{#if colorname !== null}{colorname}{/if}</div>
      {#if hexvis && showHex}
          <div class="flex text-xs" in:fade={{ duration: 1000 }}>{csshex}</div>
      {/if}
  </div>
</div>
