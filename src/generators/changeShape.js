export function changeShape() {
  document.getElementById('changeShape').addEventListener('click', async () => {
    const svgContainer = document.getElementById('svgContainer');

    try {
      const response = await fetch('/shapes/1.svg');
      const svgText = await response.text();
      svgContainer.innerHTML = svgText;
      console.log('Shape changed to inlined SVG');
    } catch (err) {
      console.error('Failed to load SVG:', err);
    }
  });
}
