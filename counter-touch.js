(() => {
  const selector = ".rep-control button.stepper, .stepper button";
  let activeTouch = null;
  let repeatTimer = null;
  let mouseRepeated = false;

  function stopRepeating() {
    clearInterval(repeatTimer);
    repeatTimer = null;
  }

  function startRepeating(button, onRepeat) {
    stopRepeating();
    repeatTimer = setInterval(() => {
      onRepeat();
      button.click();
    }, 500);
  }

  document.addEventListener("touchstart", (event) => {
    const button = event.target.closest(selector);
    if (!button || event.touches.length !== 1) {
      activeTouch = null;
      stopRepeating();
      return;
    }
    const touch = event.changedTouches[0];
    activeTouch = { button, id: touch.identifier, x: touch.clientX, y: touch.clientY, repeated: false };
    startRepeating(button, () => { if (activeTouch) activeTouch.repeated = true; });
  }, { passive: true });

  document.addEventListener("touchmove", (event) => {
    if (!activeTouch) return;
    const touch = Array.from(event.changedTouches).find((item) => item.identifier === activeTouch.id);
    if (touch && Math.hypot(touch.clientX - activeTouch.x, touch.clientY - activeTouch.y) > 10) {
      activeTouch = null;
      stopRepeating();
    }
  }, { passive: true });

  document.addEventListener("touchend", (event) => {
    if (!activeTouch) return;
    const touch = Array.from(event.changedTouches).find((item) => item.identifier === activeTouch.id);
    if (!touch) return;
    const { button, x, y, repeated } = activeTouch;
    activeTouch = null;
    stopRepeating();
    if (event.touches.length || Math.hypot(touch.clientX - x, touch.clientY - y) > 10) return;
    if (event.cancelable) {
      event.preventDefault();
      if (!repeated) button.click();
    }
  }, { passive: false });

  document.addEventListener("touchcancel", () => { activeTouch = null; stopRepeating(); }, { passive: true });

  document.addEventListener("mousedown", (event) => {
    const button = event.target.closest(selector);
    if (!button || event.button !== 0) return;
    mouseRepeated = false;
    startRepeating(button, () => { mouseRepeated = true; });
  });
  document.addEventListener("mouseup", stopRepeating);
  document.addEventListener("click", (event) => {
    if (mouseRepeated && event.isTrusted && event.target.closest(selector)) {
      mouseRepeated = false;
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);
  window.addEventListener("blur", stopRepeating);
})();
