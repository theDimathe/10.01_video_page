const countdown = document.querySelector("#countdown");

const TOTAL_MS = (3 * 60 + 22) * 1000;
let remainingMs = TOTAL_MS;

const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  const centiseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
  return `${minutes}:${seconds}:${centiseconds}`;
};

const tick = () => {
  if (!countdown) {
    return;
  }

  countdown.textContent = formatTime(remainingMs);
  remainingMs = Math.max(remainingMs - 10, 0);
};

tick();
setInterval(tick, 10);
