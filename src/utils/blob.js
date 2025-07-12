

export function createBlob(options = {}) {
    const wrapper = document.getElementById('svgContainer');
    wrapper.innerHTML = '';


    const config = {
        ...options,
        width: options.width ?? 400,
        height: options.height ?? 400,
        centerX: options.centerX ?? 100,
        centerY: options.centerY ?? 100,
        radius: options.radius ?? 60,
        pointCount: options.pointCount ?? 12,
        noise: options.noise ?? 0.3,
        smoothness: options.smoothness ?? 0.8,
        fill: options.fill ?? '#FFFF00',
        stroke: options.stroke ?? '#00000010',
        strokeWidth: options.strokeWidth ?? 1,
    };


    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", config.width);
    svg.setAttribute("height", config.height);
    svg.setAttribute("viewBox", `0 0 ${config.width} ${config.height}`);

    const points = generateBlobPoints(config);
    const pathData = createSmoothPath(points, config);

    // Add to SVG
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", config.fill);
    path.setAttribute("stroke", config.stroke);
    path.setAttribute("stroke-width", config.strokeWidth);

    svg.appendChild(path);
    wrapper.appendChild(svg);
}

function generateBlobPoints(config) {
    const points = [];
    const angleStep = (Math.PI * 2) / config.pointCount;
    
    // Generate base points with controlled noise
    for (let i = 0; i < config.pointCount; i++) {
        const angle = i * angleStep;
        
        // Add some controlled randomness to the radius
        const noiseFactor = config.noise * 0.5;
        const radiusVariation = (Math.random() - 0.5) * config.radius * noiseFactor;
        const r = config.radius + radiusVariation;
        
        const x = config.centerX + Math.cos(angle) * r;
        const y = config.centerY + Math.sin(angle) * r;
        
        points.push({ x, y });
    }
    
    return points;
}

// Catmull-Rom to Bézier conversion for smooth, tangent-continuous blobs
function createSmoothPath(points, config) {
    if (points.length < 3) return '';
    const n = points.length;
    let d = '';

    // Helper to get wrapped index
    const get = (i) => points[(i + n) % n];

    // Start at the first point
    d += `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

    for (let i = 0; i < n; i++) {
        // Catmull-Rom control points
        const p0 = get(i - 1);
        const p1 = get(i);
        const p2 = get(i + 1);
        const p3 = get(i + 2);

        // Catmull-Rom to Bézier conversion
        // The smoothness parameter can be used to interpolate between straight lines and full Catmull-Rom
        const t = config.smoothness; // 0 = straight lines, 1 = full Catmull-Rom

        const c1x = p1.x + (p2.x - p0.x) / 6 * t;
        const c1y = p1.y + (p2.y - p0.y) / 6 * t;
        const c2x = p2.x - (p3.x - p1.x) / 6 * t;
        const c2y = p2.y - (p3.y - p1.y) / 6 * t;

        d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
    }
    d += ' Z';
    return d;
}

// Additional utility functions for different blob styles
export function createRandomBlob() {
    const options = {
        pointCount: Math.floor(Math.random() * 8) + 8, // 8-15 points
        noise: Math.random() * 0.6 + 0.2, // 0.2-0.8 noise
        smoothness: Math.random() * 0.4 + 0.6, // 0.6-1.0 smoothness
        fill: `hsl(${Math.random() * 360}, 70%, 60%)`,
        radius: Math.random() * 60 + 80 // 80-140 radius
    };
    
    createBlob(options);
}

export function createOrganicBlob() {
    const options = {
        pointCount: 16,
        noise: 0.4,
        smoothness: 0.9,
        fill: '#4CAF50',
        radius: 100
    };
    
    createBlob(options);
}

export function createGeometricBlob() {
    const options = {
        pointCount: 6,
        noise: 0.1,
        smoothness: 0.7,
        fill: '#2196F3',
        radius: 120
    };
    
    createBlob(options);
}
