"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import type Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

export { gsap, ScrollTrigger, SplitText, useGSAP };

export const smooth: { lenis: Lenis | null } = { lenis: null };

export function scrollTo(target: string | number | HTMLElement) {
  if (smooth.lenis) smooth.lenis.scrollTo(target, { duration: 1.6 });
  else if (typeof target === "number") window.scrollTo({ top: target });
  else (typeof target === "string" ? document.querySelector(target) : target)?.scrollIntoView();
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// The only page surfaces. Flavour colour lives on the can, never on the page.
// accent is the red that passes 4.5:1 for small text on that surface.
export const SURFACES = {
  ink: { bg: "#0e0c0b", fg: "#f6efe2", accent: "#ff5a4e" },
  cream: { bg: "#f6efe2", fg: "#0e0c0b", accent: "#b81d24" },
  wine: { bg: "#4a0306", fg: "#f6efe2", accent: "#ff6b5e" },
  red: { bg: "#b81d24", fg: "#f6efe2", accent: "#f6efe2" },
} as const;

/** Morph the page colours. Every section and flavour switch goes through here. */
export function setWorld(world: { bg: string; fg: string; accent?: string }, duration = 0.9) {
  gsap.to(document.documentElement, {
    "--bg": world.bg,
    "--fg": world.fg,
    ...(world.accent ? { "--accent": world.accent } : {}),
    duration,
    ease: "power2.out",
    overwrite: "auto",
  });
}
