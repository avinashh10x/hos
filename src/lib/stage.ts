// A tiny mutable store shared by the DOM (GSAP, pointer handlers) and the
// R3F scene. Values are read every frame, so nothing here triggers React renders.

export type Pose = {
  /** Horizontal position as a fraction of half the viewport width (-1 left, 1 right) */
  x: number;
  /** Vertical position as a fraction of half the viewport height (-1 bottom, 1 top) */
  y: number;
  /** Can height as a fraction of viewport height */
  h: number;
  rx: number;
  ry: number;
  rz: number;
  /** 0 = can, 1 = Hydrate+ bottle */
  m: number;
};

type Listener = (id: string) => void;

export const stage = {
  pose: { x: 0, y: 0, h: 0.7, rx: 0, ry: 0, rz: 0, m: 0 } as Pose,
  variant: "vita-cola",
  /** Extra Y spin from dragging, in radians */
  spin: 0,
  spinVelocity: 0,
  /** Whether the current flavour change should turn the can once */
  pourTurn: true,
  /** performance.now() of the last drag step on the can */
  swipeAt: 0,
  /** True while a flavour change is turning the can, so drag-settling stays out of the way */
  turning: false,
  /** Extra can-to-bottle morph on hover, independent of scroll (0..1) */
  morphBoost: 0,
  /** Intro offset in viewport heights (negative = below), tweened by the hero entrance */
  drop: -1.2,
  /** Screen position of the can's opening, in CSS px, for the gas plume */
  mouth: { x: 0, y: 0 },
  /** Screen position of the can's centre, in CSS px, for the glow behind it */
  center: { x: 0, y: 0 },
  /** 0..1: hides fizz and condensation (the footer close-up) */
  quiet: 0,
  /** 0 closed .. 1 tab fully lifted */
  open: 0,
  /** Bubble emission strength, decays over time */
  fizz: 0,
  ready: false,
  listeners: new Set<Listener>(),
};

/** Click-and-drag on the can: it follows the drag directly, then keeps the momentum. */
export function dragSpin(dx: number) {
  if (stage.turning || !dx) return;
  stage.spin += dx * 0.012;
  stage.spinVelocity = Math.max(-10, Math.min(10, dx * 0.7));
  stage.swipeAt = performance.now();
}

/** Change flavour. Hover previews pass { turn: false } so hovering never rotates the can. */
export function setVariant(id: string, { turn = true }: { turn?: boolean } = {}) {
  if (stage.variant === id) return;
  stage.variant = id;
  stage.pourTurn = turn;
  stage.fizz = Math.max(stage.fizz, 0.8);
  stage.listeners.forEach((l) => l(id));
}

export function onVariant(fn: Listener) {
  stage.listeners.add(fn);
  return () => {
    stage.listeners.delete(fn);
  };
}
