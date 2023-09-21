import exp from "constants";

export type RGBColor = [number, number, number];

export type CMYKColor = [number, number, number, number];

export type HSLColor = [number, number, number];

export type HSVColor = [number, number, number];

export type Color = RGBColor | CMYKColor | HSLColor | HSVColor;

export type ColorHash = string;

export function cmykToRgb(cmyk: CMYKColor): RGBColor {
    const c = cmyk[0] / 100;
    const m = cmyk[1] / 100;
    const y = cmyk[2] / 100;
    const k = cmyk[3] / 100;

    const r = 1 - Math.min(1, c * (1 - k) + k);
    const g = 1 - Math.min(1, m * (1 - k) + k);
    const b = 1 - Math.min(1, y * (1 - k) + k);

    return [r * 255, g * 255, b * 255];
}

export function rgbToCmyk(rgb: RGBColor): CMYKColor {
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;

    const k = Math.min(1 - r, 1 - g, 1 - b);
    const c = (1 - r - k) / (1 - k) || 0;
    const m = (1 - g - k) / (1 - k) || 0;
    const y = (1 - b - k) / (1 - k) || 0;

    return [c * 100, m * 100, y * 100, k * 100];
}

export function hashToRgb(hash: ColorHash): RGBColor {
    const hex = hash.slice(1);
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return [r, g, b];
}

export function rgbToHash(rgb: RGBColor): ColorHash {
    const r = rgb[0];
    const g = rgb[1];
    const b = rgb[2];

    const bigint = (r << 16) | (g << 8) | b;
    const hex = bigint.toString(16);

    return `#${hex}`;
}