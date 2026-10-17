"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { LINES, PRODUCTS } from "@/lib/products";
import { dragSpin, setVariant, stage } from "@/lib/stage";
import { gsap, SURFACES } from "@/lib/motion";
import { useReveal, useStageTrigger } from "../hooks";

// Hovering a product dresses the can in it; Hydrate+ turns it into the bottle
function preview(id: string) {
  setVariant(id, { turn: false });
  gsap.to(stage, { morphBoost: PRODUCTS[id].cap ? 1 : 0, duration: 0.9, ease: "power3.inOut", overwrite: "auto" });
}

export function Shop() {
  const ref = useRef<HTMLElement>(null);
  const drag = useRef<HTMLDivElement>(null);
  useStageTrigger(ref, { world: SURFACES.cream });
  useReveal(ref);

  // Drag anywhere over the can to spin it
  useEffect(() => {
    const el = drag.current;
    if (!el) return;
    let down = false;
    let lastX = 0;
    const onDown = (e: PointerEvent) => {
      down = true;
      lastX = e.clientX;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      dragSpin(e.clientX - lastX);
      lastX = e.clientX;
    };
    const onUp = () => {
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

  return (
    <section ref={ref} id="shop" data-pose="shop" data-pose-hold className="relative py-28">
      <div
        ref={drag}
        data-cursor="Drag"
        className="sticky top-[15vh] z-30 hidden h-[70vh] w-[calc(var(--frame)*0.36)] touch-pan-y md:block"
        aria-hidden
      />
      <div className="relative z-20 md:-mt-[70vh] md:ml-[calc(var(--frame)*0.42)]">
        <p data-reveal="fade" className="eyebrow mb-5 text-accent">
          Shop the range
        </p>
        <h2 className="display text-[18vw] md:text-[8vw]">
          <span data-reveal="chars" className="block">
            Pick your <span className="serif normal-case text-accent">0</span>
          </span>
        </h2>
        <p data-reveal="fade" className="mt-5 max-w-[44ch] opacity-75">
          Hover a can and watch it pour. Every drink is zero sugar and zero calories, made in India.
        </p>

        <div className="mt-14 space-y-14">
          {LINES.map((line) => (
            <div key={line.id}>
              <div data-reveal="fade" className="mb-4 flex items-baseline justify-between border-b border-current/15 pb-3">
                <h3 className="display text-3xl">{line.name}</h3>
                <p className="eyebrow opacity-60">{line.products.length} flavours</p>
              </div>
              <ul className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                {line.products.map((id, i) => {
                  const p = PRODUCTS[id];
                  return (
                    <li key={id} data-reveal="fade" data-reveal-delay={String(i * 0.06)}>
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor="Buy"
                        onPointerEnter={() => preview(p.id)}
                        onFocus={() => preview(p.id)}
                        className="group relative block overflow-clip rounded-2xl"
                        style={{ background: p.label.bg, color: p.label.text }}
                      >
                        <div className="relative aspect-square overflow-clip">
                          <Image
                            src={p.photo}
                            alt={`Zyro ${p.name}`}
                            fill
                            sizes="(max-width: 768px) 50vw, 20vw"
                            className="object-cover transition-transform duration-1000 ease-out-expo group-hover:scale-110"
                          />
                        </div>
                        <div className="flex items-end justify-between gap-2 p-4">
                          <div>
                            <p className="font-cond text-xl font-bold uppercase leading-none">{p.name}</p>
                            <p className="mt-1 text-xs uppercase tracking-widest opacity-75">{p.volume}</p>
                          </div>
                          <p className="font-cond text-lg font-semibold">₹{p.price}</p>
                        </div>
                        <span className="absolute right-3 top-3 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-[var(--c)] text-[var(--t)] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100" style={{ ["--c" as string]: p.label.text, ["--t" as string]: p.label.bg }}>
                          ↗
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
