"use client";

import { useEffect, useRef } from "react";
import { PRODUCTS } from "@/lib/products";
import { onVariant, stage } from "@/lib/stage";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * One soft light behind the can for the whole page. It follows the can and
 * takes the current flavour's colour, so there are no per-section gradients
 * to start and stop at section edges.
 */
export function Glow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const paint = (id: string) => {
      el.style.backgroundColor = PRODUCTS[id].label.bg;
    };
    paint(stage.variant);
    const off = onVariant(paint);

    const still = prefersReducedMotion();
    let x = innerWidth / 2;
    let y = innerHeight / 2;
    let raf = 0;
    const tick = () => {
      const k = still ? 1 : 0.12;
      x += (stage.center.x - x) * k;
      y += (stage.center.y - y) * k;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      off();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[5] aspect-square w-[min(70vh,52vw)] rounded-full opacity-25 blur-[110px] transition-[background-color] duration-1000 max-md:w-[80vw]"
    />
  );
}
