import * as THREE from "three";

type P = [r: number, y: number];

// Can profile, read ring by ring from Zyro_Can in /models/zyro-can.glb
// (the supplied model is a clean lathe, so this reproduces it exactly).
const CAN = {
  bottom: [
    [0, -0.462],
    [0.06, -0.463],
    [0.12, -0.468],
    [0.145, -0.478],
    [0.157, -0.489],
    [0.17, -0.49],
    [0.18, -0.486],
    [0.1855, -0.476],
    [0.1875, -0.465],
    [0.188, -0.4524],
  ] as P[],
  label: [
    [0.188, -0.4524],
    [0.188, 0.4573],
  ] as P[],
  top: [
    [0.188, 0.4573],
    [0.1866, 0.4645],
    [0.183, 0.472],
    [0.1795, 0.4775],
    [0.181, 0.483],
    [0.185, 0.4875],
    [0.1855, 0.4905],
    [0.182, 0.4928],
    [0.176, 0.4925],
    [0.17, 0.4895],
    [0.165, 0.482],
    [0.158, 0.47],
    [0.1525, 0.462],
    [0.15, 0.4585],
    [0, 0.4585],
  ] as P[],
};

// Hydrate+ 400ml bottle, traced from the product packshots: ribbed body,
// rounded shoulder, narrow neck. Taller than the can, as the real one is.
function ribbedBody(): P[] {
  const out: P[] = [];
  const y0 = -0.56;
  const y1 = 0.2;
  for (let i = 0; i <= 80; i++) {
    const t = i / 80;
    const y = y0 + (y1 - y0) * t;
    const rib = Math.pow(Math.sin(t * Math.PI * 6), 2) * 0.009;
    const taper = t > 0.86 ? (t - 0.86) * 0.11 : 0;
    out.push([0.172 - rib - taper, y]);
  }
  return out;
}

const BOTTLE = {
  bottom: [
    [0, -0.6],
    [0.05, -0.604],
    [0.1, -0.61],
    [0.128, -0.616],
    [0.148, -0.613],
    [0.162, -0.602],
    [0.169, -0.588],
    [0.172, -0.572],
    [0.172, -0.56],
  ] as P[],
  label: ribbedBody(),
  top: [
    [0.1566, 0.2],
    [0.145, 0.25],
    [0.125, 0.31],
    [0.1, 0.37],
    [0.082, 0.42],
    [0.074, 0.47],
    [0.072, 0.52],
    [0.081, 0.53],
    [0.082, 0.545],
    [0.074, 0.552],
    [0.066, 0.555],
    [0.062, 0.55],
    [0, 0.55],
  ] as P[],
};

/** Resample a polyline to n points spaced evenly by arc length. */
function resample(pts: P[], n: number): THREE.Vector2[] {
  const seg: number[] = [0];
  for (let i = 1; i < pts.length; i++) {
    seg.push(seg[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  }
  const total = seg[seg.length - 1];
  const out: THREE.Vector2[] = [];
  let k = 1;
  for (let i = 0; i < n; i++) {
    const d = (i / (n - 1)) * total;
    while (k < seg.length - 1 && seg[k] < d) k++;
    const t = (d - seg[k - 1]) / Math.max(1e-9, seg[k] - seg[k - 1]);
    out.push(
      new THREE.Vector2(
        pts[k - 1][0] + (pts[k][0] - pts[k - 1][0]) * t,
        pts[k - 1][1] + (pts[k][1] - pts[k - 1][1]) * t,
      ),
    );
  }
  out[0].set(Math.max(pts[0][0], 1e-4), pts[0][1]);
  return out;
}

const SEGMENTS = 128;

/**
 * One lathe that starts as the can and morphs into the bottle.
 * phiStart = -PI puts u = 0.5 facing +z, matching the Zyro_Label UVs.
 */
function morphLathe(can: P[], bottle: P[], n: number, flipV = false) {
  const a = new THREE.LatheGeometry(resample(can, n), SEGMENTS, -Math.PI);
  const b = new THREE.LatheGeometry(resample(bottle, n), SEGMENTS, -Math.PI);
  if (flipV) {
    const uv = a.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setY(i, 1 - uv.getY(i));
  }
  a.morphAttributes.position = [b.attributes.position];
  a.morphAttributes.normal = [b.attributes.normal];
  a.morphTargetsRelative = false;
  return a;
}

export function createMorphGeometry() {
  return {
    bottom: morphLathe(CAN.bottom, BOTTLE.bottom, 24),
    // The label texture expects v = 0 at the top edge
    label: morphLathe(CAN.label, BOTTLE.label, 96, true),
    top: morphLathe(CAN.top, BOTTLE.top, 48),
  };
}

export const BOTTLE_NECK_TOP = 0.555;
