"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, SplitText, useGSAP, SURFACES, scrollTo } from "@/lib/motion";
import { dragSpin, setVariant, stage } from "@/lib/stage";
import { crackOpen } from "@/lib/canOpen";
import { PRODUCTS, LINE_BY_ID } from "@/lib/products";
import { useStageTrigger } from "../hooks";
import { Magnetic } from "../ui/Magnetic";

// The cans you can flip through in the hero
const FLAVOURS = ["vita-cola", "blue-bolt", "berry-blast", "masala-cola", "jeera-soda", "tonic-water", "ginger-ale-flavoured"];

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      {dir === "prev" ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
    </svg>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const hit = useRef<HTMLButtonElement>(null);
  const [index, setIndex] = useState(0);
  const product = PRODUCTS[FLAVOURS[index]];
  useStageTrigger(ref, { world: SURFACES.ink, variant: FLAVOURS[index] });

  const go = (step: number) => {
    const i = (index + step + FLAVOURS.length) % FLAVOURS.length;
    setIndex(i);
    setVariant(FLAVOURS[i]);
  };

  // Entrance after the loader lifts
  useGSAP(
    (_, contextSafe) => {
      gsap.set("[data-hero]", { autoAlpha: 0 });
      const enter = contextSafe!(() => {
        const lines = gsap.utils.toArray<HTMLElement>("[data-hero-word]");
        const splits = lines.map((w) => SplitText.create(w, { type: "chars", mask: "chars", charsClass: "split-char" }));
        gsap.set("[data-hero]", { autoAlpha: 1 });
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        splits.forEach((s, i) => {
          tl.from(s.chars, { yPercent: 115, duration: 1.3, stagger: 0.03 }, 0.1 + i * 0.12);
        });
        tl.from("[data-hero-fade]", { autoAlpha: 0, y: 20, duration: 1.1, stagger: 0.06 }, 0.45);
        // The can rises into place with a spin
        stage.spinVelocity = 14;
        gsap.to(stage, { drop: 0, duration: 1.8, ease: "expo.out" });
      });
      window.addEventListener("zyro:enter", enter, { once: true });
      return () => window.removeEventListener("zyro:enter", enter);
    },
    { scope: ref },
  );

  // The product details slide in on each flavour change
  useGSAP(
    () => {
      gsap.fromTo("[data-hero-swap]", { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: "expo.out", stagger: 0.05 });
    },
    { scope: ref, dependencies: [index] },
  );

  // Drag to spin, click to crack the can open
  useEffect(() => {
    const el = hit.current;
    if (!el) return;
    let down = false;
    let lastX = 0;
    let moved = 0;
    const onDown = (e: PointerEvent) => {
      down = true;
      lastX = e.clientX;
      moved = 0;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      moved += Math.abs(dx);
      dragSpin(dx);
    };
    const onUp = () => {
      if (down && moved < 6) crackOpen();
      down = false;
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const arrowBtn =
    "grid size-10 place-items-center rounded-full shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--fg)_30%,transparent)] transition-[box-shadow,background-color,color] duration-300 hover:bg-fg hover:text-bg";

  return (
    <section ref={ref} id="top" data-pose="hero" className="relative h-svh min-h-[640px] overflow-clip">
      {/* The headline, huge and centred behind the can */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center" data-hero>
        <h1 className="display select-none text-center leading-[0.84]">
          <span data-hero-word className="block text-[19vw] md:text-[calc(var(--frame)*0.2)]">
            Nothing
          </span>
          <span data-hero-word className="block text-[14vw] text-accent md:text-[calc(var(--frame)*0.142)]">
            Unnecessary.
          </span>
        </h1>
      </div>

      {/* Reading order: headline, then one action, then the quieter flavour switcher */}
      <div data-hero className="relative z-20 flex h-full flex-col justify-end pb-6 md:pb-10">
        <div className="flex flex-col-reverse gap-6 md:flex-row md:items-end md:justify-between">
          {/* Flavour switcher: secondary, kept small and low-contrast */}
          <div data-hero-fade className="flex items-center gap-3">
            <button type="button" onClick={() => go(-1)} aria-label="Previous flavour" className={arrowBtn}>
              <Arrow dir="prev" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next flavour" className={arrowBtn}>
              <Arrow dir="next" />
            </button>
            <p aria-live="polite" className="ml-1 opacity-70">
              <span data-hero-swap className="font-cond block text-base font-semibold uppercase leading-tight">
                {product.name}
              </span>
              <span data-hero-swap className="block text-xs">
                {LINE_BY_ID[product.line].name} · {product.volume}
              </span>
            </p>
          </div>

          {/* The one action */}
          <div data-hero-fade className="flex flex-col gap-4 md:items-end md:text-right">
            <p className="lead max-w-[30ch] text-lg leading-snug md:text-xl">Zero sugar. Zero calories. By Karan Aujla.</p>
            <Magnetic>
              <a
                href="#shop"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#shop");
                }}
                data-cursor=""
                className="eyebrow inline-flex items-center gap-2 rounded-full bg-accent px-6 py-4 text-bg"
              >
                Shop the range <span aria-hidden>→</span>
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* Hit area over the can: drag to turn it, click to open it */}
      <button
        ref={hit}
        type="button"
        data-cursor="Drag"
        className="absolute left-1/2 top-1/2 z-30 h-[44vh] w-[22vh] -translate-x-1/2 -translate-y-1/2 touch-pan-y rounded-full md:h-[56vh]"
        aria-label="Open the can"
        // Pointer taps open via pointerup (so drags can spin instead); this covers Enter and Space
        onClick={(e) => {
          if (e.detail === 0) crackOpen();
        }}
      />
    </section>
  );
}
