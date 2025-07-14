import { createBlob } from "./blob";
import { blobConfig } from "../config";

import { scatterConfig } from '../config';

export function createScatterEffect() {
  const svg = document.getElementById('svgContainer');
  svg.innerHTML = '';

  const width = 1500;
  const height = 1002;

  for (let i = 0; i < scatterConfig.count; i++) {
    const randomX = Math.random() * width;
    const randomY = Math.random() * height;
    const radius = Math.random() * (scatterConfig.maxRadius - scatterConfig.minRadius) + scatterConfig.minRadius;

    const randomBlob = {
      ...blobConfig,
      centerX: randomX,
      centerY: randomY,
      radius,
      fill: `hsl(${Math.random() * 360}, 70%, 60%)`,
      noise: Math.random() * 0.4 + 0.1,
      pointCount: Math.floor(Math.random() * 8) + 6,
      _scatterMode: true
    };

    createBlob(randomBlob);
  }
}
