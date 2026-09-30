"use client";

import { useEffect } from "react";

// Adds `motion-ready` to <html> only when IntersectionObserver exists and the
// visitor hasn't asked for reduced motion, so .reveal children opt into the
// scroll-reveal transition instead of being hidden without JS/motion support.
export function MotionReady() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (typeof IntersectionObserver === "undefined" || reducedMotion) return;

    document.documentElement.classList.add("motion-ready");
  }, []);

  return null;
}
