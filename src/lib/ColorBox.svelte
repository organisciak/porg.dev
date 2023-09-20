<script lang="ts">
    import { fade } from 'svelte/transition';
    import tinycolor from "tinycolor2";

    export let colorname: string;
    export let csshex: string;
    export let fadeInDuration: number = 0;
    export let fadeInDelay: number = 0;
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

<style>
    .color-box {
        padding: 7px 30px 7px 7px;
        font-weight: 700;
        width: 77px;
        height: 100px;
        margin: 7px;
        display: inline-block;
    }

    .color-box-container {
        display: inline-block;
        margin: 3px;
        padding:2px 2px 17px 2px;
        border-style: solid;
        border-width: 1px;
        border-radius: 3px;
    }
</style>

<div class='color-box-container'
style='background:{bgColor}; border-color: {borderColor};'  in:fade={{ duration: 300 }}>
<div class="color-box"
  in:fade={{ delay: fadeInDelay, duration: fadeInDuration }}
  style='background-color:{csshex}; color:{textColor.toString()}' 
    on:click={() => hexvis = true} > <!-- Don't toggle off again. Why? Someone may want to copy the hex code -->
    {colorname}<br/>
    {#if hexvis}
        <span style="font-size:smaller" in:fade={{ duration: 1000 }}>{csshex}</span>
    {/if}
    
</div>
</div>