export type RGBColor = {'red': number, 'green': number, 'blue': number};

export type CMYKColor = {'cyan': number, 'magenta': number, 'yellow': number, 'black': number };

export type HSLColor = {'hue': number, 'saturation': number, 'lightness': number};

export type HSVColor = { 'hue': number, 'saturation': number, 'value': number};

export type Color = RGBColor | CMYKColor | HSLColor | HSVColor;

export type ColorHash = string;

export function cmykToRgb(cmyk: CMYKColor): RGBColor {
  const c = cmyk.cyan / 100;
  const m = cmyk.magenta / 100;
  const y = cmyk.yellow / 100;
  const k = cmyk.black / 100;

  const r = 1 - Math.min(1, c * (1 - k) + k);
  const g = 1 - Math.min(1, m * (1 - k) + k);
  const b = 1 - Math.min(1, y * (1 - k) + k);

  return {'red': r * 255, 'green': g * 255, 'blue': b * 255} as RGBColor;
}

export function rgbToCmyk(rgb: RGBColor): CMYKColor {
  const r = rgb.red / 255;
  const g = rgb.green / 255;
  const b = rgb.blue / 255;

  const k = Math.min(1 - r, 1 - g, 1 - b);
  const c = (1 - r - k) / (1 - k) || 0;
  const m = (1 - g - k) / (1 - k) || 0;
  const y = (1 - b - k) / (1 - k) || 0;

  return {
          'cyan': c * 100,
          'magenta': m * 100,
          'yellow': y * 100,
          'black': k * 100
        } as CMYKColor;
}

export function hexToRgb(hash: ColorHash): RGBColor {
  const hex = hash.slice(1);
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return {'red': r, 'green': g, 'blue': b} as RGBColor;
}

export function rgbToHex(rgb: RGBColor): ColorHash {
  const bigint = (rgb.red << 16) | (rgb.green << 8) | rgb.blue;
  const hex = bigint.toString(16);

  return `#${hex}`;
}