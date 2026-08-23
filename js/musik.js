// ==========================================================
// JS / MUSIK.JS - KONTROL MUSIK LATAR
// ==========================================================
const audio = document.getElementById('bgMusic');
const musicBtn = document.getElementById('audioBtn');
let isPlaying = false;

function toggleMusic() {
  if (!audio) return;

  if (isPlaying) {
    audio.pause();
    if (musicBtn) musicBtn.classList.remove('playing');
  } else {
    audio.play().then(() => {
      if (musicBtn) musicBtn.classList.add('playing');
    }).catch(err => {
      console.log("Autoplay diblokir browser:", err);
    });
  }
  isPlaying = !isPlaying;
}

if (musicBtn) {
  musicBtn.addEventListener('click', toggleMusic);
}
