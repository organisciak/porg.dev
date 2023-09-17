<script lang="ts">
    import { fade } from 'svelte/transition';

    export let colorname: string;
    export let csshex: string;
    let hexvis: boolean = false;

    function linearize_rgb_value(value: number): number {
        value = value / 255.0;
        if (value <= 0.04045) {
            return value / 12.92;
        } else {
            return ((value + 0.055) / 1.055) ** 2.4;
        }
    }

    function css_to_rgb(css: string): [number, number, number] {
        let bigint = parseInt(css.substring(1), 16);
        let r = (bigint >> 16) & 255;
        let g = (bigint >> 8) & 255;
        let b = bigint & 255;
        return [r, g, b];
    }

    function relative_luminance(rgb: [number, number, number]): number {
        let r, g, b;
        [r, g, b] = rgb;
        r = linearize_rgb_value(r);
        g = linearize_rgb_value(g);
        b = linearize_rgb_value(b);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    function text_color_for_background(css: string, threshold = .35): string {
        let rgb = css_to_rgb(css);
        let L = relative_luminance(rgb);
        return L > threshold ? "black" : "white";
    }

    const textColor: string = text_color_for_background(csshex);
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
</style>

<div class="color-box" style='background-color: {csshex}; color: {textColor}' 
    on:click={() => hexvis = true} > <!-- Don't toggle off again. Why? Someone may want to copy the hex code -->
    {colorname}<br/>
    {#if hexvis}
        <span style="font-size:smaller" in:fade={{ y: 1, duration: 300 }}>{csshex}</span>
    {/if}
    
</div>