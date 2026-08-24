// ==========================================================
// JS / SCRIPT.JS - LOGIKA UTAMA (BUKA UNDANGAN, SALIN REKENING)
// ==========================================================

// ==========================================================
// PENGATURAN AUTO-SCROLL KE GIFT -- SEMUA DIATUR DI SINI SAJA
// ==========================================================
// 1) Jeda diam di Beranda SEBELUM auto-scroll mulai berjalan (ms).
//    Ini BUKAN kecepatan scroll -- ini cuma "berapa lama diam dulu".
const AUTO_SCROLL_START_DELAY_MS = 1000;

// 2) Kecepatan scroll SETELAH mulai berjalan (px per detik).
//    Dihitung konstan: makin panjang jarak Beranda->Gift, makin lama
//    durasinya, tapi kecepatan visualnya selalu terasa sama.
//    Angka lebih besar = scroll lebih CEPAT. Lebih kecil = lebih PELAN.
const AUTO_SCROLL_SPEED_PX_PER_SEC = 1;

// 3) Batas durasi scroll (ms), jaga-jaga supaya tidak kelewat instan
//    atau kelewat lama walau jaraknya sangat pendek/panjang.
const AUTO_SCROLL_MIN_DURATION = 2500;
const AUTO_SCROLL_MAX_DURATION = 120000;

// Kunci scroll wrapper sebelum tombol buka undangan diklik
document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.getElementById('scrollArea');
  if (wrapper) wrapper.style.overflowY = 'hidden';
});

let fadeUpInitialized = false;

// Fungsi Buka Undangan (dipanggil dari onclick tombol "Buka Undangan")
function openInvitation() {
  const cover = document.getElementById('cover');
  const wrapper = document.getElementById('scrollArea');

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
  // dan berhenti di section Wedding Gift (lihat blok pengaturan di atas)
  setTimeout(() => {
    autoScrollToGift();
  }, AUTO_SCROLL_START_DELAY_MS);
}

// ==========================================================
// SCROLL KUSTOM: satu mesin scroll yang dipakai bersama untuk
// auto-scroll ke Gift maupun klik navigasi pil. Bisa dibatalkan
// (interruptible) supaya begitu layar disentuh saat sedang auto-scroll,
// scroll langsung berhenti -- tidak "melawan" sentuhan user.
// ==========================================================
let activeScrollSession = null;

function cancelActiveScroll() {
  if (activeScrollSession) {
    activeScrollSession.cancelled = true;
    activeScrollSession = null;
  }
}

function smoothScrollTo(targetY, duration, options = {}) {
  const { interruptible = false } = options;
  const wrapper = document.getElementById('scrollArea');
  if (!wrapper) return;

  // Batalkan sesi scroll kustom sebelumnya (kalau ada) sebelum mulai yang baru
  cancelActiveScroll();

  const session = interruptible ? { cancelled: false } : null;
  if (interruptible) activeScrollSession = session;

  const startY = wrapper.scrollTop;
  const distance = targetY - startY;
  let startTime = null;

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function scrollStep(timestamp) {
    if (session && session.cancelled) return;

    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);

    wrapper.scrollTop = startY + distance * easeInOutQuad(progress);

    if (progress < 1) {
      requestAnimationFrame(scrollStep);
    } else if (interruptible && activeScrollSession === session) {
      activeScrollSession = null;
    }
  }

  requestAnimationFrame(scrollStep);
}

// Begitu ada sentuhan/scroll/klik manual dari user di dalam area konten,
// batalkan auto-scroll yang sedang berjalan (kalau ada).
document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.getElementById('scrollArea');
  if (!wrapper) return;

  ['touchstart', 'wheel', 'pointerdown'].forEach((evt) => {
    wrapper.addEventListener(evt, () => {
      if (activeScrollSession) cancelActiveScroll();
    }, { passive: true });
  });
});

function autoScrollToGift() {
  const wrapper = document.getElementById('scrollArea');
  const giftSection = document.getElementById('gift');
  if (!wrapper || !giftSection) return;

  const targetY = giftSection.offsetTop - 20;
  const distance = Math.abs(targetY - wrapper.scrollTop);

  let duration = (distance / AUTO_SCROLL_SPEED_PX_PER_SEC) * 1000;
  duration = Math.min(Math.max(duration, AUTO_SCROLL_MIN_DURATION), AUTO_SCROLL_MAX_DURATION);

  smoothScrollTo(targetY, duration, { interruptible: true });
}

// ==========================================================
// NAVIGASI PIL: klik tombol di nav-cluster discroll secara manual
// (bukan lompat-anchor bawaan browser), dihitung dari offsetTop --
// tidak terpengaruh transform fade-up section yang belum pernah
// terlihat, jadi tidak akan meleset ke section lain.
// ==========================================================
const NAV_SCROLL_SPEED_PX_PER_SEC = 900;
const NAV_SCROLL_MIN_DURATION = 350;
const NAV_SCROLL_MAX_DURATION = 1400;

document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.getElementById('scrollArea');
  const navLinks = document.querySelectorAll('.side-nav .nav-item[href^="#"]');
  if (!wrapper || !navLinks.length) return;

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').slice(1);
      const targetSection = document.getElementById(targetId);
      if (!targetSection) return;

      e.preventDefault();

      const targetY = targetSection.offsetTop;
      const distance = Math.abs(targetY - wrapper.scrollTop);

      let duration = (distance / NAV_SCROLL_SPEED_PX_PER_SEC) * 1000;
      duration = Math.min(Math.max(duration, NAV_SCROLL_MIN_DURATION), NAV_SCROLL_MAX_DURATION);

      smoothScrollTo(targetY, duration, { interruptible: true });
    });
  });
});

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

  const wrapper = document.getElementById('scrollArea');
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
  const wrapper = document.getElementById('scrollArea');
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