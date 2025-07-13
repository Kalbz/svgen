import { createBlob } from "./blob";
import { blobConfig } from "../config";

export function createScatterEffect() {
  const svg = document.getElementById('svgContainer');
  svg.innerHTML = '';

  const numBlobs = 15;

  const width = 1500;
  const height = 1002;

  for (let i = 0; i < numBlobs; i++) {
    const randomX = Math.random() * width;
    const randomY = Math.random() * height;

    const randomBlob = {
      ...blobConfig,
      centerX: randomX,
      centerY: randomY,
      radius: Math.random() * 60 + 40,
      fill: `hsl(${Math.random() * 360}, 70%, 60%)`,
      noise: Math.random() * 0.4 + 0.1,
      pointCount: Math.floor(Math.random() * 8) + 6,
      _scatterMode: true
    };


    createBlob(randomBlob);
  }
}
