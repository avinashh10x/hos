"use client";

import gsap from "gsap";
import { stage } from "./stage";

let ctx: AudioContext | null = null;

function audio() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function noise(ac: AudioContext, seconds: number) {
  const buf = ac.createBuffer(1, Math.ceil(ac.sampleRate * seconds), ac.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buf;
  return src;
}

/** A short metallic transient: the tab lever snapping the score line. */
function click(ac: AudioContext, at: number, freq: number, gain: number, length = 0.035) {
  const src = noise(ac, length);
  const bp = ac.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = freq;
  bp.Q.value = 2.5;
  const g = ac.createGain();
  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(gain, at + 0.002);
  g.gain.exponentialRampToValueAtTime(0.001, at + length);
  src.connect(bp).connect(g).connect(ac.destination);
  src.start(at);
}

/** Can opening: crack, pressure hiss, then a fading fizz. */
export function playOpen() {
  const ac = audio();
  const t = ac.currentTime + 0.01;

  click(ac, t, 2600, 0.9);
  click(ac, t + 0.045, 4200, 0.6, 0.025);
  click(ac, t + 0.012, 900, 0.5, 0.05);

  // Pssht: bright noise, filter sweeping down as the pressure drops
  const hiss = noise(ac, 0.9);
  const hp = ac.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 1500;
  const bp = ac.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = 0.7;
  bp.frequency.setValueAtTime(7000, t + 0.04);
  bp.frequency.exponentialRampToValueAtTime(2600, t + 0.8);
  const hg = ac.createGain();
  hg.gain.setValueAtTime(0, t + 0.035);
  hg.gain.linearRampToValueAtTime(0.55, t + 0.06);
  hg.gain.exponentialRampToValueAtTime(0.001, t + 0.85);
  hiss.connect(hp).connect(bp).connect(hg).connect(ac.destination);
  hiss.start(t + 0.035);

  // Fizz: sparse tiny pops thinning out
  const len = 1.6;
  const buf = ac.createBuffer(1, Math.ceil(ac.sampleRate * len), ac.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) {
    const p = 1 - i / d.length;
    if (Math.random() < 0.0035 * p) {
      const amp = (Math.random() * 0.8 + 0.2) * p;
      for (let k = 0; k < 40 && i + k < d.length; k++) d[i + k] += amp * Math.exp(-k / 6) * (Math.random() * 2 - 1);
    }
  }
  const fizz = ac.createBufferSource();
  fizz.buffer = buf;
  const fhp = ac.createBiquadFilter();
  fhp.type = "highpass";
  fhp.frequency.value = 3500;
  const fg = ac.createGain();
  fg.gain.value = 0.35;
  fizz.connect(fhp).connect(fg).connect(ac.destination);
  fizz.start(t + 0.15);
}

/** The tab pressed back down. */
export function playClose() {
  const ac = audio();
  const t = ac.currentTime + 0.01;
  click(ac, t, 1800, 0.35, 0.03);
  click(ac, t + 0.03, 3200, 0.2, 0.02);
}

let busy = false;

/**
 * Open the can with sound and a breath of gas, then close it again.
 * Returns false if a cycle is already running.
 */
export function crackOpen({ gas = true }: { gas?: boolean } = {}) {
  if (busy) return false;
  busy = true;
  playOpen();
  if (gas) window.dispatchEvent(new Event("zyro:gas"));
  gsap
    .timeline({ onComplete: () => void (busy = false) })
    .to(stage, { open: 1, duration: 0.3, ease: "back.out(2.4)" })
    .to(stage, { open: 0, duration: 0.45, ease: "power2.inOut", onStart: playClose }, "+=2.2");
  return true;
}
