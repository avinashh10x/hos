"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, SURFACES } from "@/lib/motion";
import { stage } from "@/lib/stage";
import { crackOpen } from "@/lib/canOpen";
import { useReveal, useStageTrigger } from "../hooks";
import { Magnetic } from "../ui/Magnetic";

const POLICIES = [
  { label: "Terms", href: "https://zyroindia.com/policies/terms-of-service" },
  { label: "Privacy", href: "https://zyroindia.com/policies/privacy-policy" },
  { label: "Shipping", href: "https://zyroindia.com/policies/shipping-policy" },
  { label: "Refunds", href: "https://zyroindia.com/policies/refund-policy" },
  { label: "Manufacturers", href: "https://zyroindia.com/pages/manufacturer-details" },
];

const SOCIAL = [
  { label: "Instagram", href: "https://www.instagram.com/zyroindia" },
  { label: "YouTube", href: "https://www.youtube.com/@Zyro_India" },
  { label: "X", href: "https://x.com/zyroindia" },
  { label: "Facebook", href: "https://www.facebook.com/Zyro.In/" },
];

// The last scene: the can tips toward you and cracks open.
export function Footer() {
  const ref = useRef<HTMLElement>(null);
  useStageTrigger(ref, { world: SURFACES.ink, variant: "masala-cola" });
  useReveal(ref);

  useGSAP(
    () => {
      // Close-up of the lid: no bubbles or droplets in this shot
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 60%",
        onToggle: (self) => {
          gsap.to(stage, { quiet: self.isActive ? 1 : 0, duration: 0.6, overwrite: "auto" });
        },
      });
    },
    { scope: ref },
  );

  return (
    <footer ref={ref} data-pose="footer" className="relative flex min-h-svh flex-col justify-between overflow-clip pb-6 pt-24 md:pt-28">
      <div className="relative z-20 text-center">
        <h2 className="display text-[18vw] md:text-[9.5vw]">
          <span data-reveal="chars" className="block">
            Crack one open
          </span>
        </h2>
        <p data-reveal="fade" className="serif mt-3 text-2xl italic opacity-80 md:text-3xl">
          A choice you can make for taste, guilt free.
        </p>
        <div data-reveal="fade" data-gas-ceiling className="mt-8">
          <Magnetic>
            <a
              href="https://zyroindia.com/pages/shop-all"
              target="_blank"
              rel="noreferrer"
              data-cursor="Shop"
              className="eyebrow inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-bg"
            >
              Shop the range <span aria-hidden>↗</span>
            </a>
          </Magnetic>
        </div>
      </div>

      <button
        type="button"
        onClick={() => crackOpen()}
        data-cursor="Open"
        aria-label="Open the can"
        className="absolute bottom-0 left-1/2 z-30 h-[40vh] w-[min(34vw,420px)] -translate-x-1/2 rounded-t-full max-md:w-[70vw]"
      />

      <div className="relative z-20 grid gap-8 text-sm md:grid-cols-[1fr_34vw_1fr] md:items-end">
        <div data-reveal="fade" className="space-y-1">
          <span className="logo-mask mb-5 block h-14 w-32 text-accent" aria-hidden />
          <a href="mailto:hello@zyroindia.com" className="block hover:text-accent">
            hello@zyroindia.com
          </a>
          <a href="tel:+911244653250" className="block hover:text-accent">
            0124-4653250
          </a>
          <p className="max-w-[30ch] pt-2 leading-relaxed opacity-60">
            DLF Centre Court, Golf Course Road, Sector 42, Gurugram 122002
          </p>
        </div>
        <div className="max-md:hidden" />
        <div data-reveal="fade" className="flex flex-col gap-6 md:items-end md:text-right">
          <ul className="flex flex-wrap gap-x-5 gap-y-1 md:justify-end">
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="font-cond text-lg font-semibold uppercase hover:text-accent">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 opacity-60 md:justify-end">
            {POLICIES.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="hover:text-accent hover:opacity-100">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-xs opacity-50">© 2026 VRB Consumer Products Pvt. Ltd.</p>
        </div>
      </div>
    </footer>
  );
}
