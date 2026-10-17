"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, useGSAP, SURFACES } from "@/lib/motion";
import { useReveal, useStageTrigger } from "../hooks";

// From the founder's letter on /pages/about-us
const LETTER =
  "India is home to me. No matter where life takes me, this is where everything began. When I decided to step into the beverage space, I didn't want to just put my name on anything. I wanted to build something I believe in, something I would confidently share with the people I love.";

export function Founder() {
  const ref = useRef<HTMLElement>(null);
  const letter = useRef<HTMLParagraphElement>(null);
  useStageTrigger(ref, { world: SURFACES.wine, variant: "vita-cola" });
  useReveal(ref);

  useGSAP(
    () => {
      document.fonts.ready.then(() => {
        if (!letter.current) return;
        const split = SplitText.create(letter.current, { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.16 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: letter.current, start: "top 70%", end: "bottom 50%", scrub: true },
          },
        );
      });
      // One scrubbed timeline owns the illustration, so its state depends only on
      // scroll position. Durations are in viewport heights of scroll: rise in,
      // hold while the section is pinned, sink out before the next section's colours.
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom top", scrub: 0.4 },
        })
        .fromTo("[data-karan]", { yPercent: 16, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5 })
        .to({}, { duration: 1.05 })
        .to("[data-karan]", { yPercent: 18, opacity: 0, duration: 0.4 })
        .to({}, { duration: 0.55 });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} data-pose="founder" data-pose-hold className="relative h-[170vh]">
      <div className="sticky top-0 z-20 flex h-svh items-center">
        <div
          data-karan
          className="pointer-events-none absolute bottom-0 left-0 hidden h-[86vh] w-[calc(var(--frame)*0.32)] md:block"
          aria-hidden
        >
          {/* The source artwork is cropped through the boots, so fade the feet into the floor */}
          <Image
            src="/brand/karan-cutout.png"
            alt=""
            fill
            sizes="30vw"
            className="object-contain object-bottom-left [mask-image:linear-gradient(to_top,transparent_0%,black_16%)]"
          />
        </div>

        <div className="relative md:ml-[calc(var(--frame)*0.31)] md:w-[calc(var(--frame)*0.4)]">
          <p data-reveal="fade" className="eyebrow mb-6 text-accent">
            A letter from the co-founder
          </p>
          <p ref={letter} className="serif text-[7.6vw] leading-[1.06] md:text-[calc(var(--frame)*0.031)]">
            {LETTER}
          </p>
          <div data-reveal="fade" className="mt-10 flex items-center gap-5">
            <span className="logo-mask block h-14 w-32 text-accent md:h-16 md:w-36" aria-hidden />
            <div>
              <p className="display text-2xl md:text-3xl">Karan Aujla</p>
              <p className="eyebrow opacity-60">Co-founder, Zyro</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
