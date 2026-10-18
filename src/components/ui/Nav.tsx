"use client";

import { useEffect, useRef } from "react";
import { gsap, scrollTo } from "@/lib/motion";
import { Magnetic } from "./Magnetic";

const LINKS = [
  { href: "#story", label: "Story" },
  { href: "#range", label: "The Range" },
  { href: "#community", label: "Community" },
];

export function Nav() {
  const ref = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide on scroll down, show on scroll up; progress bar tracks the page
    let last = 0;
    let hidden = false;
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      const hide = y > last && y > 200;
      if (hide !== hidden) {
        hidden = hide;
        gsap.to(ref.current, { yPercent: hide ? -110 : 0, duration: 0.6, ease: "expo.out" });
      }
      last = y;
    };
    const enter = () =>
      gsap.fromTo(ref.current, { yPercent: -110, autoAlpha: 1 }, { yPercent: 0, duration: 1.2, ease: "expo.out", delay: 0.5 });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("zyro:enter", enter);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("zyro:enter", enter);
    };
  }, []);

  return (
    <>
      {/* Hidden until the loader hands over (zyro:enter), so it never flashes in early */}
      <header ref={ref} className="fixed inset-x-0 top-0 z-50 text-fg" style={{ visibility: "hidden" }}>
        <nav className="frame-px flex items-center justify-between py-4 md:py-6">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollTo(0);
            }}
            aria-label="Zyro, back to top"
            className="mark-mask block h-9 w-[92px] md:h-11 md:w-[110px]"
          />
          <ul className="hidden items-center gap-9 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(l.href);
                  }}
                  className="eyebrow group relative py-2"
                >
                  {l.label}
                  <span className="absolute inset-x-0 bottom-0 h-px origin-right scale-x-0 bg-current transition-transform duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
          <Magnetic>
            <a
              href="#shop"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("#shop");
              }}
              data-cursor=""
              className="eyebrow inline-flex items-center gap-2 rounded-full bg-fg px-5 py-3 text-bg transition-colors"
            >
              Shop now <span aria-hidden>→</span>
            </a>
          </Magnetic>
        </nav>
      </header>
      <div className="fixed inset-x-0 top-0 z-[55] h-[2px]">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-accent" />
      </div>
    </>
  );
}
