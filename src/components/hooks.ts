"use client";

import type { RefObject } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP, setWorld, prefersReducedMotion } from "@/lib/motion";
import { setVariant, stage } from "@/lib/stage";

type World = { bg: string; fg: string; accent?: string };

/**
 * While this section owns the middle of the viewport, it sets the page colours
 * and (optionally) the flavour on the can.
 */
export function useStageTrigger(
  ref: RefObject<HTMLElement | null>,
  opts: { world?: World; variant?: string; onActive?: () => void },
) {
  useGSAP(
    () => {
      if (!ref.current) return;
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (!self.isActive) return;
          gsap.to(stage, { morphBoost: 0, duration: 0.8, overwrite: "auto" });
          if (opts.world) setWorld(opts.world);
          if (opts.variant) setVariant(opts.variant);
          opts.onActive?.();
        },
      });
    },
    { scope: ref },
  );
}

/**
 * Entrance animations for anything inside `scope` marked with data-reveal:
 *   data-reveal="lines"  masked line rise
 *   data-reveal="chars"  masked character rise
 *   data-reveal="fade"   soft rise + fade
 * Add data-reveal-delay="0.2" to offset. Elements start hidden via CSS-in-JS here,
 * so nothing flashes before fonts load.
 */
export function useReveal(scope: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const reduce = prefersReducedMotion();
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        const kind = el.dataset.reveal;
        const delay = Number(el.dataset.revealDelay ?? 0);
        const trigger = { trigger: el, start: "top 88%", once: true };
        if (reduce) {
          gsap.set(el, { autoAlpha: 1 });
          return;
        }
        if (kind === "lines" || kind === "chars") {
          document.fonts.ready.then(() => {
            const split = SplitText.create(el, {
              type: kind === "chars" ? "lines,chars" : "lines",
              mask: "lines",
              linesClass: "split-line",
            });
            gsap.set(el, { autoAlpha: 1 });
            gsap.from(kind === "chars" ? split.chars : split.lines, {
              yPercent: 110,
              rotate: kind === "chars" ? 6 : 2,
              duration: kind === "chars" ? 1.1 : 1.2,
              ease: "expo.out",
              stagger: kind === "chars" ? 0.025 : 0.09,
              delay,
              scrollTrigger: trigger,
            });
          });
        } else {
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, duration: 1.1, ease: "expo.out", delay, scrollTrigger: trigger },
          );
        }
      });
    },
    { scope, dependencies: deps },
  );
}
