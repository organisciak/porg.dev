import tinycolor from "tinycolor2";

export function setTertiaryColors(cssHex: string) {
    /* Calculate background, text, and border colors for a ColorBox */

    const color = tinycolor(cssHex);
    
    // Background is just a little brighter
    const bgColor = color.clone().brighten(9).toHexString();

    // if color is very bright, include a darker border
    let borderColor: string;
    if (color.getLuminance() > .80) {
        borderColor = color.clone().darken(5).toHexString();
    } else {
        borderColor = color.clone().brighten(7).toHexString();
    }

    // if color is very dark, include a lighter text color, and vice-versa
    let textColor = color.clone();
    if (color.isDark()) {
        textColor.brighten(60);
    } else if (color.isLight()) {
        textColor.darken(40);
    }

    return {
        bgColor: bgColor,
        borderColor: borderColor,
        textColor: textColor.toHexString()
    }
}