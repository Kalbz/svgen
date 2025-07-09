import { randomTheme } from './generators/randomTheme';
import { changeShape } from './generators/changeShape';
import { changeColor } from './generators/changeColor';
// import { randomShape } from './generators/randomShape';
import { createBlob, createRandomBlob, createOrganicBlob, createGeometricBlob } from './utils/blob';
import { createWave } from './utils/wave';
import { createLayeredBlobSVG } from './generators/randomShape';
import { generateBlobPoints } from './generators/randomShape';

import './style.css'

randomTheme();

// --- Generator State ---
const GENERATORS = {
    blob: 'Blob',
    wave: 'Wave',
    corners: 'Corners',
};
let currentGenerator = 'blob';

// --- Blob State ---
let currentBlobConfig = {
    pointCount: 12,
    noise: 0.3,
    smoothness: 0.8,
    radius: 120,
    fill: '#FF6B6B',
    stroke: '#00000010',
    strokeWidth: 1
};

// --- Wave State (Auto Stacked) ---
let autoWaveConfig = {
    amount: 5, // number of waves
    complexity: 0.7, // 0-1, affects frequency/amplitude/smoothness
    contrast: 0.5, // 0-1, how much lighter the top wave is
    baseColor: '#1976d2', // base color (bottom wave)
    width: window.innerWidth,
    height: window.innerHeight,
};

// --- Corners State ---
let cornersConfig = {
    steps: 6,
    baseColor: '#FF2222',
    palette: ['#FF2222', '#FF6B6B', '#FFD93D', '#FFB347', '#FF7F50', '#FF3B94'],
    complexity: 0.3,
    points: 8,
    randomness: 0.3,
    whichCorners: 'tlbr', // 'tlbr' or 'trbl'
    size: 800,
};

// --- Main Render Function ---
function render() {
    if (currentGenerator === 'blob') {
        createBlob(currentBlobConfig);
        createBlobControls();
        removeWaveControls();
        removeCornersControls();
    } else if (currentGenerator === 'wave') {
        createAutoStackedWaves();
        createAutoWaveControls();
        removeBlobControls();
        removeCornersControls();
    } else if (currentGenerator === 'corners') {
        createCornersBlobs();
        createCornersControls();
        removeBlobControls();
        removeWaveControls();
    }
}

// --- Generator Switcher ---
function createGeneratorSwitcher() {
    let switcher = document.getElementById('generatorSwitcher');
    if (!switcher) {
        switcher = document.createElement('div');
        switcher.id = 'generatorSwitcher';
        switcher.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1100; display: flex; gap: 16px;';
        document.body.appendChild(switcher);
    }
    switcher.innerHTML = '';
    Object.entries(GENERATORS).forEach(([key, label]) => {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.style.cssText = `padding: 10px 24px; border-radius: 8px; border: none; background: ${currentGenerator === key ? '#4ECDC4' : '#333'}; color: white; font-size: 16px; cursor: pointer; font-weight: 600; transition: all 0.2s;`;
        btn.onclick = () => {
            currentGenerator = key;
            render();
            createGeneratorSwitcher();
        };
        btn.onmouseenter = () => btn.style.background = '#555';
        btn.onmouseleave = () => btn.style.background = currentGenerator === key ? '#4ECDC4' : '#333';
        switcher.appendChild(btn);
    });
}

// --- Blob Controls ---
function createBlobControls() {
    let controls = document.getElementById('sliderControls');
    if (!controls) {
        controls = document.createElement('div');
        controls.id = 'sliderControls';
        controls.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 1000 !important;
            background: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(10px);
            border-radius: 12px;
            padding: 20px;
            min-width: 280px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            border: 2px solid rgba(102, 126, 234, 0.3);
        `;
        document.body.appendChild(controls);
    }
    controls.style.display = 'block';
    controls.innerHTML = '';
    // Add title
    const title = document.createElement('h3');
    title.textContent = 'Blob Controls';
    title.style.cssText = 'margin: 0 0 20px 0; color: #333; font-size: 18px; font-weight: 600;';
    controls.appendChild(title);

    // Define slider configurations
    const sliders = [
        {
            label: 'Point Count',
            min: 3,
            max: 20,
            step: 1,
            value: currentBlobConfig.pointCount,
            property: 'pointCount',
            onChange: (value) => updateBlob({ pointCount: parseInt(value) })
        },
        {
            label: 'Noise',
            min: 0,
            max: 1,
            step: 0.01,
            value: currentBlobConfig.noise,
            property: 'noise',
            onChange: (value) => updateBlob({ noise: parseFloat(value) })
        },
        {
            label: 'Smoothness',
            min: 0,
            max: 1,
            step: 0.01,
            value: currentBlobConfig.smoothness,
            property: 'smoothness',
            onChange: (value) => updateBlob({ smoothness: parseFloat(value) })
        },
        {
            label: 'Radius',
            min: 50,
            max: 200,
            step: 1,
            value: currentBlobConfig.radius,
            property: 'radius',
            onChange: (value) => updateBlob({ radius: parseInt(value) })
        },
        {
            label: 'Stroke Width',
            min: 0,
            max: 5,
            step: 0.1,
            value: currentBlobConfig.strokeWidth,
            property: 'strokeWidth',
            onChange: (value) => updateBlob({ strokeWidth: parseFloat(value) })
        }
    ];

    // Create sliders
    sliders.forEach(sliderConfig => {
        const sliderGroup = document.createElement('div');
        sliderGroup.style.cssText = 'margin-bottom: 15px;';

        const label = document.createElement('label');
        label.textContent = sliderConfig.label;
        label.style.cssText = 'display: block; margin-bottom: 5px; color: #555; font-size: 14px; font-weight: 500;';
        sliderGroup.appendChild(label);

        const sliderRow = document.createElement('div');
        sliderRow.style.cssText = 'display: flex; align-items: center; gap: 10px;';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = sliderConfig.min;
        slider.max = sliderConfig.max;
        slider.step = sliderConfig.step;
        slider.value = sliderConfig.value;
        slider.style.cssText = `
            flex: 1;
            height: 6px;
            border-radius: 3px;
            background: #ddd;
            outline: none;
            -webkit-appearance: none;
            cursor: pointer;
        `;

        // Custom slider styling
        slider.addEventListener('input', (e) => {
            const value = e.target.value;
            sliderConfig.onChange(value);
            valueDisplay.textContent = value;
        });

        const valueDisplay = document.createElement('span');
        valueDisplay.textContent = sliderConfig.value;
        valueDisplay.style.cssText = 'min-width: 40px; text-align: right; color: #666; font-size: 12px; font-family: monospace;';

        sliderRow.appendChild(slider);
        sliderRow.appendChild(valueDisplay);
        sliderGroup.appendChild(sliderRow);
        controls.appendChild(sliderGroup);
    });

    // Add color picker
    const colorGroup = document.createElement('div');
    colorGroup.style.cssText = 'margin-bottom: 15px;';

    const colorLabel = document.createElement('label');
    colorLabel.textContent = 'Fill Color';
    colorLabel.style.cssText = 'display: block; margin-bottom: 5px; color: #555; font-size: 14px; font-weight: 500;';
    colorGroup.appendChild(colorLabel);

    const colorContainer = document.createElement('div');
    colorContainer.style.cssText = 'display: flex; gap: 10px; align-items: center;';

    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = currentBlobConfig.fill;
    colorPicker.style.cssText = 'width: 40px; height: 30px; border: none; border-radius: 6px; cursor: pointer;';

    colorPicker.addEventListener('input', (e) => {
        updateBlob({ fill: e.target.value });
    });

    const colorValue = document.createElement('span');
    colorValue.textContent = currentBlobConfig.fill;
    colorValue.style.cssText = 'color: #666; font-size: 12px; font-family: monospace;';

    colorContainer.appendChild(colorPicker);
    colorContainer.appendChild(colorValue);
    colorGroup.appendChild(colorContainer);
    controls.appendChild(colorGroup);

    // Add stroke color picker
    const strokeColorGroup = document.createElement('div');
    strokeColorGroup.style.cssText = 'margin-bottom: 15px;';

    const strokeColorLabel = document.createElement('label');
    strokeColorLabel.textContent = 'Stroke Color';
    strokeColorLabel.style.cssText = 'display: block; margin-bottom: 5px; color: #555; font-size: 14px; font-weight: 500;';
    strokeColorGroup.appendChild(strokeColorLabel);

    const strokeColorContainer = document.createElement('div');
    strokeColorContainer.style.cssText = 'display: flex; gap: 10px; align-items: center;';

    const strokeColorPicker = document.createElement('input');
    strokeColorPicker.type = 'color';
    strokeColorPicker.value = currentBlobConfig.stroke;
    strokeColorPicker.style.cssText = 'width: 40px; height: 30px; border: none; border-radius: 6px; cursor: pointer;';

    strokeColorPicker.addEventListener('input', (e) => {
        updateBlob({ stroke: e.target.value });
    });

    const strokeColorValue = document.createElement('span');
    strokeColorValue.textContent = currentBlobConfig.stroke;
    strokeColorValue.style.cssText = 'color: #666; font-size: 12px; font-family: monospace;';

    strokeColorContainer.appendChild(strokeColorPicker);
    strokeColorContainer.appendChild(strokeColorValue);
    strokeColorGroup.appendChild(strokeColorContainer);
    controls.appendChild(strokeColorGroup);

    // Add reset button
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset to Default';
    resetButton.style.cssText = `
        width: 100%;
        padding: 10px;
        background: #ff6b6b;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.3s ease;
    `;
    resetButton.addEventListener('click', resetToDefault);
    resetButton.addEventListener('mouseenter', () => {
        resetButton.style.background = '#ff5252';
    });
    resetButton.addEventListener('mouseleave', () => {
        resetButton.style.background = '#ff6b6b';
    });
    controls.appendChild(resetButton);
    
    console.log('Blob control buttons created');
}
function removeBlobControls() {
    let controls = document.getElementById('sliderControls');
    if (controls) controls.style.display = 'none';
}

// --- Auto Stacked Wave Rendering ---
function createAutoStackedWaves() {
    const wrapper = document.getElementById('svgContainer');
    wrapper.innerHTML = '';
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', autoWaveConfig.width);
    svg.setAttribute('height', autoWaveConfig.height);
    svg.setAttribute('viewBox', `0 0 ${autoWaveConfig.width} ${autoWaveConfig.height}`);

    // Color base (convert to HSL for easy lightening)
    const base = hexToHSL(autoWaveConfig.baseColor);
    for (let i = 0; i < autoWaveConfig.amount; i++) {
        // Color: lighter for each layer
        const lightness = base.l + (100 - base.l) * (i / (autoWaveConfig.amount - 1)) * autoWaveConfig.contrast;
        const fill = `hsl(${base.h}, ${base.s}%, ${lightness}%)`;
        // Wave params
        const amplitude = autoWaveConfig.height * 0.12 * (0.7 + 0.6 * autoWaveConfig.complexity) * (1 - i / autoWaveConfig.amount * 0.3);
        const frequency = 1.5 + autoWaveConfig.complexity * 2 + (Math.random() - 0.5) * 0.2;
        const phase = Math.random() * Math.PI * 2;
        const verticalOffset = autoWaveConfig.height * (i / (autoWaveConfig.amount - 1));
        const smoothness = 0.7 + 0.3 * autoWaveConfig.complexity;
        // Generate points
        const points = [];
        const pointCount = Math.floor(40 + 80 * smoothness);
        for (let j = 0; j <= pointCount; j++) {
            const x = (j / pointCount) * autoWaveConfig.width;
            const theta = (x / autoWaveConfig.width) * frequency * Math.PI * 2 + phase;
            const y = verticalOffset + Math.sin(theta) * amplitude;
            points.push({ x, y });
        }
        let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
        for (let j = 1; j < points.length; j++) {
            d += ` L ${points[j].x.toFixed(2)} ${points[j].y.toFixed(2)}`;
        }
        d += ` L ${autoWaveConfig.width} ${autoWaveConfig.height}`;
        d += ` L 0 ${autoWaveConfig.height} Z`;
        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute('d', d);
        path.setAttribute('fill', fill);
        path.setAttribute('stroke', 'none');
        path.setAttribute('opacity', 1);
        svg.appendChild(path);
    }
    wrapper.appendChild(svg);
}

// --- Auto Wave Controls ---
function createAutoWaveControls() {
    let controls = document.getElementById('waveControls');
    if (!controls) {
        controls = document.createElement('div');
        controls.id = 'waveControls';
        controls.style.cssText = `
            position: fixed; 
            top: 20px; 
            right: 20px; 
            z-index: 1000; 
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            padding: 20px;
            min-width: 320px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            border: 2px solid rgba(102, 126, 234, 0.3);
            max-height: 90vh;
            overflow-y: auto;
        `;
        document.body.appendChild(controls);
    }
    controls.style.display = 'block';
    controls.innerHTML = '';
    // Title
    const title = document.createElement('h3');
    title.textContent = 'Wave Settings';
    title.style.cssText = 'margin: 0 0 20px 0; color: #333; font-size: 18px; font-weight: 600;';
    controls.appendChild(title);
    // Sliders
    const sliders = [
        { label: 'Amount', min: 2, max: 20, step: 1, value: autoWaveConfig.amount, property: 'amount' },
        { label: 'Complexity', min: 0, max: 1, step: 0.01, value: autoWaveConfig.complexity, property: 'complexity' },
        { label: 'Contrast', min: 0, max: 1, step: 0.01, value: autoWaveConfig.contrast, property: 'contrast' },
    ];
    sliders.forEach(sliderConfig => {
        const group = document.createElement('div');
        group.style.cssText = 'margin-bottom: 15px;';
        const label = document.createElement('label');
        label.textContent = sliderConfig.label;
        label.style.cssText = 'display: block; margin-bottom: 5px; color: #555; font-size: 14px; font-weight: 500;';
        group.appendChild(label);
        const row = document.createElement('div');
        row.style.cssText = 'display: flex; align-items: center; gap: 10px;';
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = sliderConfig.min;
        slider.max = sliderConfig.max;
        slider.step = sliderConfig.step;
        slider.value = sliderConfig.value;
        slider.style.cssText = 'flex: 1;';
        slider.addEventListener('input', (e) => {
            autoWaveConfig[sliderConfig.property] = parseFloat(e.target.value);
            valueDisplay.textContent = e.target.value;
            render();
        });
        const valueDisplay = document.createElement('span');
        valueDisplay.textContent = sliderConfig.value;
        valueDisplay.style.cssText = 'min-width: 40px; text-align: right; color: #666; font-size: 12px; font-family: monospace;';
        row.appendChild(slider);
        row.appendChild(valueDisplay);
        group.appendChild(row);
        controls.appendChild(group);
    });
    // Color picker for base color
    const colorGroup = document.createElement('div');
    colorGroup.style.cssText = 'margin-bottom: 15px;';
    const colorLabel = document.createElement('label');
    colorLabel.textContent = 'Base Color';
    colorLabel.style.cssText = 'display: block; margin-bottom: 5px; color: #555; font-size: 14px; font-weight: 500;';
    colorGroup.appendChild(colorLabel);
    const colorRow = document.createElement('div');
    colorRow.style.cssText = 'display: flex; gap: 10px; align-items: center;';
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = hslToHex(autoWaveConfig.baseColor);
    colorPicker.style.cssText = 'width: 40px; height: 30px; border: none; border-radius: 6px; cursor: pointer;';
    colorPicker.addEventListener('input', (e) => {
        autoWaveConfig.baseColor = e.target.value;
        colorValue.textContent = e.target.value;
        render();
    });
    const colorValue = document.createElement('span');
    colorValue.textContent = autoWaveConfig.baseColor;
    colorValue.style.cssText = 'color: #666; font-size: 12px; font-family: monospace;';
    colorRow.appendChild(colorPicker);
    colorRow.appendChild(colorValue);
    colorGroup.appendChild(colorRow);
    controls.appendChild(colorGroup);
}

// --- Corners Blobs Rendering ---
function createCornersBlobs() {
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

function createCornersControls() {
    let controls = document.getElementById('cornersControls');
    if (!controls) {
        controls = document.createElement('div');
        controls.id = 'cornersControls';
        controls.style.cssText = `
            position: fixed; 
            top: 20px; 
            right: 20px; 
            z-index: 1000; 
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            padding: 20px;
            min-width: 320px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            border: 2px solid rgba(102, 126, 234, 0.3);
            max-height: 90vh;
            overflow-y: auto;
        `;
        document.body.appendChild(controls);
    }
    controls.style.display = 'block';
    controls.innerHTML = '';
    // Title
    const title = document.createElement('h3');
    title.textContent = 'Corner Blobs';
    title.style.cssText = 'margin: 0 0 20px 0; color: #333; font-size: 18px; font-weight: 600;';
    controls.appendChild(title);
    // Steps
    addSlider(controls, 'Color Steps', 2, 12, 1, cornersConfig.steps, val => { cornersConfig.steps = parseInt(val); render(); });
    // Complexity
    addSlider(controls, 'Complexity', 0, 1, 0.01, cornersConfig.complexity, val => { cornersConfig.complexity = parseFloat(val); render(); });
    // Points
    addSlider(controls, 'Points', 3, 16, 1, cornersConfig.points, val => { cornersConfig.points = parseInt(val); render(); });
    // Size
    addSlider(controls, 'Blob Size', 100, 600, 1, cornersConfig.size, val => { cornersConfig.size = parseInt(val); render(); });
    // Corner pair
    const cornerGroup = document.createElement('div');
    cornerGroup.style.cssText = 'margin-bottom: 15px;';
    const cornerLabel = document.createElement('label');
    cornerLabel.textContent = 'Corners';
    cornerLabel.style.cssText = 'display: block; margin-bottom: 5px; color: #555; font-size: 14px; font-weight: 500;';
    cornerGroup.appendChild(cornerLabel);
    const select = document.createElement('select');
    select.style.cssText = 'width: 100%; padding: 6px; border-radius: 6px; font-size: 14px;';
    [
        { value: 'tlbr', label: 'Top Left & Bottom Right' },
        { value: 'trbl', label: 'Top Right & Bottom Left' },
    ].forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        if (cornersConfig.whichCorners === opt.value) option.selected = true;
        select.appendChild(option);
    });
    select.addEventListener('change', e => { cornersConfig.whichCorners = e.target.value; render(); });
    cornerGroup.appendChild(select);
    controls.appendChild(cornerGroup);
    // Color palette (base color picker)
    const colorGroup = document.createElement('div');
    colorGroup.style.cssText = 'margin-bottom: 15px;';
    const colorLabel = document.createElement('label');
    colorLabel.textContent = 'Base Color';
    colorLabel.style.cssText = 'display: block; margin-bottom: 5px; color: #555; font-size: 14px; font-weight: 500;';
    colorGroup.appendChild(colorLabel);
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = cornersConfig.baseColor;
    colorPicker.style.cssText = 'width: 40px; height: 30px; border: none; border-radius: 6px; cursor: pointer;';
    colorPicker.addEventListener('input', (e) => {
        cornersConfig.baseColor = e.target.value;
        // Update palette based on base color
        cornersConfig.palette = generatePalette(e.target.value, cornersConfig.steps);
        render();
    });
    colorGroup.appendChild(colorPicker);
    controls.appendChild(colorGroup);
}
function removeCornersControls() {
    let controls = document.getElementById('cornersControls');
    if (controls) controls.style.display = 'none';
}
// Helper for sliders
function addSlider(parent, label, min, max, step, value, onChange) {
    const group = document.createElement('div');
    group.style.cssText = 'margin-bottom: 15px;';
    const lbl = document.createElement('label');
    lbl.textContent = label;
    lbl.style.cssText = 'display: block; margin-bottom: 5px; color: #555; font-size: 14px; font-weight: 500;';
    group.appendChild(lbl);
    const row = document.createElement('div');
    row.style.cssText = 'display: flex; align-items: center; gap: 10px;';
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.value = value;
    slider.style.cssText = 'flex: 1;';
    slider.addEventListener('input', (e) => {
        onChange(e.target.value);
        valueDisplay.textContent = e.target.value;
    });
    const valueDisplay = document.createElement('span');
    valueDisplay.textContent = value;
    valueDisplay.style.cssText = 'min-width: 40px; text-align: right; color: #666; font-size: 12px; font-family: monospace;';
    row.appendChild(slider);
    row.appendChild(valueDisplay);
    group.appendChild(row);
    parent.appendChild(group);
}
// Helper to generate a palette from a base color
function generatePalette(baseHex, steps) {
    // Simple HSL lightness step
    const base = hexToHSL(baseHex);
    const palette = [];
    for (let i = 0; i < steps; i++) {
        const lightness = base.l + (100 - base.l) * (i / (steps - 1)) * 0.7;
        palette.push(`hsl(${base.h}, ${base.s}%, ${lightness}%)`);
    }
    return palette;
}
function hexToHSL(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
    const r = parseInt(hex.substring(0,2), 16) / 255;
    const g = parseInt(hex.substring(2,4), 16) / 255;
    const b = parseInt(hex.substring(4,6), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(h*360), s: Math.round(s*100), l: Math.round(l*100) };
}
function hslToHex(hsl) {
    // Accepts either a hex string or hsl string
    if (typeof hsl === 'string' && hsl.startsWith('#')) return hsl;
    // Not used for now, but could be implemented if needed
    return '#1976d2';
}

function updateBlob(newConfig) {
    currentBlobConfig = { ...currentBlobConfig, ...newConfig };
    createBlob(currentBlobConfig);
}

function resetToDefault() {
    currentBlobConfig = {
        pointCount: 12,
        noise: 0.3,
        smoothness: 0.8,
        radius: 120,
        fill: '#FF6B6B',
        stroke: '#00000010',
        strokeWidth: 1
    };
    createBlob(currentBlobConfig);
    
    // Update all sliders and inputs
    const sliders = document.querySelectorAll('#sliderControls input[type="range"]');
    const colorPickers = document.querySelectorAll('#sliderControls input[type="color"]');
    
    sliders[0].value = currentBlobConfig.pointCount;
    sliders[1].value = currentBlobConfig.noise;
    sliders[2].value = currentBlobConfig.smoothness;
    sliders[3].value = currentBlobConfig.radius;
    sliders[4].value = currentBlobConfig.strokeWidth;
    
    colorPickers[0].value = currentBlobConfig.fill;
    colorPickers[1].value = currentBlobConfig.stroke;
    
    // Update value displays
    const valueDisplays = document.querySelectorAll('#sliderControls span');
    valueDisplays[0].textContent = currentBlobConfig.pointCount;
    valueDisplays[1].textContent = currentBlobConfig.noise;
    valueDisplays[2].textContent = currentBlobConfig.smoothness;
    valueDisplays[3].textContent = currentBlobConfig.radius;
    valueDisplays[4].textContent = currentBlobConfig.strokeWidth;
    valueDisplays[5].textContent = currentBlobConfig.fill;
    valueDisplays[6].textContent = currentBlobConfig.stroke;
}

// changeShape();
// changeColor();
// randomShape();

// Remove the undefined function call
// randomPointInRegion();

createGeneratorSwitcher();
render();

window.addEventListener('resize', () => {
    autoWaveConfig.width = window.innerWidth;
    autoWaveConfig.height = window.innerHeight;
    render();
});

function removeWaveControls() {
    let controls = document.getElementById('waveControls');
    if (controls) controls.style.display = 'none';
}