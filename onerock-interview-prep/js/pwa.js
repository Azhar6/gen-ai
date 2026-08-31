function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.navigator.standalone === true
  );
}

function setupPWAInstall({ topButton, sideButton }) {
  let deferredPrompt = null;

  function setVisible(visible) {
    const show = visible && !isStandalone();
    topButton.hidden = !show;
    sideButton.hidden = !show;
  }

  // Already running as an installed app: never show install buttons.
  if (isStandalone()) {
    setVisible(false);
    return;
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    setVisible(true);
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    setVisible(false);
  });

  // If the app gets launched in standalone mode mid-session, hide the buttons.
  window.matchMedia("(display-mode: standalone)").addEventListener("change", () => {
    if (isStandalone()) setVisible(false);
  });

  async function requestInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPrompt = null;
    if (choice && choice.outcome === "accepted") {
      setVisible(false);
    }
  }

  topButton.addEventListener("click", requestInstall);
  sideButton.addEventListener("click", requestInstall);
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator && window.isSecureContext) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
}

export { setupPWAInstall, registerServiceWorker };
