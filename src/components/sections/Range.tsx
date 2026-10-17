"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, setWorld, scrollTo, SURFACES } from "@/lib/motion";
import { setVariant } from "@/lib/stage";
import { LINES, PRODUCTS, type Line } from "@/lib/products";
import { useReveal, useStageTrigger } from "../hooks";
import { Magnetic } from "../ui/Magnetic";

export function RangeIntro() {
  const ref = useRef<HTMLElement>(null);
  useStageTrigger(ref, { world: SURFACES.cream, variant: "vita-cola" });
  useReveal(ref);

  return (
    <section ref={ref} id="range" data-pose="lines" className="relative flex min-h-svh flex-col justify-between pb-10 pt-28">
      <div className="relative z-0">
        <p data-reveal="fade" className="eyebrow mb-4 text-accent">
          The range
        </p>
        <h2 className="display text-[19vw] md:text-[13vw]">
          <span data-reveal="chars" className="block">
            Four ways
          </span>
          <span data-reveal="chars" data-reveal-delay="0.15" className="block">
            to <span className="serif normal-case text-accent">0</span>
          </span>
        </h2>
      </div>
      <ol className="relative z-20 mt-16 grid gap-px overflow-clip rounded-2xl bg-fg/15 md:grid-cols-4">
        {LINES.map((l, i) => (
          <li key={l.id} data-reveal="fade" data-reveal-delay={String(i * 0.08)}>
            <a
              href={`#${l.id}`}
              data-cursor="View"
              onClick={(e) => {
                e.preventDefault();
                scrollTo(`#${l.id}`);
              }}
              className="group flex h-full flex-col justify-between gap-10 bg-bg p-6 transition-colors duration-500 hover:bg-fg hover:text-bg"
            >
              <span className="serif text-3xl opacity-60">{i + 1}</span>
              <span>
                <span className="display block text-5xl">{l.name}</span>
                <span className="mt-2 block text-sm opacity-70">{l.tagline}</span>
              </span>
              <span className="flex gap-1.5">
                {l.products.map((id) => (
                  <span key={id} className="h-3 w-3 rounded-full" style={{ background: PRODUCTS[id].label.bg }} />
                ))}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Chapter({ line, index, side }: { line: Line; index: number; side: "left" | "right" }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(-1);
  const n = line.products.length;
  const product = PRODUCTS[line.products[active]];
  useReveal(ref);

  useGSAP(
    () => {
      // Scroll position inside the chapter picks the flavour
      const update = () => {
        const el = ref.current!;
        const travel = Math.max(1, el.offsetHeight - window.innerHeight);
        const prog = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / travel));
        const i = Math.min(n - 1, Math.floor(prog * n));
        if (i === activeRef.current) return;
        activeRef.current = i;
        setActive(i);
        setVariant(line.products[i]);
      };
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 55%",
        end: "bottom 45%",
        onToggle: (self) => {
          if (!self.isActive) return;
          setWorld(SURFACES.cream);
          activeRef.current = -1;
          update();
        },
        onUpdate: (self) => {
          if (self.isActive) update();
        },
      });

      gsap.fromTo(
        "[data-giant]",
        { xPercent: side === "right" ? 8 : -30 },
        {
          xPercent: side === "right" ? -30 : 8,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope: ref },
  );

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-swap]",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "expo.out", stagger: 0.04, overwrite: true },
      );
    },
    { scope: ref, dependencies: [active] },
  );

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    scrollTo(top + travel * ((i + 0.5) / n));
  };

  const text = side === "right" ? "md:pr-[calc(var(--frame)*0.5)]" : "md:pl-[calc(var(--frame)*0.56)]";

  return (
    <section ref={ref} id={line.id} data-pose={line.id} data-pose-hold className="relative" style={{ height: `${100 + n * 55}svh` }}>
      {/* Behind the can */}
      <div className="pointer-events-none sticky top-0 z-0 h-svh overflow-clip">
        <p
          data-giant
          className="display outline-text absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-[42vw] opacity-25 md:text-[30vw]"
        >
          {line.name}
        </p>
      </div>

      {/* In front of the can */}
      <div className="sticky top-0 z-20 -mt-[100svh] flex h-svh items-end md:items-center">
        <div className="frame relative pb-6 md:pb-0">
          <div className={text}>
          <div className="max-w-[34rem] max-md:rounded-3xl max-md:bg-bg/85 max-md:p-5 max-md:backdrop-blur-md">
            <div data-reveal="fade" className="flex items-baseline gap-4">
              <span className="serif text-5xl leading-none text-accent md:text-6xl">{index + 1}</span>
              <span className="serif text-xl italic opacity-80 md:text-2xl">{line.tagline}</span>
            </div>
            <h3 data-reveal="chars" className="display mt-3 whitespace-nowrap text-[15vw] md:text-[calc(var(--frame)*0.075)]">
              {line.name}
            </h3>
            <p data-reveal="fade" className="mt-4 max-w-[40ch] leading-relaxed opacity-80 max-md:hidden">
              {line.body}
            </p>

            <div data-reveal="fade" className="mt-7 flex flex-wrap gap-2" role="group" aria-label={`${line.name} flavours`}>
              {line.products.map((id, i) => {
                const p = PRODUCTS[id];
                const on = i === active;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => goTo(i)}
                    data-cursor=""
                    aria-pressed={on}
                    className={`group flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4 transition-all duration-500 ${
                      on ? "bg-fg text-bg" : "bg-fg/8 hover:bg-fg/15"
                    }`}
                  >
                    <span
                      className="h-7 w-4 rounded-[5px] transition-transform duration-500 group-hover:-rotate-12"
                      style={{ background: `linear-gradient(90deg, ${p.label.bg} 55%, ${p.label.logo} 55% 70%, ${p.label.bg} 70%)` }}
                    />
                    <span className="font-cond text-sm font-semibold uppercase tracking-wider">{p.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-7 grid grid-cols-[1fr_auto] items-end gap-x-6 gap-y-2">
              <p data-swap className="display text-4xl md:text-[3.4rem]">
                {product.name}
              </p>
              <div data-swap className="row-span-2 flex items-center gap-3 self-end">
                <span className="font-cond text-xl font-semibold">₹{product.price}</span>
                <Magnetic>
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="Buy"
                    aria-label={`Buy ${product.name} on zyroindia.com`}
                    className="eyebrow inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-bg"
                  >
                    Buy <span aria-hidden>↗</span>
                  </a>
                </Magnetic>
              </div>
              <p data-swap className="font-cond text-sm font-semibold uppercase tracking-widest opacity-60">
                {product.volume} · {product.notes.join(" · ")}
              </p>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
