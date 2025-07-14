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
    radius: 300,
    fill: '#2596be',
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
    scaleStep: 0.32, // this controls how much each layer scales

};

export const scatterConfig = {
  count: 15,
  minRadius: 40,
  maxRadius: 100,

  randomize() {
    this.count = Math.floor(Math.random() * 15) + 10; // 10–24
    this.minRadius = Math.floor(Math.random() * 20) + 20; // 20–39
    this.maxRadius = this.minRadius + Math.floor(Math.random() * 60) + 40; // min+40 to min+99

    // Update UI sliders if needed
    document.getElementById('scatterCount').value = this.count;
    document.getElementById('scatterMinRadius').value = this.minRadius;
    document.getElementById('scatterMaxRadius').value = this.maxRadius;
  }
};
