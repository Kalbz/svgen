import { hexToHSL } from "./hex";
import { waveConfig } from "../config";

// --- Auto Stacked Wave Rendering ---
export function createAutoStackedWaves() {
  const svg = document.getElementById('svgContainer');

  // Remove only previous wave layers
  svg.querySelector('#waves')?.remove();

  const width = 1500;
  const height = 1002;
  const svgNS = 'http://www.w3.org/2000/svg';

  const base = hexToHSL(waveConfig.baseColor);
  const group = document.createElementNS(svgNS, 'g');
  group.setAttribute('id', 'waves');

  for (let i = 0; i < waveConfig.amount; i++) {
    const lightness =
      base.l + (100 - base.l) * (i / (waveConfig.amount - 1)) * waveConfig.contrast;
    const fill = `hsl(${base.h}, ${base.s}%, ${lightness}%)`;

    const amplitude =
      height * 0.12 * (0.7 + 0.6 * waveConfig.complexity) *
      (1 - i / waveConfig.amount * 0.3);
    const frequency = 1.5 + waveConfig.complexity * 2 + (Math.random() - 0.5) * 0.2;
    const phase = Math.random() * Math.PI * 2;
    const verticalOffset = height * (i / (waveConfig.amount - 1));
    const smoothness = 0.7 + 0.3 * waveConfig.complexity;

    const points = [];
    const pointCount = Math.floor(40 + 80 * smoothness);
    for (let j = 0; j <= pointCount; j++) {
      const x = (j / pointCount) * width;
      const theta = (x / width) * frequency * Math.PI * 2 + phase;
      const y = verticalOffset + Math.sin(theta) * amplitude;
      points.push({ x, y });
    }

    let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
    for (let j = 1; j < points.length; j++) {
      d += ` L ${points[j].x.toFixed(2)} ${points[j].y.toFixed(2)}`;
    }
    d += ` L ${width} ${height} L 0 ${height} Z`;

    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', fill);
    path.setAttribute('stroke', 'none');
    path.setAttribute('opacity', 1);

    group.appendChild(path);
  }

  svg.appendChild(group);
}
