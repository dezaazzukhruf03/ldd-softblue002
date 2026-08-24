// ==========================================================
// JS / LIGHTBOX.JS - LIGHTBOX GALERI (GESER KIRI/KANAN)
// ==========================================================
(function () {

  // Urutan gambar HARUS sama dengan urutan .gallery-item di index.html
  const images = [
    'assets/images/galleryB1.png',
    'assets/images/galleryB2.png',
    'assets/images/galleryB3.png',
    'assets/images/coverB.png'
  ];

  let currentIndex = 0;

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCounter = document.getElementById('lightboxCounter');

  function updateLightboxImage() {
    if (!lightboxImage) return;
    lightboxImage.src = images[currentIndex];
    lightboxImage.alt = `Galeri ${currentIndex + 1}`;
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentIndex + 1} / ${images.length}`;
    }
  }

  // Fungsi global dipanggil dari onclick di index.html
  window.openLightbox = function (index) {
    currentIndex = index;
    updateLightboxImage();
    if (lightbox) lightbox.classList.add('active');
  };

  window.closeLightbox = function () {
    if (lightbox) lightbox.classList.remove('active');
  };

  window.lightboxPrev = function () {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightboxImage();
  };

  window.lightboxNext = function () {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightboxImage();
  };

  if (lightbox) {
    // Klik area gelap di luar gambar untuk menutup
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) window.closeLightbox();
    });

    // GESER KIRI/KANAN (swipe) di layar sentuh
    let touchStartX = 0;
    let touchEndX = 0;
    const SWIPE_THRESHOLD = 40;

    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchEndX - touchStartX;
      if (diff > SWIPE_THRESHOLD) {
        window.lightboxPrev();
      } else if (diff < -SWIPE_THRESHOLD) {
        window.lightboxNext();
      }
    }, { passive: true });
  }

  // Navigasi panah kiri/kanan & Escape untuk laptop
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') window.lightboxPrev();
    else if (e.key === 'ArrowRight') window.lightboxNext();
    else if (e.key === 'Escape') window.closeLightbox();
  });

})();