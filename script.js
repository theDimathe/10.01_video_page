const countdown = document.querySelector("#countdown");
const timer = document.querySelector(".cta__timer");
const heroVideo = document.querySelector("#hero-video");
const muteToggle = document.querySelector("#mute-toggle");
const restartButton = document.querySelector("#restart-video");
const downloadButton = document.querySelector("#download-button");
const playOverlay = document.querySelector("#play-overlay");
const ageModal = document.querySelector("#age-modal");
const ageConfirmButton = document.querySelector("#age-confirm");
const buttonLabel = downloadButton?.querySelector(".cta__button-label");

const TOTAL_MS = 69.7 * 1000;
let remainingMs = TOTAL_MS;
let tooltipTimer = null;
let tooltip = null;
let isModalOpen = Boolean(ageModal);
let countdownTimerId = null;
let countdownStarted = false;

const updateMuteIcon = () => {
  if (!heroVideo || !muteToggle) {
    return;
  }

  muteToggle.textContent = heroVideo.muted ? "🔇" : "🔊";
  muteToggle.setAttribute(
    "aria-label",
    heroVideo.muted ? "Включить звук" : "Выключить звук",
  );
};

const unmuteHeroVideo = () => {
  if (!heroVideo) {
    return;
  }

  heroVideo.muted = false;
  updateMuteIcon();
};

const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  const centiseconds = String(Math.floor((ms % 1000) / 10)).padStart(2, "0");
  return `${minutes}:${seconds}:${centiseconds}`;
};

const formatShortTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const tick = () => {
  if (!countdown) {
    return;
  }

  countdown.textContent = formatTime(remainingMs);
  remainingMs = Math.max(remainingMs - 10, 0);

  if (downloadButton) {
    const isDisabled = remainingMs > 0;
    downloadButton.disabled = isDisabled;
    downloadButton.classList.toggle("is-ready", !isDisabled);
    if (buttonLabel) {
      buttonLabel.textContent = isDisabled
        ? `Download in ${formatShortTime(remainingMs)}`
        : "Download now";
    }
  }
};

const startCountdown = () => {
  if (countdownStarted) {
    return;
  }

  countdownStarted = true;
  tick();
  countdownTimerId = setInterval(tick, 10);
};

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
    unmuteHeroVideo();
  }
});

if (heroVideo && muteToggle) {
  const setPlayOverlayVisible = (visible) => {
    if (!playOverlay) {
      return;
    }

    playOverlay.classList.toggle("is-hidden", !visible);
    playOverlay.setAttribute("aria-hidden", String(!visible));
  };

  const attemptPlayback = () => {
    unmuteHeroVideo();
    const playPromise = heroVideo.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise
        .then(() => {
          setPlayOverlayVisible(false);
        })
        .catch(() => {
          setPlayOverlayVisible(true);
        });
      return;
    }

    if (heroVideo.paused) {
      setPlayOverlayVisible(true);
    } else {
      setPlayOverlayVisible(false);
    }
  };

  const startPlayback = () => {
    isModalOpen = false;
    ageModal?.classList.add("is-hidden");
    if (heroVideo.readyState >= 3) {
      attemptPlayback();
    } else {
      heroVideo.addEventListener("canplay", attemptPlayback, { once: true });
    }
  };

  updateMuteIcon();

  muteToggle.addEventListener("click", () => {
    heroVideo.muted = !heroVideo.muted;
    updateMuteIcon();
  });

  heroVideo.addEventListener("loadedmetadata", () => {
    heroVideo.currentTime = 0;
    heroVideo.pause();
  });

  heroVideo.addEventListener("click", () => {
    if (isModalOpen) {
      return;
    }
    unmuteHeroVideo();
    heroVideo.play();
  });

  heroVideo.addEventListener("play", () => {
    setPlayOverlayVisible(false);
    startCountdown();
  });

  if (playOverlay) {
    playOverlay.addEventListener("click", () => {
      if (isModalOpen) {
        return;
      }
      unmuteHeroVideo();
      const playPromise = heroVideo.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          setPlayOverlayVisible(true);
        });
      }
    });
  }

  const handleFirstInteraction = () => {
    if (isModalOpen) {
      return;
    }
    unmuteHeroVideo();
    const playPromise = heroVideo.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        setPlayOverlayVisible(true);
      });
    }
  };

  document.addEventListener("click", handleFirstInteraction, {
    capture: true,
    once: true,
  });

  if (ageModal) {
    const closeTriggers = ageModal.querySelectorAll("[data-modal-close]");
    closeTriggers.forEach((trigger) => {
      trigger.addEventListener("click", startPlayback);
    });
  }

  ageConfirmButton?.addEventListener("click", startPlayback);
}

restartButton?.addEventListener("click", () => {
  if (!heroVideo) {
    return;
  }

  heroVideo.currentTime = 0;
  unmuteHeroVideo();
  heroVideo.play();
});
