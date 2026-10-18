"use client";

import { useRef } from "react";
import { gsap, useGSAP, SURFACES } from "@/lib/motion";
import { useReveal, useStageTrigger } from "../hooks";

const STATS = [
  { unit: "g", label: "Sugar" },
  { unit: "kcal", label: "Calories" },
  { unit: "", label: "Harmful chemicals" },
];

// Built like Zyro's own listing banners: stacked claims on the left,
// the can standing in front of a giant zero on the right.
export function Zero() {
  const ref = useRef<HTMLElement>(null);
  useStageTrigger(ref, { world: SURFACES.ink, variant: "blue-bolt" });
  useReveal(ref);

  useGSAP(
    () => {
      // Each number spins like a slot reel and lands on zero
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el, i) => {
        const v = { p: 0 };
        let last = -1;
        gsap.to(v, {
          p: 1,
          duration: 1.4 + i * 0.3,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
          onUpdate: () => {
            const step = Math.floor(v.p * v.p * 26);
            if (step === last) return;
            last = step;
            el.textContent = v.p >= 1 ? "0" : String(Math.floor(Math.random() * 90) + 10);
          },
          onComplete: () => {
            el.textContent = "0";
          },
        });
      });
      gsap.fromTo(
        "[data-ring]",
        { scale: 0.7, autoAlpha: 0 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 1.8,
          ease: "expo.out",
          scrollTrigger: { trigger: ref.current, start: "top 60%", once: true },
        },
      );
      gsap.to("[data-ring]", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} data-pose="zero" className="relative flex min-h-svh flex-col overflow-clip">
      {/* Behind the can */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-end md:pr-[6%]" aria-hidden>
        <span data-ring className="display block text-[150vw] leading-none text-white/[0.07] max-md:-mr-[30vw] md:text-[64vw]">
          0
        </span>
      </div>

      <div className="frame relative z-20 flex flex-1 flex-col justify-center pb-10 pt-28">
        <div className="md:w-[58%]">
        <p data-reveal="fade" className="eyebrow text-accent">
          We&rsquo;ve got it right
        </p>
        <h2 className="display mt-4 text-[20vw] leading-[0.82] md:text-[calc(var(--frame)*0.1)]">
          <span data-reveal="chars" className="block">
            Zero sugar
          </span>
          <span data-reveal="chars" data-reveal-delay="0.12" className="block">
            Zero calories
          </span>
        </h2>
        <div data-reveal="fade" className="mt-6 flex items-center gap-5">
          <span className="h-[2px] w-[min(26vw,320px)] bg-accent" />
          <span className="eyebrow">Nothing unnecessary</span>
        </div>
        <span data-reveal="fade" className="logo-mask mt-8 block h-20 w-48 text-accent md:h-24 md:w-56" aria-hidden />
        </div>
      </div>

      <ul className="relative z-20 grid grid-cols-3 border-t border-fg/15 md:w-[58%]">
        {STATS.map((s) => (
          <li key={s.label} className="border-r border-fg/15 py-6 pr-4 last:border-r-0 [&:not(:first-child)]:pl-4 md:[&:not(:first-child)]:pl-8">
            <p className="flex items-baseline gap-1.5">
              <span data-count className="display text-6xl leading-none tabular-nums md:text-7xl">
                0
              </span>
              <span className="font-cond text-lg font-semibold uppercase opacity-60">{s.unit}</span>
            </p>
            <p className="eyebrow mt-2 text-[0.7rem] opacity-80">{s.label}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
