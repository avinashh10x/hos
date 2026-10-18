"use client";

import { useRef } from "react";
import { gsap, useGSAP, SURFACES } from "@/lib/motion";
import { stage } from "@/lib/stage";
import { useReveal, useStageTrigger } from "../hooks";

// The things Zyro removed, floating round the can like bubbles.
// d = desktop position, m = mobile position, both % of the frame (centre of the bubble).
const EXTRAS = [
  // Two columns mirrored around the can (centre ~71% across, ~53% down), three even rows
  { word: "Sugar", d: [52, 27], m: [20, 31] },
  { word: "Calories", d: [90, 27], m: [80, 31] },
  { word: "Empty claims", d: [52, 53], m: [20, 53] },
  { word: "Extra noise", d: [90, 53], m: [80, 53] },
  { word: "Distractions", d: [52, 79], m: [20, 75] },
  { word: "Guilt", d: [90, 79], m: [80, 75] },
];

const THROW = (i: number) => 0.45 + i * 0.4;

// Pop a bubble into droplets and give the can a fizz kick
function burst(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  for (let k = 0; k < 12; k++) {
    const drop = document.createElement("span");
    drop.className = "pointer-events-none absolute rounded-full bg-fg/80";
    const size = 3 + Math.random() * 7;
    Object.assign(drop.style, { width: `${size}px`, height: `${size}px`, left: "50%", top: "50%" });
    el.appendChild(drop);
    const a = (k / 12) * Math.PI * 2 + Math.random() * 0.4;
    const dist = r.width * (0.45 + Math.random() * 0.5);
    gsap.fromTo(
      drop,
      { x: 0, y: 0, opacity: 1 },
      {
        x: Math.cos(a) * dist,
        y: Math.sin(a) * dist * 0.6 + 30,
        opacity: 0,
        scale: 0.3,
        duration: 0.7 + Math.random() * 0.3,
        ease: "expo.out",
        onComplete: () => drop.remove(),
      },
    );
  }
  const bubble = el.querySelector<HTMLElement>("[data-bubble]")!;
  bubble.style.animation = "none";
  gsap
    .timeline()
    .to(bubble, { scale: 1.18, duration: 0.12, ease: "power2.out" })
    .to(bubble, { scale: 0, opacity: 0, duration: 0.18, ease: "power3.in" });
  stage.fizz = 1;
  stage.spinVelocity += 2.5;
}

export function Subtract() {
  const ref = useRef<HTMLElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const popped = useRef(new Set<number>());
  const thrown = useRef(0);
  useStageTrigger(ref, { world: SURFACES.ink, variant: "vita-cola" });
  useReveal(ref);

  const render = () => {
    let left = 0;
    EXTRAS.forEach((_, i) => {
      if (i >= thrown.current && !popped.current.has(i)) left++;
    });
    if (count.current) count.current.textContent = String(left);
    gsap.to("[data-clarity]", { autoAlpha: left === 0 ? 1 : 0, y: left === 0 ? 0 : 30, duration: 0.8, ease: "expo.out" });
  };

  useGSAP(
    () => {
      gsap.set("[data-clarity]", { autoAlpha: 0, y: 30 });
      const tags = gsap.utils.toArray<HTMLElement>("[data-extra]");
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          const t = tl.time();
          const n = EXTRAS.filter((_, i) => t > THROW(i) + 0.15).length;
          if (n !== thrown.current) {
            thrown.current = n;
            render();
          }
        },
      });
      tl.from(tags, { autoAlpha: 0, scale: 0.4, stagger: 0.04, duration: 0.25, ease: "back.out(2)" });
      tags.forEach((tag, i) => {
        tl.to(tag.querySelector("[data-strike]"), { scaleX: 1, duration: 0.14 }, THROW(i));
        tl.to(
          tag,
          {
            x: () => (tag.getBoundingClientRect().left > window.innerWidth * 0.7 ? 1 : -1) * window.innerWidth * 0.3,
            y: -160,
            rotate: (i % 2 ? 1 : -1) * 24,
            autoAlpha: 0,
            duration: 0.3,
            ease: "power2.in",
            onStart: () => {
              stage.fizz = Math.max(stage.fizz, 0.6);
            },
          },
          THROW(i) + 0.15,
        );
      });
      tl.to({}, { duration: 0.5 });
    },
    { scope: ref },
  );

  const onPop = (i: number, el: HTMLElement) => {
    if (popped.current.has(i)) return;
    popped.current.add(i);
    burst(el);
    render();
  };

  return (
    <section ref={ref} id="story" data-pose="subtract" data-pose-hold data-reveal-scope className="relative h-[320vh]">
      <div className="sticky top-0 z-20 h-svh overflow-clip">
        <div className="absolute inset-x-5 top-24 md:inset-x-auto md:left-0 md:top-1/2 md:w-[calc(var(--frame)*0.42)] md:-translate-y-1/2">
          <p data-reveal="fade" className="eyebrow mb-6 text-accent">
            The Zyro philosophy
          </p>
          <h2 data-reveal="lines" className="lead text-[8vw] leading-[1.08] md:text-[calc(var(--frame)*0.034)]">
            What you remove matters more than what you <span className="text-accent">add.</span>
          </h2>
          <div data-reveal="fade" className="mt-10 flex items-end gap-5 max-md:hidden">
            <span ref={count} className="display text-[7vw] leading-[0.8] tabular-nums">
              6
            </span>
            <span className="pb-2 text-sm leading-snug opacity-70">
              things left to remove.
              <br />
              Scroll, or pop them yourself.
            </span>
          </div>
          <p data-clarity className="lead mt-8 text-2xl leading-tight text-accent max-md:hidden md:text-3xl">
            Leaving behind clarity, discipline and purpose.
          </p>
        </div>

        <div className="pointer-events-none absolute inset-0">
        {EXTRAS.map((e, i) => (
          <div
            key={e.word}
            data-extra
            className="pointer-events-auto absolute left-(--mx) top-(--my) -translate-x-1/2 -translate-y-1/2 md:left-(--dx) md:top-(--dy)"
            style={
              {
                "--dx": `${e.d[0]}%`,
                "--dy": `${e.d[1]}%`,
                "--mx": `${e.m[0]}%`,
                "--my": `${e.m[1]}%`,
              } as React.CSSProperties
            }
            onPointerEnter={(ev) => onPop(i, ev.currentTarget)}
            onClick={(ev) => onPop(i, ev.currentTarget)}
          >
            <span
              data-bubble
              data-cursor="Pop"
              className="animate-float relative block rounded-full px-3.5 py-2 md:px-7 md:py-3.5"
              style={{
                animationDelay: `${i * -1.1}s`,
                background:
                  "radial-gradient(120% 140% at 30% 20%, rgba(255,255,255,0.22), rgba(255,255,255,0.04) 45%, rgba(255,255,255,0.02) 70%), rgba(255,255,255,0.03)",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.18), inset -6px -10px 24px rgba(255,255,255,0.05), 0 20px 40px rgba(0,0,0,0.35)",
                backdropFilter: "blur(6px)",
              }}
            >
              <span className="display relative block whitespace-nowrap text-[4.3vw] md:text-[2vw]">{e.word}</span>
              <span data-strike className="absolute inset-x-4 top-1/2 h-[3px] origin-left scale-x-0 bg-accent" />
              <span className="absolute left-[22%] top-[18%] h-1.5 w-3 -rotate-12 rounded-full bg-white/60 blur-[1px]" />
            </span>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
}
