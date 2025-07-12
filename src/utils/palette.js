import { hexToHSL } from "./hex";

export function generatePalette(baseHex, steps) {
    // Simple HSL lightness step
    const base = hexToHSL(baseHex);
    const palette = [];
    for (let i = 0; i < steps; i++) {
        const lightness = base.l + (100 - base.l) * (i / (steps - 1)) * 0.7;
        palette.push(`hsl(${base.h}, ${base.s}%, ${lightness}%)`);
    }
    return palette;
}