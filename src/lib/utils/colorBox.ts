import tinycolor from "tinycolor2";

export function getTextColor(cssHex: string) {
  /* Calculate a text color based on luminosity of a background color */
  const color = tinycolor(cssHex);
  if (color.isDark()) {
    color.brighten(60);
  } else if (color.isLight()) {
    color.darken(40);
  }
  return color.toHexString();
}

export function getTertiaryColors(cssHex: string) {
  /* Calculate background, text, and border colors for a ColorBox */

  const color = tinycolor(cssHex);

  // Background is just a little brighter
  const bgColor = color.clone().brighten(9).toHexString();

  // if color is very bright, include a darker border
  let borderColor: string;
  if (color.getLuminance() > 0.8) {
    borderColor = color.clone().darken(5).toHexString();
  } else {
    borderColor = color.clone().brighten(7).toHexString();
  }

  const textColor = getTextColor(cssHex);

  return {
    bgColor: bgColor,
    borderColor: borderColor,
    textColor: textColor,
  };
}
