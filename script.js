const startButtons = document.querySelectorAll("[data-ready]");
const readyOverlay = document.querySelector("#readyOverlay");
const portraits = document.querySelectorAll(".fighter-portrait img");
const views = document.querySelectorAll(".view");
const selectScreen = document.querySelector("#selectScreen");
const letterScreen = document.querySelector("#letterScreen");
const acceptedScreen = document.querySelector("#acceptedScreen");
const acceptMissionButton = document.querySelector("#acceptMissionButton");
const themeMusic = document.querySelector("#themeMusic");
const soundToggle = document.querySelector("#soundToggle");
let selectTimer;
let letterTimer;
let musicEnabled = true;
let audioUnlocked = false;

const unlockEvents = ["pointerdown", "touchstart", "touchend", "click", "keydown"];

const showView = (viewToShow) => {
  views.forEach((view) => {
    view.classList.toggle("is-active", view === viewToShow);
  });
};

const updateSoundLabel = () => {
  if (!soundToggle) {
    return;
  }

  soundToggle.textContent = musicEnabled ? "Pausar música" : "Reanudar música";
};

const removeUnlockListeners = () => {
  unlockEvents.forEach((eventName) => {
    document.removeEventListener(eventName, unlockAudio);
  });
};

const playTheme = async () => {
  if (!themeMusic || !musicEnabled) {
    return false;
  }

  themeMusic.volume = 0.42;

  try {
    await themeMusic.play();
    audioUnlocked = true;
    removeUnlockListeners();
    updateSoundLabel();
    return true;
  } catch {
    updateSoundLabel();
    return false;
  }
};

function unlockAudio() {
  if (musicEnabled && !audioUnlocked) {
    playTheme();
  }
}

portraits.forEach((portrait) => {
  if (portrait.complete && portrait.naturalWidth === 0) {
    portrait.hidden = true;
  }

  portrait.addEventListener("error", () => {
    portrait.hidden = true;
  });
});

startButtons.forEach((button) => {
  button.addEventListener("click", () => {
    unlockAudio();
    readyOverlay?.classList.add("is-visible");

    selectTimer = window.setTimeout(() => {
      readyOverlay?.classList.remove("is-visible");
      showView(selectScreen);

      letterTimer = window.setTimeout(() => {
        showView(letterScreen);
      }, 15000);
    }, 6000);
  });
});

soundToggle?.addEventListener("click", () => {
  if (!themeMusic) {
    return;
  }

  if (!musicEnabled) {
    musicEnabled = true;
    playTheme();
    return;
  }

  musicEnabled = false;
  themeMusic.pause();
  audioUnlocked = false;
  updateSoundLabel();
});

unlockEvents.forEach((eventName) => {
  document.addEventListener(eventName, unlockAudio, { passive: true });
});

acceptMissionButton?.addEventListener("click", () => {
  window.clearTimeout(selectTimer);
  window.clearTimeout(letterTimer);
  readyOverlay?.classList.remove("is-visible");
  showView(acceptedScreen);
});

playTheme();
updateSoundLabel();
