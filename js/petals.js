function createPetal() {
  const petalContainer = document.getElementById('petals-container');
  if (!petalContainer) return;

  const petal = document.createElement('span');
  petal.classList.add('petal');

  const size = Math.random() * 12 + 8 + 'px';
  petal.style.width = size;
  petal.style.height = size;
  petal.style.left = Math.random() * 100 + '%';
  petal.style.animationDuration = Math.random() * 3 + 5 + 's';
  petal.style.opacity = Math.random() * 0.7 + 0.3;

  petalContainer.appendChild(petal);

  setTimeout(() => {
    petal.remove();
  }, 8000);
}

// Buat kelopak bunga baru setiap 400ms
document.addEventListener('DOMContentLoaded', () => {
  setInterval(createPetal, 400);
});
