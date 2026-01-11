const countdown = document.querySelector("#countdown");
const timer = document.querySelector(".cta__timer");
const heroVideo = document.querySelector("#hero-video");
const muteToggle = document.querySelector("#mute-toggle");
const restartButton = document.querySelector("#restart-video");
const downloadButton = document.querySelector("#download-button");

const TOTAL_MS = (3 * 60 + 22) * 1000;
let remainingMs = TOTAL_MS;
let tooltipTimer = null;
let tooltip = null;

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

  if (downloadButton) {
    downloadButton.disabled = remainingMs > 0;
  }
};

tick();
setInterval(tick, 10);

const ensureTooltip = () => {
  if (!downloadButton || tooltip) {
    return;
  }

  tooltip = document.createElement("span");
  tooltip.className = "cta__tooltip";
  tooltip.setAttribute("role", "status");
  downloadButton.appendChild(tooltip);
};

const showDisabledTooltip = () => {
  if (!downloadButton || !downloadButton.disabled) {
    return;
  }

  ensureTooltip();
  if (!tooltip) {
    return;
  }

  const remainingSeconds = Math.ceil(remainingMs / 1000);
  const label = `Please wait ${remainingSeconds} seconds`;
  tooltip.textContent = label;
  tooltip.classList.add("is-visible");

  if (tooltipTimer) {
    clearTimeout(tooltipTimer);
  }

  tooltipTimer = setTimeout(() => {
    tooltip?.classList.remove("is-visible");
  }, 2000);
};

downloadButton?.addEventListener("click", (event) => {
  if (downloadButton.disabled) {
    event.preventDefault();
    showDisabledTooltip();
  }
});

if (heroVideo && muteToggle) {
  const attemptAutoplay = () => {
    heroVideo.muted = true;
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

  heroVideo.addEventListener("click", () => {
    heroVideo.muted = false;
    heroVideo.play();
  });
}

restartButton?.addEventListener("click", () => {
  if (!heroVideo) {
    return;
  }

  heroVideo.currentTime = 0;
  heroVideo.muted = false;
  heroVideo.play();
});
