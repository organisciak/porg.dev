export type RGBColor = {'red': number, 'green': number, 'blue': number};
export type CMYKColor = {'cyan': number, 'magenta': number, 'yellow': number, 'black': number };
export type HSLColor = {'hue': number, 'saturation': number, 'lightness': number};
export type HSVColor = { 'hue': number, 'saturation': number, 'value': number};
export type XYZColor = { x: number, y: number, z: number };
export type CIELABColor = { l: number, a: number, b: number };

// Reference white for D65 illuminant
// This is a constant in the CIE XYZ color space, relying on Google+ChatGPT here...
const refX =  95.047;
const refY = 100.000;
const refZ = 108.883;

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
  const hex = hash.trim().slice(1);
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

function rgbToXyz(rgb: RGBColor): XYZColor {
  let r = rgb.red / 255, g = rgb.green / 255, b = rgb.blue / 255;

  if (r > 0.04045) {
      r = Math.pow(((r + 0.055) / 1.055), 2.4);
  } else {
      r = r / 12.92;
  }
  if (g > 0.04045) {
      g = Math.pow(((g + 0.055) / 1.055), 2.4);
  } else {
      g = g / 12.92;
  }
  if (b > 0.04045) {
      b = Math.pow(((b + 0.055) / 1.055), 2.4);
  } else {
      b = b / 12.92;
  }

  r = r * 100;
  g = g * 100;
  b = b * 100;

  const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const z = r * 0.0193 + g * 0.1192 + b * 0.9505;

  return {x, y, z};
}

function xyzToCielab(xyz: XYZColor): CIELABColor {
  let x = xyz.x / refX;
  let y = xyz.y / refY;
  let z = xyz.z / refZ;

  if (x > 0.008856) {
      x = Math.pow(x, 1/3);
  } else {
      x = (903.3 * x + 16) / 116;
  }
  if (y > 0.008856) {
      y = Math.pow(y, 1/3);
  } else {
      y = (903.3 * y + 16) / 116;
  }
  if (z > 0.008856) {
      z = Math.pow(z, 1/3);
  } else {
      z = (903.3 * z + 16) / 116;
  }

  const l = (116 * y) - 16;
  const a = 500 * (x - y);
  const b = 200 * (y - z);

  return { l, a, b };
}

export function hexToCielab(hash: ColorHash): CIELABColor {
  const rgb = hexToRgb(hash);
  const xyz = rgbToXyz(rgb);
  return xyzToCielab(xyz);
}

function cielabToXyz(cielab: CIELABColor): XYZColor {
  let y = (cielab.l + 16) / 116;
  let x = cielab.a / 500 + y;
  let z = y - cielab.b / 200;

  const x3 = x * x * x;
  const y3 = y * y * y;
  const z3 = z * z * z;

  if (y3 > 0.008856) {
      y = y3;
  } else {
      y = (y - 16 / 116) / 7.787;
  }
  if (x3 > 0.008856) {
      x = x3;
  } else {
      x = (x - 16 / 116) / 7.787;
  }
  if (z3 > 0.008856) {
      z = z3;
  } else {
      z = (z - 16 / 116) / 7.787;
  }

  x = refX * x;
  y = refY * y;
  z = refZ * z;

  return {x, y, z};
}

function xyzToRgb(xyz: XYZColor): RGBColor {
  const x = xyz.x / 100;
  const y = xyz.y / 100;
  const z = xyz.z / 100;

  let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  let b = x * 0.0557 + y * -0.2040 + z * 1.0570;

  if (r > 0.0031308) {
      r = 1.055 * Math.pow(r, 1/2.4) - 0.055;
  } else {
      r = 12.92 * r;
  }
  if (g > 0.0031308) {
      g = 1.055 * Math.pow(g, 1/2.4) - 0.055;
  } else {
      g = 12.92 * g;
  }
  if (b > 0.0031308) {
      b = 1.055 * Math.pow(b, 1/2.4) - 0.055;
  } else {
      b = 12.92 * b;
  }

  r = Math.min(Math.max(0, r), 1);
  g = Math.min(Math.max(0, g), 1);
  b = Math.min(Math.max(0, b), 1);

  return {'red': r * 255, 'green': g * 255, 'blue': b * 255};
}

export function cielabToHex(cielab: CIELABColor): ColorHash {
  const xyz = cielabToXyz(cielab);
  const rgb = xyzToRgb(xyz);
  return rgbToHex(rgb);
}

function rgbToHsv(rgb: RGBColor): HSVColor {
  const r = rgb.red / 255;
  const g = rgb.green / 255;
  const b = rgb.blue / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
      switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }

  return { 'hue': h * 360, 'saturation': s * 100, 'value': v * 100 };
}

// DISTANCES

function euclideanDistance(coords1:number[], coords2:number[]): number {
  let sum = 0;
  for (let i = 0; i < coords1.length; i++) {
    sum += Math.pow(coords1[i] - coords2[i], 2);
  }
  return Math.round(Math.sqrt(sum) * 100) / 100;
}

/*
Calculate the distance between two hex colors via Euclidean cielab distance
For reference, black to white distance is 100. Not sure the max dist, but
brute-forcing 10k comparisons, the highest I saw was 248.6 (avg 84.3)
*/
export function hexColorToCielabDistance(color1:string, color2:string): number {
  const c1 = hexToCielab(color1);
  const c2 = hexToCielab(color2);
  return euclideanDistance([c1.l, c1.a, c1.b], [c2.l, c2.a, c2.b]);
}

export function rgbColorToCielabDistance(color1: RGBColor, color2: RGBColor): number {
  return hexColorToCielabDistance(rgbToHex(color1), rgbToHex(color2));
}

/*
Stats for a 100k randomized HSV dist measures:
avg dist:  137.04     max dist:  375.74
*/
export function hexColorToHSVDistance(color1:string, color2:string): number {
  return rgbColorToHSVDistance(hexToRgb(color1), hexToRgb(color2));
};

export function rgbColorToHSVDistance(color1: RGBColor, color2: RGBColor): number {
  const c1 = rgbToHsv(color1);
  const c2 = rgbToHsv(color2);
  return euclideanDistance([c1.hue, c1.saturation, c1.value], [c2.hue, c2.saturation, c2.value]);
}

/*
Stats for a 100k randomized RGB dist measures:
avg dist:  176.30     max dist:  414.33
*/
export function rgbColorToRGBDistance(color1: RGBColor, color2: RGBColor): number {
  return euclideanDistance([color1.red, color1.green, color1.blue], [color2.red, color2.green, color2.blue]);
}

export function hexColorToRGBDistance(color1: string, color2: string): number {
  return rgbColorToRGBDistance(hexToRgb(color1), hexToRgb(color2));
}