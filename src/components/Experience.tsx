"use client";

import dynamic from "next/dynamic";
import { LINES } from "@/lib/products";
import { SmoothScroll } from "./SmoothScroll";
import { Loader } from "./ui/Loader";
import { Cursor } from "./ui/Cursor";
import { Nav } from "./ui/Nav";
import { Gas } from "./ui/Gas";
import { Glow } from "./ui/Glow";
import { Hero } from "./sections/Hero";
import { Subtract } from "./sections/Subtract";
import { Founder } from "./sections/Founder";
import { RangeIntro, Chapter } from "./sections/Range";
import { Zero } from "./sections/Zero";
import { Community } from "./sections/Community";
import { Shop } from "./sections/Shop";
import { Footer } from "./sections/Footer";

// WebGL only runs in the browser
const Scene = dynamic(() => import("./three/Scene"), { ssr: false });

// Can on the right for these chapters, left for the rest
const CAN_RIGHT = new Set(["energy", "hydrate", "skinny"]);

export function Experience() {
  return (
    <>
      <a href="#content" className="skip-link eyebrow">
        Skip to content
      </a>
      <SmoothScroll />
      <Loader />
      <Cursor />
      <Nav />
      <Glow />
      <Scene />
      <Gas />
      <div className="grain" aria-hidden />
      {/* The whole site lives in one centred column (80% from laptop up); only the page colour bleeds */}
      <div className="frame">
      <main id="content" className="relative">
        <Hero />
        <Subtract />
        <Founder />
        <RangeIntro />
        {LINES.map((line, i) => (
          <Chapter key={line.id} line={line} index={i} side={CAN_RIGHT.has(line.id) ? "right" : "left"} />
        ))}
        <Zero />
        <Community />
        <Shop />
      </main>
      <Footer />
      </div>
    </>
  );
}
