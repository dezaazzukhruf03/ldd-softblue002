// ==========================================================
// JS / PRELOADER.JS - LOGIKA PRELOADER
// ==========================================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        if (preloader) {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }
    }, 800);
});
