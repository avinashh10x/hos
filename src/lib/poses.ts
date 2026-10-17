import type { Pose } from "./stage";

const TAU = Math.PI * 2;

const pose = (p: Partial<Pose> & Pick<Pose, "ry">): Pose => ({ x: 0, y: 0, h: 0.7, rx: 0, rz: 0, m: 0, ...p });

// Where the can sits for each section. Sections opt in with data-pose="name".
// ry only ever grows down the page, one whole turn per section, so the can
// always spins the same way and lands label-forward.
export const POSES: Record<string, Pose> = {
  hero: pose({ x: 0, y: 0.04, h: 0.62, rx: 0.08, ry: 0, rz: -0.28 }),
  subtract: pose({ x: 0.42, y: -0.06, h: 0.6, rx: 0.1, ry: TAU, rz: 0.12 }),
  founder: pose({ x: 0.64, y: -0.04, h: 0.7, rx: 0.04, ry: TAU * 2, rz: -0.12 }),
  lines: pose({ x: 0.72, y: 0.3, h: 0.44, rx: 0.35, ry: TAU * 3, rz: 0.4 }),
  energy: pose({ x: 0.36, y: -0.02, h: 0.8, rx: 0.03, ry: TAU * 4, rz: -0.06 }),
  hydrate: pose({ x: 0.36, y: -0.06, h: 0.66, rx: 0.03, ry: TAU * 5, rz: 0.05, m: 1 }),
  indie: pose({ x: -0.36, y: -0.02, h: 0.8, rx: 0.03, ry: TAU * 6, rz: 0.06 }),
  skinny: pose({ x: 0.36, y: -0.02, h: 0.8, rx: 0.03, ry: TAU * 7, rz: -0.06 }),
  zero: pose({ x: 0.4, y: -0.02, h: 0.82, rx: 0.02, ry: TAU * 8, rz: 0.1 }),
  community: pose({ x: 0.52, y: 0.02, h: 0.64, rx: 0.1, ry: TAU * 9, rz: 0.22 }),
  shop: pose({ x: -0.52, y: -0.02, h: 0.7, rx: 0.04, ry: TAU * 10, rz: -0.05 }),
  // Tipped toward the camera so you look down onto the lid while it cracks open
  footer: pose({ y: -0.68, h: 0.86, rx: 1.12, ry: TAU * 11, rz: 0 }),
};

// On narrow screens the can sits centred in the upper half, behind the copy.
export function mobilePose(name: string, p: Pose): Pose {
  switch (name) {
    case "hero":
      return { ...p, x: 0, y: 0, h: 0.34 };
    case "subtract":
      return { ...p, x: 0, y: -0.1, h: 0.42 };
    case "founder":
      return { ...p, x: 0.6, y: 0.74, h: 0.2 };
    case "community":
      return { ...p, x: 0.55, y: 0.7, h: 0.24 };
    // The shop grid is the hero on phones, so the can steps out of the way
    case "shop":
      return { ...p, x: 0.4, y: 1.8 };
    case "zero":
      return { ...p, x: 0.3, y: 0.38, h: 0.42 };
    case "footer":
      return { ...p, y: -0.2, h: 0.62 };
    default:
      return { ...p, x: p.x * 0.25, y: 0.34, h: p.h * 0.5 };
  }
}

export type Anchor = { at: number; pose: Pose };

/**
 * Read pose anchors from the DOM. A pose is reached as a section's top passes
 * 15% down the viewport, so the can is in place as the copy arrives.
 * Held sections keep the pose until their bottom reaches the viewport bottom.
 */
export function collectAnchors(mobile: boolean): Anchor[] {
  const vh = window.innerHeight;
  const out: Anchor[] = [];
  document.querySelectorAll<HTMLElement>("[data-pose]").forEach((el) => {
    const name = el.dataset.pose!;
    const base = POSES[name];
    if (!base) return;
    const p = mobile ? mobilePose(name, base) : base;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const h = el.offsetHeight;
    const arrive = Math.max(0, Math.min(top + h / 2 - vh / 2, top - vh * 0.15));
    if (el.dataset.poseHold !== undefined) {
      out.push({ at: arrive, pose: p }, { at: Math.max(arrive, top + h - vh), pose: p });
    } else {
      out.push({ at: arrive, pose: p });
    }
  });
  return out.sort((a, b) => a.at - b.at);
}

const ease = (t: number) => t * t * (3 - 2 * t);
export const POSE_KEYS = ["x", "y", "h", "rx", "ry", "rz", "m"] as const;

export function poseAt(anchors: Anchor[], y: number, out: Pose) {
  if (!anchors.length) return out;
  let i = 0;
  while (i < anchors.length - 1 && anchors[i + 1].at <= y) i++;
  const a = anchors[i];
  const b = anchors[Math.min(i + 1, anchors.length - 1)];
  const span = b.at - a.at;
  const t = span > 0 ? ease(Math.min(1, Math.max(0, (y - a.at) / span))) : 0;
  for (const k of POSE_KEYS) out[k] = a.pose[k] + (b.pose[k] - a.pose[k]) * t;
  return out;
}
