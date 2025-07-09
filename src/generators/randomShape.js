// Utility to create a layered blob SVG (for use in corners, etc.)
export function createLayeredBlobSVG({
  cx = 200,
  cy = 200,
  r = 120,
  points = 8,
  randomness = 0.3,
  numLayers = 6,
  colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#843bff', '#ff3b94'],
  opacityStep = 0.12,
  scaleStep = 0.12,
  width,
  height,
  basePoints = null,
} = {}) {
  // If basePoints are not provided, generate them once and reuse for all layers
  let pts = basePoints;
  if (!pts) {
    pts = generateBlobPoints(cx, cy, r, points, randomness);
  }
  const svgWidth = width || cx * 2;
  const svgHeight = height || cy * 2;
  const masterSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  masterSvg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
  masterSvg.setAttribute('width', `${svgWidth}`);
  masterSvg.setAttribute('height', `${svgHeight}`);
  masterSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  for (let i = 0; i < numLayers; i++) {
    const d = createSmoothBlobPathFromPoints(pts);
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', colors[i % colors.length]);
    path.setAttribute('opacity', `${0.5 + i * opacityStep}`);
    // Scale and center
    const scale = 1 + (numLayers - i - 1) * scaleStep;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${cx}, ${cy}) scale(${scale}) translate(${-cx}, ${-cy})`);
    g.appendChild(path);
    masterSvg.appendChild(g);
  }
  return masterSvg;
}

// Generate points for a blob
export function generateBlobPoints(cx, cy, r, points = 8, randomness = 0.3) {
  const angleStep = (Math.PI * 2) / points;
  const pts = [];
  for (let i = 0; i < points; i++) {
    const angle = i * angleStep;
    const random = 1 + Math.random() * randomness;
    const x = cx + Math.cos(angle) * r * random;
    const y = cy + Math.sin(angle) * r * random;
    pts.push({ x, y });
  }
  return pts;
}

// Create a smooth blob path from a set of points
export function createSmoothBlobPathFromPoints(pts) {
  let path = `M ${pts[0].x},${pts[0].y} `;
  for (let i = 0; i < pts.length; i++) {
    const p1 = pts[i];
    const p2 = pts[(i + 1) % pts.length];
    const p0 = pts[(i - 1 + pts.length) % pts.length];
    const p3 = pts[(i + 2) % pts.length];
    const control1 = {
      x: p1.x + (p2.x - p0.x) * 0.2,
      y: p1.y + (p2.y - p0.y) * 0.2,
    };
    const control2 = {
      x: p2.x - (p3.x - p1.x) * 0.2,
      y: p2.y - (p3.y - p1.y) * 0.2,
    };
    path += `C ${control1.x},${control1.y} ${control2.x},${control2.y} ${p2.x},${p2.y} `;
  }
  path += 'Z';
  return path;
}
