const countdown = document.querySelector("#countdown");
const heroVideo = document.querySelector("#hero-video");
const muteToggle = document.querySelector("#mute-toggle");
const restartButton = document.querySelector("#restart-video");

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

if (heroVideo && muteToggle) {
  const updateMuteIcon = () => {
    muteToggle.textContent = heroVideo.muted ? "🔇" : "🔊";
    muteToggle.setAttribute(
      "aria-label",
      heroVideo.muted ? "Включить звук" : "Выключить звук",
    );
  };

  updateMuteIcon();

  muteToggle.addEventListener("click", () => {
    heroVideo.muted = !heroVideo.muted;
    updateMuteIcon();
  });
}

restartButton?.addEventListener("click", () => {
  if (!heroVideo) {
    return;
  }

  heroVideo.currentTime = 0;
  heroVideo.play();
});
