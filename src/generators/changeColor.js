export function changeColor() {
  document.getElementById('changeColor').addEventListener('click', async () => {
    const svgContainer = document.getElementById('svgContainer');

    try {
      const response = await fetch('/shapes/1.svg');
      const svgText = await response.text();

      svgContainer.innerHTML = svgText; // Inject the raw SVG
      console.log('SVG injected');

      // Wait for next animation frame to ensure it's in the DOM
      requestAnimationFrame(() => {
        const svgElement = svgContainer.querySelector('svg');
        if (svgElement) {
          // Example: change all fills to green
          const shapes = svgElement.querySelectorAll('[fill]');
          shapes.forEach(el => {
            el.setAttribute('fill', 'green');
          });

          console.log('Color changed to green');
        }
      });

    } catch (err) {
      console.error('Failed to load SVG:', err);
    }
  });
}

