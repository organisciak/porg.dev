<script lang="ts">
    import { onMount } from 'svelte';
    import { getTertiaryColors } from '$lib/utils/colorBox';
    import { wrapText } from '$lib/utils/canvasUtils';

    export let canvas: HTMLCanvasElement;
    export let colorname: string | null = null;
    export let csshex: string;
    export let width: number = 200;
    export let height: number = 200;
    export let textSize: number = 24;
    export let hidden:boolean = false;

    export let margin: number = 10;

    export async function getBlob() {
        const blob = await new Promise((resolve) => 
            canvas.toBlob(resolve, "image/png")
            );
        return blob;
    }

    // to make text crisper, scale everything up by 4, then scale down the canvas itself
    const scaled = {
        width: width * 4,
        height: height * 4,
        textSize: textSize * 4,
        margin: margin * 4,
    }

    const { bgColor, borderColor, textColor } = getTertiaryColors(csshex);

    
    let ctx;

      // Initialize canvas

    onMount(() => {
        ctx = canvas.getContext("2d");
        if (ctx === null) {
            console.error("Could not get canvas context");
        } else{
        // Clear existing drawings
        ctx?.clearRect(0, 0, canvas.width, canvas.height);


        // Draw the outer div
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, scaled.width, scaled.height);
        ctx.strokeStyle = borderColor;
        ctx.strokeRect(0, 0, scaled.width, scaled.height);

        // Draw the inner div
        ctx.fillStyle = csshex;
        ctx?.fillRect(scaled.margin,
                    scaled.margin,
                    scaled.width-scaled.margin*2,
                    scaled.height-scaled.margin*2); // x, y, width, height

        // Draw the color name text
        ctx.fillStyle = textColor;
        ctx.font = `${scaled.textSize}px Arial`;
        let nameHeight = 0;
        if (colorname !== null) {
            // Draw wrapped text and get the height
            nameHeight = wrapText(ctx, colorname,
                    scaled.margin*1.5, scaled.margin*2,
                    scaled.width-scaled.margin*3.5,
                    scaled.textSize);
        }

        // Draw the CSS hex value
        ctx.fillStyle = textColor;
        const hexSizeMod = .65
        ctx.font = `${scaled.textSize*hexSizeMod}px Arial`;
        ctx.fillText(csshex, scaled.margin*1.5,
            scaled.margin*2.2 + nameHeight + scaled.textSize*hexSizeMod*.75);
        }
    });

</script>

<canvas class:hidden bind:this={canvas} width="{scaled.width}" height="{scaled.height}" style="width: {width}px; height: {height}px;"></canvas>