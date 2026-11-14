(() => {
  let activeTouch = null;
  const selector = ".rep-control button.stepper, .stepper button";

  document.addEventListener("touchstart", (event) => {
    const button = event.target.closest(selector);
    if (!button || event.touches.length !== 1) {
      activeTouch = null;
      return;
    }
    const touch = event.changedTouches[0];
    activeTouch = { button, id: touch.identifier, x: touch.clientX, y: touch.clientY };
  }, { passive: true });

  document.addEventListener("touchend", (event) => {
    if (!activeTouch) return;
    const touch = Array.from(event.changedTouches).find((item) => item.identifier === activeTouch.id);
    if (!touch) return;
    const { button, x, y } = activeTouch;
    activeTouch = null;
    if (event.touches.length || Math.hypot(touch.clientX - x, touch.clientY - y) > 10) return;
    if (event.cancelable) {
      event.preventDefault();
      button.click();
    }
  }, { passive: false });

  document.addEventListener("touchcancel", () => { activeTouch = null; }, { passive: true });
})();
