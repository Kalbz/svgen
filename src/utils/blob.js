import { createLayeredBlobSVG, generateBlobPoints as generateBlobPointsExternal } from '../generators/randomShape';

export function createBlob(options = {}) {
  const svg = document.getElementById('svgContainer');

  // Remove existing blob (but leave other things like corner blobs)
  if (!options._scatterMode) svg.querySelector('#mainBlob')?.remove();

  const width = 1500;
  const height = 1002;

  const config = {
    ...options,
    width,
    height,
    centerX: options.centerX ?? width / 2,
    centerY: options.centerY ?? height / 2,
    radius: options.radius ?? 60,
    pointCount: options.pointCount ?? 12,
    noise: options.noise ?? 0.3,
    smoothness: options.smoothness ?? 0.8,
    fill: options.fill ?? '#FFFF00',
    stroke: options.stroke ?? '#00000010',
    strokeWidth: options.strokeWidth ?? 1,
    layered: options.layered ?? false,
    steps: options.steps ?? 10,
    palette: options.palette ?? [options.fill || '#FF6B6B'],
    opacityStep: options.opacityStep ?? 0.12,
    scaleStep: options.scaleStep ?? 0.12,
  };

  const svgNS = "http://www.w3.org/2000/svg";
  const group = document.createElementNS(svgNS, 'g');

  if (options._scatterMode) {
    group.classList.add('scatterBlob');
  } else {
    group.setAttribute('id', 'mainBlob');
  }

  if (config.layered) {
    const basePoints = generateBlobPointsExternal(
      config.centerX,
      config.centerY,
      config.radius,
      config.pointCount,
      config.noise
    );

    const layeredBlob = createLayeredBlobSVG({
      cx: config.centerX,
      cy: config.centerY,
      r: config.radius,
      points: config.pointCount,
      randomness: config.noise,
      numLayers: config.steps,
      colors: config.palette,
      opacityStep: config.opacityStep,
      scaleStep: config.scaleStep,
      width: config.radius * 2,
      height: config.radius * 2,
      basePoints,
    });

    group.appendChild(layeredBlob);
  } else {
    const points = generateBlobPoints(config);
    const pathData = createSmoothPath(points, config);

    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('fill', config.fill);
    path.setAttribute('stroke', config.stroke);
    path.setAttribute('stroke-width', config.strokeWidth);

    group.appendChild(path);
  }

  svg.appendChild(group);
}

function generateBlobPoints(config) {
  const points = [];
  const angleStep = (Math.PI * 2) / config.pointCount;
  for (let i = 0; i < config.pointCount; i++) {
    const angle = i * angleStep;
    const noiseFactor = config.noise * 0.5;
    const radiusVariation = (Math.random() - 0.5) * config.radius * noiseFactor;
    const r = config.radius + radiusVariation;
    const x = config.centerX + Math.cos(angle) * r;
    const y = config.centerY + Math.sin(angle) * r;
    points.push({ x, y });
  }
  return points;
}

function createSmoothPath(points, config) {
  if (points.length < 3) return '';
  const n = points.length;
  let d = '';
  const get = (i) => points[(i + n) % n];
  d += `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 0; i < n; i++) {
    const p0 = get(i - 1);
    const p1 = get(i);
    const p2 = get(i + 1);
    const p3 = get(i + 2);
    const t = config.smoothness;
    const c1x = p1.x + (p2.x - p0.x) / 6 * t;
    const c1y = p1.y + (p2.y - p0.y) / 6 * t;
    const c2x = p2.x - (p3.x - p1.x) / 6 * t;
    const c2y = p2.y - (p3.y - p1.y) / 6 * t;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  d += ' Z';
  return d;
}

