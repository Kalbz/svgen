export function changeShape() {
    document.getElementById('changeShape').addEventListener('click', () => {
                const svgContainer = document.getElementById('svgContainer');
                svgContainer.innerHTML = `
          <svg 
            width="500"
            height="500"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="80" height="80" stroke="black" stroke-width="3" fill="blue" />
          </svg>
        `;
        console.log('Shape changed to rectangle');
      });
}
