import { randomTheme } from './generators/randomTheme';
import { changeShape } from './generators/changeShape';
import { changeColor } from './generators/changeColor';
// import { randomShape } from './generators/randomShape';
import { createBlob, createRandomBlob, createOrganicBlob, createGeometricBlob } from './utils/blob';
import { createAutoStackedWaves } from './utils/wave';
import { createLayeredBlobSVG } from './generators/randomShape';
import { generateBlobPoints } from './generators/randomShape';
import { createCornersBlobs } from './utils/corners';
import { generatePalette } from './utils/palette';

import { blobConfig, waveConfig, cornersConfig } from './config';
import './style.css'

import { hslToHex } from './utils/hex';


randomTheme();
createBlob(blobConfig);


const GENERATORS = {
    blob: 'Blob',
    wave: 'Wave',
    river: 'River',
};

let currentGenerator = 'blob';




// Main render toggle
function render() {
  if (currentGenerator === 'blob') {
    createBlob(blobConfig);
    document.getElementById('sliderControls').classList.remove('hidden');
    document.getElementById('waveControls')?.classList.add('hidden');
    document.getElementById('cornersControls')?.classList.add('hidden');
  } else if (currentGenerator === 'wave') {
    createAutoStackedWaves();
    document.getElementById('sliderControls').classList.add('hidden');
    document.getElementById('waveControls')?.classList.remove('hidden');
    document.getElementById('cornersControls')?.classList.add('hidden');
  } else if (currentGenerator === 'corners') {
    createCornersBlobs();
    document.getElementById('sliderControls').classList.add('hidden');
    document.getElementById('waveControls')?.classList.add('hidden');
    document.getElementById('cornersControls')?.classList.remove('hidden');
  }
}


document.querySelectorAll('#generatorSwitcher button').forEach((btn) => {
  btn.addEventListener('click', () => {
    currentGenerator = btn.dataset.generator;
    render();
  });
});

// Point Count
document.getElementById('pointCount')?.addEventListener('input', (e) =>
  updateBlob({ pointCount: parseInt(e.target.value) })
);

// Noise
document.getElementById('noise')?.addEventListener('input', (e) =>
  updateBlob({ noise: parseFloat(e.target.value) })
);

// Smoothness
document.getElementById('smoothness')?.addEventListener('input', (e) =>
  updateBlob({ smoothness: parseFloat(e.target.value) })
);

// Radius
document.getElementById('radius')?.addEventListener('input', (e) =>
  updateBlob({ radius: parseInt(e.target.value) })
);

// Stroke Width
document.getElementById('strokeWidth')?.addEventListener('input', (e) =>
  updateBlob({ strokeWidth: parseFloat(e.target.value) })
);

// Fill Color
document.getElementById('fillColor')?.addEventListener('input', (e) => {
  const color = hslToHex(e.target.value);
  console.log('Fill color changed to:', color);
  updateBlob({ fill: color });
});


// Stroke Color
document.getElementById('strokeColor')?.addEventListener('input', (e) =>
  updateBlob({ stroke: hslToHex(e.target.value) })
);

// Reset Button
document.getElementById('resetBlob')?.addEventListener('click', () => {
  Object.assign(blobConfig, {
    pointCount: 12,
    noise: 0.3,
    smoothness: 0.8,
    radius: 120,
    fill: '#FF6B6B',
    stroke: '#00000010',
    strokeWidth: 1
  });

  // Update UI to match reset values
  document.getElementById('pointCount').value = blobConfig.pointCount;
  document.getElementById('noise').value = blobConfig.noise;
  document.getElementById('smoothness').value = blobConfig.smoothness;
  document.getElementById('radius').value = blobConfig.radius;
  document.getElementById('strokeWidth').value = blobConfig.strokeWidth;
  document.getElementById('fillColor').value = blobConfig.fill;
  document.getElementById('strokeColor').value = blobConfig.stroke;

  createBlob(blobConfig);
});


// --- Bind Wave Controls ---
document.getElementById('waveAmount')?.addEventListener('input', (e) => {
  waveConfig.amount = parseInt(e.target.value);
  render();
});

document.getElementById('waveComplexity')?.addEventListener('input', (e) => {
  waveConfig.complexity = parseFloat(e.target.value);
  render();
});

document.getElementById('waveContrast')?.addEventListener('input', (e) => {
  waveConfig.contrast = parseFloat(e.target.value);
  render();
});

document.getElementById('waveBaseColor')?.addEventListener('input', (e) => {
  waveConfig.baseColor = hslToHex(e.target.value);
  render();
});

console.log(document.getElementById('fillColor'));


// --- Bind Corners Controls ---
document.getElementById('cornerSteps')?.addEventListener('input', (e) => {
  cornersConfig.steps = parseInt(e.target.value);
  cornersConfig.palette = generatePalette(cornersConfig.baseColor, cornersConfig.steps);
  render();
});

document.getElementById('cornerComplexity')?.addEventListener('input', (e) => {
  cornersConfig.complexity = parseFloat(e.target.value);
  render();
});

document.getElementById('cornerPoints')?.addEventListener('input', (e) => {
  cornersConfig.points = parseInt(e.target.value);
  render();
});

document.getElementById('cornerSize')?.addEventListener('input', (e) => {
  cornersConfig.size = parseInt(e.target.value);
  render();
});

document.getElementById('cornerSelect')?.addEventListener('change', (e) => {
  cornersConfig.whichCorners = e.target.value;
  render();
});

document.getElementById('cornerBaseColor')?.addEventListener('input', (e) => {
  cornersConfig.baseColor = hslToHex(e.target.value);
  cornersConfig.palette = generatePalette(cornersConfig.baseColor, cornersConfig.steps);
  render();
});


function updateBlob(newConfig) {
  Object.assign(blobConfig, newConfig);
  createBlob(blobConfig);
}
