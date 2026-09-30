"use client";

import { useEffect, useRef } from "react";

// Attaches a pointer-tracked 3D tilt to the returned ref via --pointer-x/--pointer-y
// CSS custom properties, skipped for touch-only pointers and reduced-motion visitors.
export function useTilt() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reducedMotion) return;

    let frame = 0;

    const handleMove = (event) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const bounds = node.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
        const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
        node.style.setProperty("--pointer-x", x.toFixed(3));
        node.style.setProperty("--pointer-y", y.toFixed(3));
      });
    };

    const handleLeave = () => {
      node.style.setProperty("--pointer-x", "0");
      node.style.setProperty("--pointer-y", "0");
    };

    node.addEventListener("pointermove", handleMove);
    node.addEventListener("pointerleave", handleLeave);

    return () => {
      node.removeEventListener("pointermove", handleMove);
      node.removeEventListener("pointerleave", handleLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}
