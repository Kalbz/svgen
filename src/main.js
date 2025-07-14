import { randomTheme } from './generators/randomTheme';
import { changeShape } from './generators/changeShape';
import { changeColor } from './generators/changeColor';
// import { randomShape } from './generators/randomShape';
import { createBlob } from './utils/blob';
import { createAutoStackedWaves } from './utils/wave';
import { createLayeredBlobSVG } from './generators/randomShape';
import { generateBlobPoints } from './generators/randomShape';
import { createCornersBlobs } from './utils/corners';
import { generatePalette } from './utils/palette';

import { blobConfig, waveConfig, cornersConfig, scatterConfig} from './config';
import './style.css'

import { hslToHex } from './utils/hex';

import { createScatterEffect } from './utils/scatter'

import Pickr from '@simonwep/pickr';

import '@simonwep/pickr/dist/themes/classic.min.css'; // Or another theme



const pickr = Pickr.create({
  el: '#fillColorPicker',
  theme: 'classic',
  default: '#2596be',
  comparison: false, // 👈 this is the key!
  components: {
    preview: true,
    opacity: true,
    hue: true,
    interaction: {
      hex: true,
      rgba: true,
      input: true,
      save: true
    }
  }
});


pickr.on('change', (color) => {
  const hex = color.toHEXA().toString();

  // Update the blob fill immediately
  updateBlob({ fill: hex });

  // ✅ No need for applyColor, swatch updates automatically now!
});


// Wave Color
const wavePickr = Pickr.create({
  el: '#waveColorPicker',
  theme: 'classic',
  default: '#2596be',
  comparison: false,
  components: {
    preview: true,
    opacity: true,
    hue: true,
    interaction: {
      hex: true,
      rgba: true,
      input: true
    }
  }
});

wavePickr.on('change', (color) => {
  waveConfig.baseColor = color.toHEXA().toString();
  render();
});

// Corner Base Color
const cornerPickr = Pickr.create({
  el: '#cornerColorPicker',
  theme: 'classic',
  default: '#2596be',
  comparison: false,
  components: {
    preview: true,
    opacity: true,
    hue: true,
    interaction: {
      hex: true,
      rgba: true,
      input: true
    }
  }
});

cornerPickr.on('change', (color) => {
  cornersConfig.baseColor = color.toHEXA().toString();
  cornersConfig.palette = generatePalette(cornersConfig.baseColor, cornersConfig.steps);
  render();
});

randomTheme();
createBlob(blobConfig);

let currentGenerator = 'blob';

render();

const svg = document.getElementById('svgContainer');
svg.setAttribute('viewBox', '0 0 1500 1002');
svg.setAttribute('width', '100%');
svg.setAttribute('height', '100%');


function clearSVGContent() {
  const svg = document.getElementById('svgContainer');

  ['#mainBlob', '#cornerBlobs', '#waves'].forEach((id) => {
    svg.querySelector(id)?.remove();
  });

  // Remove all scattered blobs
  svg.querySelectorAll('.scatterBlob').forEach(el => el.remove());
}


document.getElementById('downloadSVG')?.addEventListener('click', () => {
  const svg = document.getElementById('svgContainer');
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);

  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'corner-blobs.svg';
  a.click();

  URL.revokeObjectURL(url);
});



function render() {
  clearSVGContent();

  if (currentGenerator === 'blob') {
    createBlob(blobConfig);
    document.getElementById('sliderControls').classList.remove('hidden');
    document.getElementById('waveControls')?.classList.add('hidden');
    document.getElementById('cornersControls')?.classList.add('hidden');
    document.getElementById('scatterControls')?.classList.add('hidden');
  } else if (currentGenerator === 'wave') {
    createAutoStackedWaves();
    document.getElementById('sliderControls')?.classList.add('hidden');
    document.getElementById('waveControls')?.classList.remove('hidden');
    document.getElementById('cornersControls')?.classList.add('hidden');
    document.getElementById('scatterControls')?.classList.add('hidden');
  } else if (currentGenerator === 'corners') {
    createCornersBlobs();
    document.getElementById('sliderControls')?.classList.add('hidden');
    document.getElementById('waveControls')?.classList.add('hidden');
    document.getElementById('cornersControls')?.classList.remove('hidden');
    document.getElementById('scatterControls')?.classList.add('hidden');
  } else if (currentGenerator === 'scatter') {
    createScatterEffect();
    document.getElementById('sliderControls').classList.add('hidden');
    document.getElementById('waveControls')?.classList.add('hidden');
    document.getElementById('cornersControls')?.classList.add('hidden');
    document.getElementById('scatterControls')?.classList.remove('hidden');
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
  updateBlob({ fill: color });
});


// Stroke Color
document.getElementById('strokeColor')?.addEventListener('input', (e) =>
  updateBlob({ stroke: hslToHex(e.target.value) })
);

// Color Step
document.getElementById('blobLayeredToggle')?.addEventListener('change', (e) => {
  blobConfig.layered = e.target.checked;
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



// --- Bind Scatter Controls ---
document.getElementById('scatterCount')?.addEventListener('input', (e) => {
  scatterConfig.count = parseInt(e.target.value);
  render();
});

document.getElementById('scatterMinRadius')?.addEventListener('input', (e) => {
  scatterConfig.minRadius = parseInt(e.target.value);
  render();
});

document.getElementById('scatterMaxRadius')?.addEventListener('input', (e) => {
  scatterConfig.maxRadius = parseInt(e.target.value);
  render();
});

document.getElementById('scatterRandomize')?.addEventListener('click', () => {
  scatterConfig.randomize();
  render();
});




function updateBlob(newConfig) {
  Object.assign(blobConfig, newConfig);
  createBlob(blobConfig);
}
