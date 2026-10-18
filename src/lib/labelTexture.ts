import * as THREE from "three";
import { PRODUCTS, LINE_BY_ID, type Product } from "./products";

// Matches the Zyro_Label UVs in /models/zyro-can.glb:
// u = 0.5 faces the camera, v = 0 is the top edge (glTF convention, so flipY = false).
// Layout proportions are measured from the real Vita Cola label artwork.
export const LABEL_ASPECT = 8192 / 6288;

let markPromise: Promise<HTMLImageElement> | null = null;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function fontVar(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function tinted(img: HTMLImageElement, color: string) {
  const c = document.createElement("canvas");
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const x = c.getContext("2d")!;
  x.drawImage(img, 0, 0);
  x.globalCompositeOperation = "source-in";
  x.fillStyle = color;
  x.fillRect(0, 0, c.width, c.height);
  return c;
}

function badgeIcon(ctx: CanvasRenderingContext2D, p: Product, cx: number, cy: number, s: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = p.label.badgeFg;
  ctx.fillStyle = p.label.badgeFg;
  ctx.lineWidth = s * 0.06;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  if (p.line === "energy") {
    ctx.beginPath();
    ctx.moveTo(s * 0.14, -s * 0.5);
    ctx.lineTo(-s * 0.3, s * 0.07);
    ctx.lineTo(-s * 0.02, s * 0.07);
    ctx.lineTo(-s * 0.16, s * 0.5);
    ctx.lineTo(s * 0.32, -s * 0.09);
    ctx.lineTo(s * 0.04, -s * 0.09);
    ctx.closePath();
    ctx.fill();
  } else if (p.line === "indie") {
    ctx.beginPath();
    ctx.moveTo(s * 0.2, -s * 0.48);
    ctx.bezierCurveTo(s * 0.52, -s * 0.08, s * 0.44, s * 0.48, 0, s * 0.48);
    ctx.bezierCurveTo(-s * 0.44, s * 0.48, -s * 0.42, -s * 0.04, -s * 0.06, -s * 0.07);
    ctx.bezierCurveTo(s * 0.16, -s * 0.1, s * 0.24, -s * 0.3, s * 0.2, -s * 0.48);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, s * 0.2, s * 0.12, 0, Math.PI * 2);
    ctx.stroke();
  } else if (p.line === "skinny") {
    for (const [bx, by, r] of [
      [-0.22, 0.22, 0.16],
      [0.12, 0.2, 0.12],
      [0.3, -0.05, 0.15],
      [-0.02, -0.08, 0.1],
      [0.05, -0.38, 0.12],
      [-0.3, -0.25, 0.06],
    ]) {
      ctx.beginPath();
      ctx.arc(bx * s, by * s, r * s, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else {
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.48);
    ctx.bezierCurveTo(s * 0.42, 0, s * 0.38, s * 0.46, 0, s * 0.46);
    ctx.bezierCurveTo(-s * 0.38, s * 0.46, -s * 0.42, 0, 0, -s * 0.48);
    ctx.stroke();
  }
  ctx.restore();
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  const out: string[] = [];
  let cur = "";
  for (const w of text.split(" ")) {
    const t = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(t).width > maxW && cur) {
      out.push(cur);
      cur = w;
    } else cur = t;
  }
  out.push(cur);
  return out;
}

async function paintLabel(p: Product, width: number) {
  markPromise ??= loadImage("/brand/zyro-mark.png");
  const mark = await markPromise;

  const display = fontVar("--font-display", "Arial Narrow, sans-serif");
  await Promise.all(
    [`500 40px ${display}`, `600 40px ${display}`, `700 40px ${display}`].map((f) =>
      document.fonts.load(f),
    ),
  ).catch(() => {});

  const W = width;
  const H = Math.round(width / LABEL_ASPECT);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const L = p.label;
  const line = LINE_BY_ID[p.line];
  const font = (weight: number, size: number, family = display) =>
    (ctx.font = `${weight} ${Math.round(size * H)}px ${family}`);

  ctx.fillStyle = L.bg;
  ctx.fillRect(0, 0, W, H);

  // Vertical script logo: reads bottom to top, the swash runs off the top edge
  const logoLen = H * 0.956;
  const thick = logoLen * (mark.naturalHeight / mark.naturalWidth);
  ctx.save();
  ctx.translate(0, H * 0.73);
  ctx.rotate(-Math.PI / 2);
  ctx.drawImage(tinted(mark, L.logo), 0, W * 0.41 - thick * 0.44, logoLen, thick);
  ctx.restore();
  // Extend the swash to the very top
  ctx.fillStyle = L.logo;
  ctx.fillRect(W * 0.41 - thick * 0.017, 0, thick * 0.034, H * 0.1);

  // Badge hanging from the top edge, with a pinked bottom edge
  const bx = W * 0.468;
  const bw = W * 0.088;
  const bh = H * 0.215;
  ctx.fillStyle = L.badgeBg;
  ctx.beginPath();
  ctx.moveTo(bx, 0);
  ctx.lineTo(bx + bw, 0);
  ctx.lineTo(bx + bw, bh);
  const teeth = 14;
  for (let i = teeth; i >= 0; i--) {
    ctx.lineTo(bx + (bw * i) / teeth, bh + (i % 2 ? H * 0.006 : 0));
  }
  ctx.closePath();
  ctx.fill();
  badgeIcon(ctx, p, bx + bw * 0.5, bh * 0.33, bw * 0.5);
  ctx.fillStyle = L.badgeFg;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  font(600, 0.04);
  const [first, ...rest] = line.name.toUpperCase().split(" ");
  ctx.fillText(first, bx + bw * 0.08, bh * 0.76);
  ctx.fillText(rest.length ? `${rest.join(" ")}™` : "™", bx + bw * 0.08, bh * 0.93);

  // Fact block beside the badge
  ctx.fillStyle = L.text;
  const fx = W * 0.562;
  const fw = W * 0.168;
  const rows = [H * 0.11, H * 0.175, H * 0.24];
  rows.forEach((y) => ctx.fillRect(fx, y, fw, Math.max(1, H * 0.0016)));
  p.facts.forEach(([title, sub], i) => {
    font(500, 0.016);
    ctx.fillText(title, fx, rows[i] + H * 0.024);
    ctx.fillText(sub, fx, rows[i] + H * 0.05);
  });

  // Main copy column
  const cx = W * 0.465;
  const cw = W * 0.145;
  const ruleH = Math.max(2, H * 0.0024);
  ctx.fillRect(cx, H * 0.308, cw, ruleH);
  font(600, 0.04);
  ctx.fillText("ZERO SUGAR", cx, H * 0.365);
  ctx.fillRect(cx, H * 0.393, cw, ruleH);

  const nameLines = wrap(ctx, p.name.toUpperCase(), cw * 1.15);
  nameLines.forEach((l, i) => ctx.fillText(l, cx, H * 0.455 + i * H * 0.048));

  font(600, 0.04);
  ctx.fillText("ZERO CALORIES", cx, H * 0.73);
  ctx.fillRect(cx, H * 0.742, ctx.measureText("ZERO CALORIES").width, ruleH);

  font(500, 0.044);
  ctx.fillText(p.volume, cx, H * 0.815);
  ctx.fillRect(cx, H * 0.832, W * 0.265, Math.max(1, H * 0.0016));
  font(500, 0.016);
  ctx.globalAlpha = 0.85;
  ctx.fillText(`ZERO SUGAR · ZERO CALORIES · NOTHING UNNECESSARY`, cx, H * 0.858);
  ctx.fillText(`${line.name.toUpperCase()} BY ZYRO · MADE IN INDIA`, cx, H * 0.882);
  ctx.globalAlpha = 1;

  // Back of the can, following the layout of the supplied Vita Cola wrap:
  // "Why" panel, vertical claim strips, nutrition panel, and a logo + barcode on the seam.
  const ink = L.text;
  const hair = Math.max(1, H * 0.0016);
  ctx.fillStyle = ink;
  ctx.textAlign = "left";

  // Seam: a second vertical logo and the product name, wrapping across u = 0 / 1
  for (const shift of [-0.385, 0.615]) {
    // Smaller and higher than the front logo, clear of the barcode (as on the Vita wrap)
    const k = 0.6;
    ctx.save();
    ctx.translate(W * shift, H * 0.5);
    ctx.rotate(-Math.PI / 2);
    ctx.drawImage(tinted(mark, L.logo), 0, W * 0.41 - thick * k * 0.44, logoLen * k, thick * k);
    ctx.restore();
    ctx.fillStyle = ink;
    font(600, 0.032);
    ctx.fillText(p.name.toUpperCase(), W * (shift + 0.365), H * 0.56);
    // Barcode
    let bx = W * (shift + 0.36);
    for (let i = 0; i < 46; i++) {
      const w = ((i * 7919) % 3) + 1;
      if (i % 2 === 0) ctx.fillRect(bx, H * 0.69, w * W * 0.0011, H * 0.13);
      bx += w * W * 0.0011 + W * 0.0009;
    }
  }

  // "Why" panel
  const wx = W * 0.095;
  const ww = W * 0.135;
  font(600, 0.024);
  ctx.fillText(`WHY ${p.name.toUpperCase()}?`, wx, H * 0.07);
  font(400, 0.016);
  let wy = H * 0.1;
  for (const l of wrap(ctx, p.blurb, ww)) {
    ctx.fillText(l, wx, wy);
    wy += H * 0.022;
  }
  wy += H * 0.012;
  ctx.fillRect(wx, wy, ww, hair);
  wy += H * 0.035;
  for (const [title, sub] of p.facts) {
    font(600, 0.019);
    ctx.fillText(title, wx, wy);
    wy += H * 0.025;
    font(400, 0.015);
    for (const l of wrap(ctx, sub.charAt(0) + sub.slice(1).toLowerCase(), ww)) {
      ctx.fillText(l, wx, wy);
      wy += H * 0.021;
    }
    wy += H * 0.016;
  }
  ctx.fillRect(wx, wy, ww, hair);
  wy += H * 0.05;
  ctx.strokeStyle = ink;
  ctx.lineWidth = hair;
  ctx.textAlign = "center";
  ["RECYCLE ME", p.line === "hydrate" ? "PET" : "ALUMINIUM", "BEST COLD"].forEach((label, i) => {
    const cx = wx + ww * (0.16 + i * 0.34);
    ctx.beginPath();
    ctx.arc(cx, wy, H * 0.022, 0, Math.PI * 2);
    ctx.stroke();
    font(600, 0.014);
    ctx.fillText(i === 0 ? "♻" : i === 1 ? (p.line === "hydrate" ? "PET" : "alu") : "4°C", cx, wy + H * 0.006);
    font(400, 0.01);
    ctx.fillText(label, cx, wy + H * 0.042);
  });
  ctx.textAlign = "left";
  wy += H * 0.08;
  ctx.fillRect(wx, wy, ww, hair);
  font(400, 0.012);
  wy += H * 0.025;
  for (const l of wrap(ctx, `${line.name.toUpperCase()} BY ZYRO. CREATIVE VISUALIZATION. REFER PACK FOR MORE DETAILS.`, ww)) {
    ctx.fillText(l, wx, wy);
    wy += H * 0.018;
  }
  font(500, 0.018);
  ctx.fillText(p.volume, wx, wy + H * 0.025);

  // Vertical claim strips either side of the front
  ctx.fillRect(W * 0.26, H * 0.04, hair, H * 0.89);
  ctx.fillRect(W * 0.781, H * 0.04, hair, H * 0.89);
  const vertical = (text: string, x: number, size: number, weight: number) => {
    ctx.save();
    ctx.translate(x, H * 0.5);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    font(weight, size);
    ctx.fillText(text, 0, 0);
    ctx.restore();
  };
  vertical(`${line.name.toUpperCase()}™  •  ${p.volume}  •  SERVE ICE COLD`, W * 0.272, 0.016, 600);
  vertical("SHAKE IT UP — OPEN IT SLOW", W * 0.251, 0.011, 400);
  vertical(`ZERO SUGAR  •  ZERO CALORIES  •  ${p.name.toUpperCase()}`, W * 0.772, 0.016, 600);
  vertical(p.notes.join("  ·  ").toUpperCase(), W * 0.792, 0.011, 400);

  // Nutrition panel. Only claims the brand states: zero sugar, zero calories.
  const nx = W * 0.813;
  const nw = W * 0.133;
  ctx.fillStyle = L.badgeBg;
  ctx.fillRect(nx, 0, nw, H * 0.05);
  ctx.fillStyle = L.badgeFg;
  font(600, 0.017);
  ctx.fillText("NUTRITION INFORMATION", nx + nw * 0.04, H * 0.033);
  ctx.fillStyle = ink;
  let ny = H * 0.085;
  font(400, 0.013);
  ctx.fillText("Typical values", nx, ny);
  ctx.textAlign = "right";
  ctx.fillText(`per ${p.volume}`, nx + nw, ny);
  ctx.textAlign = "left";
  ny += H * 0.012;
  for (const [k, v] of [
    ["Energy", "0 kcal"],
    ["Sugars", "0 g"],
  ]) {
    ctx.fillRect(nx, ny, nw, hair);
    ny += H * 0.022;
    ctx.fillText(k, nx, ny);
    ctx.textAlign = "right";
    ctx.fillText(v, nx + nw, ny);
    ctx.textAlign = "left";
    ny += H * 0.008;
  }
  ctx.fillRect(nx, ny, nw, hair);
  ny += H * 0.022;
  font(400, 0.011);
  ctx.fillText("Full nutrition information on pack.", nx, ny);
  ny += H * 0.04;
  ctx.fillRect(nx, ny, nw, hair);
  ny += H * 0.03;
  font(600, 0.018);
  ctx.fillText("KEY INGREDIENTS", nx, ny);
  ny += H * 0.026;
  font(400, 0.014);
  for (const l of wrap(ctx, `${p.notes.join(", ")}. ${p.facts.map(([, sub]) => sub.charAt(0) + sub.slice(1).toLowerCase()).join(". ")}.`, nw)) {
    ctx.fillText(l, nx, ny);
    ny += H * 0.021;
  }
  ny += H * 0.02;
  ctx.fillRect(nx, ny, nw, hair);
  ny += H * 0.03;
  font(600, 0.018);
  ctx.fillText("STORAGE", nx, ny);
  ny += H * 0.026;
  font(400, 0.014);
  for (const l of wrap(ctx, "Store in a cool, dry place away from direct sunlight. Do not freeze. Best enjoyed chilled.", nw)) {
    ctx.fillText(l, nx, ny);
    ny += H * 0.021;
  }

  return canvas;
}

function toTexture(source: HTMLCanvasElement | HTMLImageElement) {
  const tex =
    source instanceof HTMLCanvasElement ? new THREE.CanvasTexture(source) : new THREE.Texture(source);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.flipY = false;
  tex.anisotropy = 8;
  tex.wrapS = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}

const cache = new Map<string, Promise<THREE.Texture>>();

export function getLabel(id: string, width = 2048) {
  const key = `${id}@${width}`;
  let t = cache.get(key);
  if (!t) {
    const p = PRODUCTS[id];
    t = (p.labelArt ? loadImage(p.labelArt) : paintLabel(p, width)).then(toTexture);
    cache.set(key, t);
  }
  return t;
}

/** Warm the cache in idle time so flavour switches are instant */
export function preloadLabels(ids: string[], width = 2048) {
  const run = (i: number) => {
    if (i >= ids.length) return;
    getLabel(ids[i], width).then(() => {
      const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 60));
      idle(() => run(i + 1));
    });
  };
  run(0);
}
