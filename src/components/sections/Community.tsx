"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, SURFACES } from "@/lib/motion";
import { TOUR } from "@/lib/products";
import { useReveal, useStageTrigger } from "../hooks";
import { Magnetic } from "../ui/Magnetic";

// Bento: the tall stage shot leads, the crowd and close-ups fill around it
const PHOTOS = [
  { src: "/community/c5.jpg", alt: "Karan Aujla on stage with a Zyro can", cls: "row-span-2 md:col-span-4", speed: -8 },
  { src: "/community/c1.jpg", alt: "Fans raising Zyro cans at a concert", cls: "md:col-span-5", speed: 6 },
  { src: "/community/c8.jpg", alt: "Two hands toasting Blue Bolt and Jeera Soda cans", cls: "md:col-span-3", speed: -5 },
  { src: "/community/c6.jpg", alt: "A fan drinking Zyro at the venue", cls: "md:col-span-5", speed: 6 },
  { src: "/community/c3.jpg", alt: "A Blue Bolt can held up against the sunset", cls: "md:col-span-3", speed: -6 },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const formatDate = (d: string) => {
  const [day, month] = d.split(".");
  return `${Number(day)} ${MONTHS[Number(month) - 1]}`;
};

export function Community() {
  const ref = useRef<HTMLElement>(null);
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
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id="community" data-pose="community" data-pose-hold className="relative py-28 md:py-36">
      {/* 1. Heading and the one action */}
      <div className="grid gap-8 md:grid-cols-12 md:items-end">
        <div className="md:col-span-7">
          <p data-reveal="fade" className="eyebrow">
            Zyro community
          </p>
          <h2 className="display mt-4 text-[16vw] md:text-[calc(var(--frame)*0.1)]">
            <span data-reveal="lines" className="block">
              Full on fun.
            </span>
            <span data-reveal="lines" data-reveal-delay="0.1" className="block opacity-60">
              Zero guilt.
            </span>
          </h2>
        </div>
        <div data-reveal="fade" className="md:col-span-5 md:pb-3">
          <p className="lead max-w-[36ch] text-lg leading-snug md:text-xl">
            Built by an artist, shared at the show. On Karan Aujla&rsquo;s 2026 tour, fans won tickets on Instagram and
            raised a Zyro in every city.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a
                href="https://www.instagram.com/zyroindia/"
                target="_blank"
                rel="noreferrer"
                data-cursor="Follow"
                className="eyebrow inline-flex items-center gap-2 rounded-full bg-fg px-6 py-4 text-bg"
              >
                Follow @zyroindia <span aria-hidden>↗</span>
              </a>
            </Magnetic>
            <p className="text-sm opacity-75">Tag us to get featured</p>
          </div>
        </div>
      </div>

      {/* 2. The tour, as dates you can read */}
      <div className="mt-20">
        <p data-reveal="fade" className="eyebrow mb-4 opacity-75">
          Tour stops, 2026
        </p>
        <ol className="grid grid-cols-2 border-t border-current/20 sm:grid-cols-3 md:grid-cols-6">
          {TOUR.map((t, i) => (
            <li
              key={t.city}
              data-reveal="fade"
              data-reveal-delay={String(i * 0.05)}
              className="border-b border-current/20 py-5 pr-4 md:border-b-0"
            >
              <p className="display text-4xl md:text-5xl">{formatDate(t.date)}</p>
              <p className="font-cond mt-1 text-lg font-semibold uppercase tracking-wide opacity-80">{t.city}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* 3. The photos */}
      <div className="mt-16 grid auto-rows-[40vw] grid-cols-2 gap-3 md:h-[min(72vh,760px)] md:auto-rows-auto md:grid-cols-12 md:grid-rows-2 md:gap-4">
        {PHOTOS.map((p) => (
          <figure key={p.src} className={`relative overflow-clip rounded-xl ${p.cls}`}>
            <div data-speed={p.speed} className="absolute -inset-[8%]">
              <Image src={p.src} alt={p.alt} fill sizes="(max-width: 768px) 50vw, 40vw" className="object-cover" />
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
