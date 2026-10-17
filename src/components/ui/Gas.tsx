"use client";

import { useEffect, useRef } from "react";
import { stage } from "@/lib/stage";
import { prefersReducedMotion } from "@/lib/motion";

type Wisp = { x: number; y: number; vx: number; vy: number; r: number; age: number; life: number; sway: number };

const LIFE = 2.6; // seconds; everything is gone within 3s

/** A faint breath of gas from the can's opening: rises a little, then fades. */
export function Gas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || prefersReducedMotion()) return;
    const ctx = canvas.getContext("2d")!;
    let wisps: Wisp[] = [];
    let raf = 0;
    let last = 0;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      wisps = wisps.filter((w) => w.age < w.life);
      for (const w of wisps) {
        w.age += dt;
        w.vy *= Math.exp(-dt * 1.6);
        w.x += (w.vx + Math.sin(w.age * 2.2 + w.sway) * 10) * dt;
        w.y += w.vy * dt;
        w.r += dt * 22;
        const t = w.age / w.life;
        const alpha = 0.07 * Math.min(1, w.age * 5) * (1 - t) * (1 - t);
        const g = ctx.createRadialGradient(w.x, w.y, 0, w.x, w.y, w.r);
        g.addColorStop(0, `rgba(246,239,226,${alpha})`);
        g.addColorStop(1, "rgba(246,239,226,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (wisps.length) raf = requestAnimationFrame(frame);
    };

    const onGas = () => {
      for (let i = 0; i < 9; i++) {
        wisps.push({
          x: stage.mouth.x + (Math.random() - 0.5) * 16,
          y: stage.mouth.y - Math.random() * 10,
          vx: (Math.random() - 0.5) * 18,
          vy: -(70 + Math.random() * 60),
          r: 14 + Math.random() * 12,
          age: -i * 0.04,
          life: LIFE * (0.75 + Math.random() * 0.25),
          sway: Math.random() * 6,
        });
      }
      cancelAnimationFrame(raf);
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    window.addEventListener("zyro:gas", onGas);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("zyro:gas", onGas);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-[15] h-full w-full" aria-hidden />;
}
