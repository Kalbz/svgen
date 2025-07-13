import { generateBlobPoints } from "../generators/randomShape";
import { createLayeredBlobSVG } from "../generators/randomShape";
import { cornersConfig } from "../config";

export function createCornersBlobs() {
  const svg = document.getElementById('svgContainer');
  svg.querySelector('#cornerBlobs')?.remove(); // Clean previous render

  const svgNS = "http://www.w3.org/2000/svg";
  const width = 1500;
  const height = 1002;

  const size = cornersConfig.size ?? 250;
  const scaleStep = cornersConfig.scaleStep ?? 0.12;
  const steps = cornersConfig.steps ?? 6;



  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.style.width = '100%';
  svg.style.height = '100%';




  const colors = cornersConfig.palette.slice(0, steps);

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
    numLayers: steps,
    colors,
    opacityStep: 0.12,
    scaleStep,
    width: size * 2,
    height: size * 2,
    basePoints,
  });

  // Remove the use of padding from the positions array
  const positions = cornersConfig.whichCorners === 'tlbr'
    ? [
        { x: width, y: 0, rotate: 0 }, // top-right
        { x: 0, y: height, rotate: 180 }, // bottom-left
      ]
    : [
        { x: 0, y: 0, rotate: 0 }, // top-left
        { x: width, y: height, rotate: 180 }, // bottom-right
      ];

  const group = document.createElementNS(svgNS, 'g');
  group.setAttribute('id', 'cornerBlobs');

  positions.forEach(pos => {
    const positioned = document.createElementNS(svgNS, 'g');
    positioned.setAttribute(
      'transform',
      `translate(${pos.x - size}, ${pos.y - size}) rotate(${pos.rotate}, ${size}, ${size})`
    );
    positioned.appendChild(blob.cloneNode(true));
    group.appendChild(positioned);
  });

  svg.appendChild(group);
}
