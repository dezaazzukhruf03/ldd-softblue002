function startCountdown(targetDate) {
  const countDate = new Date(targetDate).getTime();

  const timer = setInterval(() => {
    const now = new Date().getTime();
    const gap = countDate - now;

    if (gap <= 0) {
      clearInterval(timer);
      setTimerText('days', '00');
      setTimerText('hours', '00');
      setTimerText('minutes', '00');
      setTimerText('seconds', '00');
      return;
    }

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(gap / day);
    const hours = Math.floor((gap % day) / hour);
    const minutes = Math.floor((gap % hour) / minute);
    const seconds = Math.floor((gap % minute) / second);

    setTimerText('days', days < 10 ? `0${days}` : days);
    setTimerText('hours', hours < 10 ? `0${hours}` : hours);
    setTimerText('minutes', minutes < 10 ? `0${minutes}` : minutes);
    setTimerText('seconds', seconds < 10 ? `0${seconds}` : seconds);
  }, 1000);
}

function setTimerText(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerText = value;
}

// Set tanggal acara (Format: YYYY-MM-DDTHH:MM:SS)
document.addEventListener('DOMContentLoaded', () => {
  startCountdown('2026-10-24T08:00:00');
});
