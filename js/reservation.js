// ==========================================================
// JS / RESERVATION.JS - RSVP & UCAPAN (GOOGLE SHEETS)
// ==========================================================
// File ini terpisah dari script.js agar mudah diganti/disesuaikan
// dengan Google Apps Script Web App yang terhubung ke Spreadsheet
// multi-sheet milik Anda.
//
// CARA PAKAI:
// 1. Buat Google Spreadsheet dengan sheet, misalnya "Ucapan"
//    berkolom: Waktu | Nama | Kehadiran | Pesan
// 2. Buka Extensions > Apps Script di spreadsheet tsb, lalu buat
//    fungsi doGet(e) dan doPost(e) yang membaca/menulis ke sheet
//    "Ucapan" (bisa pakai sheet lain untuk data lain, misal "Tamu").
// 3. Deploy sebagai Web App (akses: "Anyone"), lalu salin URL
//    hasil deploy dan tempel ke RESERVATION_API_URL di bawah ini.

const RESERVATION_API_URL = 'GANTI_DENGAN_URL_WEB_APP_GOOGLE_APPS_SCRIPT';

const rsvpForm = document.getElementById('rsvpForm');
const commentsList = document.getElementById('commentsList');

// Ambil nama tamu dari parameter URL, contoh: index.html?to=Budi+Santoso
function getGuestNameFromURL() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get('to');
  return name ? decodeURIComponent(name.replace(/\+/g, ' ')) : null;
}

document.addEventListener('DOMContentLoaded', () => {
  // Guest box (Kepada Yth...) default disembunyikan lewat CSS,
  // hanya dimunculkan jika ada parameter ?to=NamaTamu di URL.
  const guestName = getGuestNameFromURL();
  const guestBoxEl = document.querySelector('.guest-box');

  if (guestName) {
    const guestNameEl = document.getElementById('guestName');
    const namaInput = document.getElementById('nama');
    if (guestNameEl) guestNameEl.textContent = guestName;
    if (namaInput) namaInput.value = guestName;
    if (guestBoxEl) guestBoxEl.style.display = 'block';
  }

  loadComments();
});

// Kirim RSVP + ucapan ke Google Sheets
if (rsvpForm) {
  rsvpForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (RESERVATION_API_URL.includes('GANTI_DENGAN_URL')) {
      showToast('URL Google Sheets belum diatur di reservation.js');
      return;
    }

    const nama = document.getElementById('nama').value.trim();
    const kehadiran = document.getElementById('kehadiran').value;
    const pesan = document.getElementById('pesan').value.trim();

    if (!nama || !kehadiran || !pesan) return;

    const submitBtn = rsvpForm.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';

    try {
      const response = await fetch(RESERVATION_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // hindari preflight CORS di Apps Script
        body: JSON.stringify({
          sheet: 'Ucapan',
          nama,
          kehadiran,
          pesan
        })
      });

      const result = await response.json();

      if (result && result.status === 'success') {
        showToast('Terima kasih atas konfirmasi & ucapannya!');
        rsvpForm.reset();
        addCommentToList({ nama, kehadiran, pesan }, true);
      } else {
        showToast('Gagal mengirim, silakan coba lagi.');
      }
    } catch (err) {
      console.error('Gagal mengirim RSVP:', err);
      showToast('Gagal mengirim, periksa koneksi Anda.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

// Ambil daftar ucapan dari sheet "Ucapan" di Google Sheets
async function loadComments() {
  if (!commentsList) return;
  if (RESERVATION_API_URL.includes('GANTI_DENGAN_URL')) return;

  try {
    const response = await fetch(`${RESERVATION_API_URL}?sheet=Ucapan`);
    const data = await response.json();

    if (Array.isArray(data)) {
      commentsList.innerHTML = '';
      data.slice().reverse().forEach(item => addCommentToList(item, false));
    }
  } catch (err) {
    console.error('Gagal memuat ucapan:', err);
  }
}

// Tambahkan satu kartu ucapan ke tampilan
function addCommentToList(item, prepend) {
  if (!commentsList) return;

  const div = document.createElement('div');
  div.classList.add('comment-item');

  let statusClass = 'tidak-hadir';
  if (item.kehadiran === 'Hadir') statusClass = 'hadir';
  else if (item.kehadiran === 'Masih Ragu') statusClass = 'ragu';

  div.innerHTML = `
    <div class="comment-header">
      <span class="comment-author">${escapeHTML(item.nama)}</span>
      <span class="comment-badge ${statusClass}">${escapeHTML(item.kehadiran)}</span>
    </div>
    <div class="comment-text">${escapeHTML(item.pesan)}</div>
  `;

  if (prepend) {
    commentsList.prepend(div);
  } else {
    commentsList.appendChild(div);
  }
}

// Cegah XSS sederhana saat menampilkan data dari spreadsheet
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}
