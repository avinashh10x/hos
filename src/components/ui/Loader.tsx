"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, smooth } from "@/lib/motion";
import { stage } from "@/lib/stage";

// Counts down from 100 to 0: "removing everything unnecessary".
// Waits for the can's first label so the hero never shows an empty can.
export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      window.scrollTo(0, 0);
      smooth.lenis?.stop();
      const counter = { v: 100 };
      const tl = gsap.timeline();
      tl.to(counter, {
        v: 12,
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: () => {
          if (num.current) num.current.textContent = String(Math.round(counter.v));
        },
      });

      const finish = () => {
        gsap
          .timeline({
            onComplete: () => {
              smooth.lenis?.start();
              window.dispatchEvent(new Event("zyro:enter"));
              setDone(true);
            },
          })
          .to(counter, {
            v: 0,
            duration: 0.6,
            ease: "power3.out",
            onUpdate: () => {
              if (num.current) num.current.textContent = String(Math.round(counter.v));
            },
          })
          .to("[data-loader-line]", { scaleX: 1, duration: 0.6, ease: "power3.inOut" }, "<")
          .to("[data-loader-copy]", { yPercent: -120, duration: 0.6, ease: "power3.in", stagger: 0.05 }, "+=0.15")
          .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut" }, "-=0.2");
      };

      const wait = () => {
        if (stage.ready && tl.progress() === 1) finish();
        else gsap.delayedCall(0.1, wait);
      };
      gsap.delayedCall(0.2, wait);
      // Never hold the visitor hostage if WebGL fails
      const bail = gsap.delayedCall(8, () => {
        stage.ready = true;
      });
      return () => bail.kill();
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[80] flex flex-col justify-between bg-ink p-6 text-cream md:p-10"
      style={{ clipPath: "inset(0 0 0% 0)" }}
      aria-live="polite"
    >
      <div className="flex justify-between overflow-clip">
        <span data-loader-copy className="eyebrow block">
          Zyro by Karan Aujla
        </span>
        <span data-loader-copy className="eyebrow block text-cream/60">
          Removing everything unnecessary
        </span>
      </div>
      <div className="overflow-clip">
        <div data-loader-copy className="flex items-end justify-between gap-6">
          <span className="serif text-[34vw] leading-[0.78] md:text-[22vw]">
            <span ref={num}>100</span>
          </span>
          <span className="eyebrow mb-[3vw] hidden text-right text-cream/60 md:block">
            Sugar · Calories · Noise
          </span>
        </div>
        <div data-loader-line className="mt-4 h-px origin-left scale-x-0 bg-zyro" />
      </div>
    </div>
  );
}
