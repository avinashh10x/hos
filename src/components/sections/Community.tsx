"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP, SURFACES, prefersReducedMotion } from "@/lib/motion";
import { TOUR } from "@/lib/products";
import { useReveal, useStageTrigger } from "../hooks";
import { Magnetic } from "../ui/Magnetic";

const PHOTOS = [
  { src: "/community/c5.jpg", alt: "Karan Aujla on stage with a Zyro can", w: 1200, h: 1717, cls: "md:col-span-4 md:row-span-2", speed: -12 },
  { src: "/community/c1.jpg", alt: "Fans raising Zyro cans at a concert", w: 1200, h: 847, cls: "md:col-span-5", speed: 8 },
  { src: "/community/c8.jpg", alt: "Two hands toasting Blue Bolt and Jeera Soda cans", w: 1200, h: 417, cls: "md:col-span-3", speed: -6 },
  { src: "/community/c6.jpg", alt: "A fan drinking Zyro at the venue", w: 1200, h: 417, cls: "md:col-span-5", speed: 10 },
  { src: "/community/c3.jpg", alt: "A Blue Bolt can held up against the sunset", w: 1200, h: 847, cls: "md:col-span-3", speed: -10 },
];

export function Community() {
  const ref = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useStageTrigger(ref, { world: SURFACES.red, variant: "blue-bolt" });
  useReveal(ref);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
        gsap.to(el, {
          yPercent: Number(el.dataset.speed),
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });

      // Tour marquee: runs on its own and skews with scroll velocity
      if (prefersReducedMotion()) return;
      const loop = gsap.to(track.current, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
      const skew = gsap.quickTo(track.current, "skewX", { duration: 0.5, ease: "power3" });
      ScrollTrigger.create({
        trigger: ref.current,
        onUpdate: (self) => {
          const v = self.getVelocity();
          loop.timeScale(1 + Math.min(4, Math.abs(v) / 400));
          skew(gsap.utils.clamp(-12, 12, v / -150));
        },
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="community" data-pose="community" className="relative overflow-clip py-28">
      <div className="frame relative z-0">
        <p data-reveal="fade" className="eyebrow mb-5">
          Zyro community
        </p>
        <h2 className="display max-w-[11ch] text-[16vw] md:text-[9vw]">
          <span data-reveal="lines" className="block">
            Full on fun.
          </span>
          <span data-reveal="lines" data-reveal-delay="0.1" className="block serif normal-case italic">
            Zero guilt.
          </span>
        </h2>
        <p data-reveal="fade" className="mt-8 max-w-[44ch] text-lg leading-relaxed opacity-85">
          Built by an artist, shared at the show. On Karan Aujla&rsquo;s 2026 tour, fans won tickets on Instagram
          and raised a Zyro in every city.
        </p>
      </div>

      <div className="relative z-20 my-20 border-y border-fg/25 py-5" aria-label="2026 tour cities">
        <div ref={track} className="flex w-max">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
              {TOUR.map((t) => (
                <span key={t.city + k} className="flex items-center gap-6 pr-6">
                  <span className="display text-[12vw] md:text-[7vw]">{t.city}</span>
                  <span className="serif text-2xl italic opacity-70 md:text-4xl">{t.date}</span>
                  <span className="mark-mask mx-4 block h-8 w-16 opacity-80 md:h-12 md:w-24" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="frame relative z-20 grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-4 md:pr-[calc(var(--frame)*0.38)]">
        {PHOTOS.map((p) => (
          <figure key={p.src} className={`relative overflow-clip rounded-xl ${p.cls}`}>
            <div data-speed={p.speed} className="scale-[1.15]">
              <Image src={p.src} alt={p.alt} width={p.w} height={p.h} sizes="(max-width: 768px) 50vw, 33vw" className="h-full w-full object-cover" />
            </div>
          </figure>
        ))}
      </div>

      <div className="frame relative z-20 mt-16 flex flex-wrap items-center gap-6">
        <Magnetic>
          <a
            href="https://www.instagram.com/zyroindia/"
            target="_blank"
            rel="noreferrer"
            data-cursor="Follow"
            className="display inline-flex items-center gap-3 rounded-full bg-fg px-7 py-4 text-3xl text-bg"
          >
            @zyroindia <span aria-hidden>↗</span>
          </a>
        </Magnetic>
        <p className="eyebrow opacity-80">Tag us. Get featured.</p>
      </div>
    </section>
  );
}
