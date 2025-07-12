import { hexToHSL } from "./hex";
import { waveConfig } from "../config";


// --- Auto Stacked Wave Rendering ---
export function createAutoStackedWaves() {
    const wrapper = document.getElementById('svgContainer');
    wrapper.innerHTML = '';
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', waveConfig.width);
    svg.setAttribute('height', waveConfig.height);
    svg.setAttribute('viewBox', `0 0 ${waveConfig.width} ${waveConfig.height}`);

    // Color base (convert to HSL for easy lightening)
    const base = hexToHSL(waveConfig.baseColor);
    for (let i = 0; i < waveConfig.amount; i++) {
        // Color: lighter for each layer
        const lightness = base.l + (100 - base.l) * (i / (waveConfig.amount - 1)) * waveConfig.contrast;
        const fill = `hsl(${base.h}, ${base.s}%, ${lightness}%)`;
        // Wave params
        const amplitude = waveConfig.height * 0.12 * (0.7 + 0.6 * waveConfig.complexity) * (1 - i / waveConfig.amount * 0.3);
        const frequency = 1.5 + waveConfig.complexity * 2 + (Math.random() - 0.5) * 0.2;
        const phase = Math.random() * Math.PI * 2;
        const verticalOffset = waveConfig.height * (i / (waveConfig.amount - 1));
        const smoothness = 0.7 + 0.3 * waveConfig.complexity;
        // Generate points
        const points = [];
        const pointCount = Math.floor(40 + 80 * smoothness);
        for (let j = 0; j <= pointCount; j++) {
            const x = (j / pointCount) * waveConfig.width;
            const theta = (x / waveConfig.width) * frequency * Math.PI * 2 + phase;
            const y = verticalOffset + Math.sin(theta) * amplitude;
            points.push({ x, y });
        }
        let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
        for (let j = 1; j < points.length; j++) {
            d += ` L ${points[j].x.toFixed(2)} ${points[j].y.toFixed(2)}`;
        }
        d += ` L ${waveConfig.width} ${waveConfig.height}`;
        d += ` L 0 ${waveConfig.height} Z`;
        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute('d', d);
        path.setAttribute('fill', fill);
        path.setAttribute('stroke', 'none');
        path.setAttribute('opacity', 1);
        svg.appendChild(path);
    }
    wrapper.appendChild(svg);
}
