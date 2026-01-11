const countdown = document.querySelector("#countdown");

const TOTAL_SECONDS = 3 * 60 + 22;
let remainingSeconds = TOTAL_SECONDS;

const formatTime = (seconds) => {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
};

const tick = () => {
  if (!countdown) {
    return;
  }

  countdown.textContent = formatTime(remainingSeconds);
  remainingSeconds = Math.max(remainingSeconds - 1, 0);
};

tick();
setInterval(tick, 1000);
