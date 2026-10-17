"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/motion";

// Dot + ring cursor. Elements with data-cursor="Label" grow the ring and show the label.
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {

    // Focus outlines only for keyboard users (some browsers show them after mouse clicks)
    const root = document.documentElement;
    const kbd = (e: KeyboardEvent) => {
      if (e.key === "Tab" || e.key === "Enter" || e.key === " " || e.key.startsWith("Arrow")) root.classList.add("kbd");
    };
    const mouse = () => root.classList.remove("kbd");
    window.addEventListener("keydown", kbd);
    window.addEventListener("pointerdown", mouse);

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cleanupBase = () => {
      window.removeEventListener("keydown", kbd);
      window.removeEventListener("pointerdown", mouse);
    };
    if (!fine || !dot.current || !ring.current) return cleanupBase;

    document.documentElement.classList.add("has-cursor");
    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3" });

    let current: string | null = null;
    const move = (e: PointerEvent) => {
      gsap.to([dot.current, ring.current], { autoAlpha: 1, duration: 0.3, overwrite: "auto" });
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button");
      const next = target ? (target.dataset.cursor ?? "") : null;
      if (next === current) return;
      current = next;
      if (label.current) label.current.textContent = next ?? "";
      gsap.to(ring.current, {
        width: next ? 96 : next === "" ? 56 : 34,
        height: next ? 96 : next === "" ? 56 : 34,
        backgroundColor: next ? "var(--fg)" : "rgba(0,0,0,0)",
        duration: 0.45,
        ease: "expo.out",
      });
      gsap.to(dot.current, { scale: next !== null ? 0 : 1, duration: 0.3 });
    };
    const leave = () => gsap.to([dot.current, ring.current], { autoAlpha: 0, duration: 0.3 });
    const down = () => gsap.to(ring.current, { scale: 0.85, duration: 0.2 });
    const up = () => gsap.to(ring.current, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.4)" });

    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      cleanupBase();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[70] flex h-[34px] w-[34px] items-center justify-center rounded-full border opacity-0 max-md:hidden"
        style={{ borderColor: "var(--fg)" }}
      >
        <span ref={label} className="eyebrow text-[0.7rem] tracking-[0.12em] text-bg" />
      </div>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[70] h-1.5 w-1.5 rounded-full bg-fg opacity-0 max-md:hidden"
      />
    </>
  );
}
