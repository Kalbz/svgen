import { generateBlobPoints } from "../generators/randomShape";
import { createLayeredBlobSVG } from "../generators/randomShape";
import { cornersConfig } from "../config";


// --- Corners Blobs Rendering ---
export function createCornersBlobs() {
    const wrapper = document.getElementById('svgContainer');
    wrapper.innerHTML = '';
    const w = window.innerWidth;
    const h = window.innerHeight;
    const size = cornersConfig.size;
    // Colors for steps
    const colors = cornersConfig.palette.slice(0, cornersConfig.steps);
    // Generate the base points ONCE
    const basePoints = generateBlobPoints(size, size, size / 2.2, cornersConfig.points, cornersConfig.complexity);
    // Create the base blob SVG with center at (size, size)
    const blobSvg = createLayeredBlobSVG({
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
    blobSvg.setAttribute('viewBox', `0 0 ${size * 2} ${size * 2}`);
    blobSvg.setAttribute('width', `${size * 2}`);
    blobSvg.setAttribute('height', `${size * 2}`);
    // Top-left & bottom-right or top-right & bottom-left
    const positions = cornersConfig.whichCorners === 'tlbr'
        ? [
            { style: { left: `${-size}px`, top: `${-size}px` }, rotate: 0 },
            { style: { right: `${-size}px`, bottom: `${-size}px` }, rotate: 180 },
        ]
        : [
            { style: { right: `${-size}px`, top: `${-size}px` }, rotate: 0 },
            { style: { left: `${-size}px`, bottom: `${-size}px` }, rotate: 180 },
        ];
    // Place blobs in corners
    positions.forEach(pos => {
        const svgClone = blobSvg.cloneNode(true);
        svgClone.style.position = 'absolute';
        svgClone.style.width = `${size * 2}px`;
        svgClone.style.height = `${size * 2}px`;
        svgClone.style.pointerEvents = 'none';
        svgClone.style.transform = `rotate(${pos.rotate}deg)`;
        svgClone.style.zIndex = 1;
        // Set only the relevant style properties
        if (pos.style.left !== undefined) svgClone.style.left = pos.style.left;
        if (pos.style.right !== undefined) svgClone.style.right = pos.style.right;
        if (pos.style.top !== undefined) svgClone.style.top = pos.style.top;
        if (pos.style.bottom !== undefined) svgClone.style.bottom = pos.style.bottom;
        wrapper.appendChild(svgClone);
    });
    // Make sure wrapper is relative
    wrapper.style.position = 'relative';
    wrapper.style.width = '100vw';
    wrapper.style.height = '100vh';
}