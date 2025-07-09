// src/utils/wave.js

/**
 * Renders a customizable SVG wave in the #svgContainer element.
 * @param {Object} options - Wave options
 * @param {number} options.width - SVG width
 * @param {number} options.height - SVG height
 * @param {number} options.amplitude - Wave amplitude (px)
 * @param {number} options.frequency - Number of full waves across the width
 * @param {number} options.phase - Phase shift (radians)
 * @param {number} options.verticalOffset - Vertical offset (px)
 * @param {string} options.fill - Fill color
 * @param {string} options.stroke - Stroke color
 * @param {number} options.strokeWidth - Stroke width
 * @param {number} options.smoothness - 0-1, how smooth the wave is (affects point count)
 */
export function createWave(options = {}) {
    const wrapper = document.getElementById('svgContainer');
    wrapper.innerHTML = '';

    const config = {
        width: options.width || 800,
        height: options.height || 200,
        amplitude: options.amplitude || 40,
        frequency: options.frequency || 2,
        phase: options.phase || 0,
        verticalOffset: options.verticalOffset || 200,
        fill: options.fill || '#7ed6fc',
        stroke: options.stroke || 'none',
        strokeWidth: options.strokeWidth || 0,
        smoothness: options.smoothness || 0.8, // 0-1, higher = smoother
        ...options
    };

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', config.width);
    svg.setAttribute('height', config.height);
    svg.setAttribute('viewBox', `0 0 ${config.width} ${config.height}`);

    // Generate wave points
    const points = [];
    const pointCount = Math.floor(40 + 80 * config.smoothness); // More points = smoother
    for (let i = 0; i <= pointCount; i++) {
        const x = (i / pointCount) * config.width;
        const theta = (x / config.width) * config.frequency * Math.PI * 2 + config.phase;
        const y = config.verticalOffset + Math.sin(theta) * config.amplitude;
        points.push({ x, y });
    }

    // Build SVG path (wave top)
    let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
    for (let i = 1; i < points.length; i++) {
        d += ` L ${points[i].x.toFixed(2)} ${points[i].y.toFixed(2)}`;
    }
    // Close the path to the bottom of the SVG
    d += ` L ${config.width} ${config.height}`;
    d += ` L 0 ${config.height} Z`;

    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', config.fill);
    path.setAttribute('stroke', config.stroke);
    path.setAttribute('stroke-width', config.strokeWidth);

    svg.appendChild(path);
    wrapper.appendChild(svg);
} 