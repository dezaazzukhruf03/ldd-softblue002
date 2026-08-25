// ==========================================================
// JS / GUEST.JS - PARAMETER ?to= UNTUK NAMA TAMU KUSTOM
// ==========================================================
// Cara pakai: tambahkan ?to=NamaTamu di URL undangan, contoh:
//   https://domainanda.com/?to=Budi+Santoso
//   https://domainanda.com/?to=Keluarga%20Besar%20Bapak%20Anton
// Spasi bisa pakai '+' atau '%20', keduanya otomatis dikenali.
// Kalau parameter tidak ada / kosong, box nama tamu tetap
// tersembunyi seperti biasa (tidak mengubah tampilan cover).
(function () {

  const params = new URLSearchParams(window.location.search);
  const rawName = params.get('to');

  if (!rawName) return;

  const guestName = rawName.trim();
  if (!guestName) return;

  const guestNameEl = document.getElementById('guestName');
  const guestBoxEl = document.querySelector('.guest-box');

  // textContent aman dari injeksi HTML, tidak perlu escape manual
  if (guestNameEl) guestNameEl.textContent = guestName;

  if (guestBoxEl) {
    guestBoxEl.classList.add('show');
  }

  // Opsional: judul tab browser ikut menyesuaikan nama tamu
  document.title = `Undangan Pernikahan untuk ${guestName}`;

})();