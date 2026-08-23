// ==========================================================
// JS / SCRIPT.JS - LOGIKA UTAMA (BUKA UNDANGAN, SALIN REKENING)
// ==========================================================

// Kunci scroll wrapper sebelum tombol buka undangan diklik
document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.getElementById('appWrapper');
  if (wrapper) wrapper.style.overflowY = 'hidden';
});

let fadeUpInitialized = false;

// Fungsi Buka Undangan (dipanggil dari onclick tombol "Buka Undangan")
function openInvitation() {
  const cover = document.getElementById('cover');
  const wrapper = document.getElementById('appWrapper');

  if (cover) {
    cover.classList.add('open');
  }

  // Buka kembali akses scroll di dalam wrapper
  if (wrapper) wrapper.style.overflowY = 'auto';

  // Putar musik jika fungsi tersedia
  if (typeof toggleMusic === 'function' && !isPlaying) {
    toggleMusic();
  }

  // Refresh pustaka animasi AOS jika digunakan
  if (typeof AOS !== 'undefined') {
    AOS.refresh();
  }

  // Aktifkan animasi fade-up untuk tiap section begitu undangan dibuka,
  // supaya section Beranda pun ikut fade saat pertama kali terlihat
  initFadeUpAnimations();

  // Auto-scroll perlahan: dari Beranda, melewati semua section,
  // dan berhenti di section Wedding Gift
  setTimeout(() => {
    autoScrollToGift();
  }, 900);
}

// Scroll halus kustom dengan easing, agar terasa "perlahan" melewati
// setiap section alih-alih lompat langsung ke tujuan
function smoothScrollTo(targetY, duration) {
  const wrapper = document.getElementById('appWrapper');
  if (!wrapper) return;

  const startY = wrapper.scrollTop;
  const distance = targetY - startY;
  let startTime = null;

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function scrollStep(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);

    wrapper.scrollTop = startY + distance * easeInOutQuad(progress);

    if (progress < 1) {
      requestAnimationFrame(scrollStep);
    }
  }

  requestAnimationFrame(scrollStep);
}

// Kecepatan scroll konstan (px per detik). Durasi dihitung dari jarak
// tempuh dibagi kecepatan ini, jadi kecepatan visualnya selalu terasa
// sama pelan berapa pun panjang halaman -- bukan durasi tetap seperti
// sebelumnya yang bikin halaman panjang terasa "meloncat cepat".
const AUTO_SCROLL_SPEED_PX_PER_SEC = 160;
const AUTO_SCROLL_MIN_DURATION = 2500;   // ms, batas bawah agar tidak terlalu instan
const AUTO_SCROLL_MAX_DURATION = 12000;  // ms, batas atas agar tidak kelamaan

function autoScrollToGift() {
  const wrapper = document.getElementById('appWrapper');
  const giftSection = document.getElementById('gift');
  if (!wrapper || !giftSection) return;

  const targetY = giftSection.offsetTop - 20;
  const distance = Math.abs(targetY - wrapper.scrollTop);

  let duration = (distance / AUTO_SCROLL_SPEED_PX_PER_SEC) * 1000;
  duration = Math.min(Math.max(duration, AUTO_SCROLL_MIN_DURATION), AUTO_SCROLL_MAX_DURATION);

  smoothScrollTo(targetY, duration);
}

// Fungsi Salin Rekening
function copyToClipboard(elementId) {
  const text = document.getElementById(elementId)?.innerText;
  if (!text) return;

  navigator.clipboard.writeText(text).then(() => {
    showToast('Nomor rekening berhasil disalin!');
  }).catch(err => {
    console.error('Gagal menyalin data: ', err);
    showToast('Gagal menyalin nomor rekening.');
  });
}

// Tampilkan toast notifikasi singkat
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// ==========================================================
// FADE UP: setiap section (kecuali cover) fade + geser naik saat
// pertama kali tampil di layar. Diinisialisasi saat undangan dibuka
// supaya Beranda juga sempat memutar animasinya.
// ==========================================================
function initFadeUpAnimations() {
  if (fadeUpInitialized) return;
  fadeUpInitialized = true;

  const wrapper = document.getElementById('appWrapper');
  const fadeSections = document.querySelectorAll('main section[id]');
  if (!wrapper || !fadeSections.length) return;

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { root: wrapper, threshold: 0.15 });

  fadeSections.forEach((section) => fadeObserver.observe(section));
}

// ==========================================================
// SCROLL-SPY: highlight menu navigasi (jadi bentuk pil) sesuai
// section yang sedang dilihat, berlaku di semua section
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.getElementById('appWrapper');
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.side-nav .nav-item[href]');

  if (!wrapper || !sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { root: wrapper, threshold: 0.35 });

  sections.forEach((section) => observer.observe(section));
});