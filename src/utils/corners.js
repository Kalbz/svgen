import { generateBlobPoints } from "../generators/randomShape";
import { createLayeredBlobSVG } from "../generators/randomShape";
import { cornersConfig } from "../config";

export function createCornersBlobs() {
  const wrapper = document.getElementById('svgContainer');
  wrapper.innerHTML = ''; // Clear current contents

  const width = 1500;  // Use your app’s shared SVG dimensions
  const height = 1002;
  const size = cornersConfig.size;
  const svgNS = "http://www.w3.org/2000/svg";

  // Prepare a shared <svg> with consistent size (if not already set in index.html)
  wrapper.setAttribute("viewBox", `0 0 ${width} ${height}`);
  wrapper.setAttribute("width", width);
  wrapper.setAttribute("height", height);

  const colors = cornersConfig.palette.slice(0, cornersConfig.steps);

  const basePoints = generateBlobPoints(
    size,
    size,
    size / 2.2,
    cornersConfig.points,
    cornersConfig.complexity
  );

  const blob = createLayeredBlobSVG({
    cx: size,
    cy: size,
    r: size / 2.2,
    points: cornersConfig.points,
    randomness: cornersConfig.complexity,
    numLayers: cornersConfig.steps,
    colors,
    opacityStep: 0.12,
    scaleStep: 0.12,
    width: size * 2,
    height: size * 2,
    basePoints,
  });

  const positions = cornersConfig.whichCorners === 'tlbr'
    ? [
        { x: 0, y: 0, rotate: 0 },
        { x: width, y: height, rotate: 180 },
      ]
    : [
        { x: width, y: 0, rotate: 0 },
        { x: 0, y: height, rotate: 180 },
      ];

  positions.forEach(pos => {
    const group = document.createElementNS(svgNS, 'g');
    group.setAttribute(
      'transform',
      `translate(${pos.x - size}, ${pos.y - size}) rotate(${pos.rotate}, ${size}, ${size})`
    );
    group.appendChild(blob.cloneNode(true));
    wrapper.appendChild(group); // ⬅️ Append to the existing shared #svgContainer
  });
}
