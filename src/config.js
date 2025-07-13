export const waveConfig = {
  amount: 5,
  complexity: 0.7,
  contrast: 0.5,
  baseColor: '#1976d2',
  width: window.innerWidth,
  height: window.innerHeight,
};

export const blobConfig = {
    pointCount: 12,
    noise: 0.3,
    smoothness: 0.8,
    radius: 120,
    fill: '#FF6B6B',
    stroke: '00000010',
    strokeWidth: 1
};

export const cornersConfig = {
    steps: 6,
    baseColor: '#FF2222',
    palette: ['#FF2222', '#FF6B6B', '#FFD93D', '#FFB347', '#FF7F50', '#FF3B94'],
    complexity: 0.3,
    points: 8,
    randomness: 0.3,
    whichCorners: 'tlbr', // 'tlbr' or 'trbl'
    size: 250,
    scaleStep: 0.12, // this controls how much each layer scales

};