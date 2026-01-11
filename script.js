const countdown = document.querySelector("#countdown");
const timer = document.querySelector(".cta__timer");
const heroVideo = document.querySelector("#hero-video");
const muteToggle = document.querySelector("#mute-toggle");
const restartButton = document.querySelector("#restart-video");
const downloadButton = document.querySelector("#download-button");

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
  const attemptAutoplay = () => {
    const playPromise = heroVideo.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  };

  heroVideo.addEventListener("canplay", attemptAutoplay);
  if (heroVideo.readyState >= 3) {
    attemptAutoplay();
  }

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

  if (downloadButton) {
    const activationTime = 70;
    let isActivated = false;

    downloadButton.disabled = true;
    downloadButton.classList.add("is-disabled");
    downloadButton.setAttribute("aria-disabled", "true");

    heroVideo.addEventListener("timeupdate", () => {
      if (isActivated || heroVideo.currentTime < activationTime) {
        return;
      }

      isActivated = true;
      downloadButton.disabled = false;
      downloadButton.classList.remove("is-disabled");
      downloadButton.setAttribute("aria-disabled", "false");

      if (timer) {
        setTimeout(() => {
          timer.classList.add("cta__timer--visible");
        }, 1000);
      }
    });
  }
}

restartButton?.addEventListener("click", () => {
  if (!heroVideo) {
    return;
  }

  heroVideo.currentTime = 0;
  heroVideo.play();
});
