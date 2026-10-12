import type Lenis from "lenis";

// Shared handle for the desktop smooth-scroll instance. It stays null on touch devices, below 1280px,
// inside iframes and with reduced motion, so callers must keep their native fallback.
let instance: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  instance = next;
}

export function getLenis() {
  return instance;
}

/**
 * Jumps to a vertical position without smoothing. Callers that run their own frame-by-frame
 * animation use it so the smooth-scroll instance follows them instead of fighting them.
 */
export function scrollToY(y: number) {
  if (instance) {
    instance.scrollTo(y, { immediate: true, force: true });
    return;
  }
  window.scrollTo(0, y);
}
