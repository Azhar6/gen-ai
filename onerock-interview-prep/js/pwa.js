function setupPWAInstall({ topButton, sideButton }) {
  let deferredPrompt = null;

  function setVisible(visible) {
    topButton.hidden = !visible;
    sideButton.hidden = !visible;
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

  async function requestInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    setVisible(false);
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
