import * as THREE from "three";
import gsap from "gsap";
import { getLabel, preloadLabels } from "@/lib/labelTexture";
import { ALL_PRODUCTS, PRODUCTS } from "@/lib/products";
import { stage, onVariant } from "@/lib/stage";
import { prefersReducedMotion } from "@/lib/motion";
import { createMorphGeometry, BOTTLE_NECK_TOP } from "./morphGeometry";

export const CAN_HEIGHT = 0.983;
const TAU = Math.PI * 2;

// The new label "pours" up from the bottom, with a foam line on top.
// v = 0 is the top of the label, so height is 1 - v.
const POUR_FRAGMENT = /* glsl */ `
#ifdef USE_MAP
  vec4 texA = texture2D( map, vMapUv );
  vec4 texB = texture2D( uMapB, vMapUv );
  float h = 1.0 - vMapUv.y;
  h += sin(vMapUv.x * 25.13 + uTime * 3.0) * 0.012 + sin(vMapUv.x * 56.5 - uTime * 4.2) * 0.006;
  float level = uMix * 1.24 - 0.12;
  float t = smoothstep(level - 0.004, level + 0.004, h);
  vec4 sampledDiffuseColor = mix(texB, texA, t);
  float pouring = step(0.0005, uMix) * step(uMix, 0.9995);
  float foam = (1.0 - smoothstep(0.0, 0.02, abs(h - level))) * pouring;
  sampledDiffuseColor.rgb = mix(sampledDiffuseColor.rgb, vec3(1.0), foam * 0.8);
  diffuseColor *= sampledDiffuseColor;
#endif
`;

const METAL = new THREE.Color("#dfe2e7");

/**
 * Owns the mutable three.js state for the can: geometry morph (can to bottle),
 * materials, the pour transition and the per-frame transform.
 * Kept outside React so the compiler leaves it alone.
 */
export class CanRig {
  readonly root = new THREE.Group();
  /** Sits in the can's opening; projected to screen for the gas plume */
  readonly mouth = new THREE.Object3D();
  private label: THREE.MeshPhysicalMaterial;
  private shell: THREE.MeshPhysicalMaterial;
  private capMat: THREE.MeshPhysicalMaterial;
  private morphMeshes: THREE.Mesh[] = [];
  private lid: THREE.Group;
  private cap: THREE.Group;
  private plastic = new THREE.Color("#ffffff");
  private uniforms = {
    uMapB: { value: null as THREE.Texture | null },
    uMix: { value: 0 },
    uTime: { value: 0 },
  };
  private tab: THREE.Object3D | null;
  private tabBase: number;
  private pending: THREE.Texture | null = null;
  private tween: gsap.core.Tween | null = null;
  private turn: gsap.core.Tween | null = null;
  private still = prefersReducedMotion();

  constructor(gltfScene: THREE.Object3D) {
    const uniforms = this.uniforms;
    this.label = new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      metalness: 0.35,
      roughness: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.15,
    });
    this.label.onBeforeCompile = (shader) => {
      Object.assign(shader.uniforms, uniforms);
      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          "#include <common>\nuniform sampler2D uMapB;\nuniform float uMix;\nuniform float uTime;",
        )
        .replace("#include <map_fragment>", POUR_FRAGMENT);
    };
    this.shell = new THREE.MeshPhysicalMaterial({ color: METAL, metalness: 1, roughness: 0.18, clearcoat: 0.5 });
    this.capMat = new THREE.MeshPhysicalMaterial({ color: "#79bf2b", roughness: 0.35, clearcoat: 0.6 });

    // Body: the supplied can's exact lathe profile, able to morph into the bottle
    const geo = createMorphGeometry();
    for (const [g, m] of [
      [geo.bottom, this.shell],
      [geo.label, this.label],
      [geo.top, this.shell],
    ] as const) {
      const mesh = new THREE.Mesh(g, m);
      mesh.morphTargetInfluences = [0];
      this.morphMeshes.push(mesh);
      this.root.add(mesh);
    }

    // Lid parts straight from the supplied model
    this.lid = new THREE.Group();
    for (const child of [...gltfScene.clone(true).children]) {
      if (child.name !== "Zyro_Can") this.lid.add(child);
    }
    this.root.add(this.lid);
    this.mouth.position.set(0, 0.47, -0.075);
    this.root.add(this.mouth);
    this.tab = this.lid.getObjectByName("Pull_Tab") ?? null;
    this.tabBase = this.tab?.rotation.x ?? 0;

    // Bottle cap: ridged cylinder that grows out of the neck during the morph
    this.cap = new THREE.Group();
    const ridges = new THREE.CylinderGeometry(0.086, 0.086, 0.1, 48, 1);
    const pos = ridges.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const a = Math.atan2(pos.getZ(i), pos.getX(i));
      const k = 1 + Math.cos(a * 48) * 0.035;
      pos.setX(i, pos.getX(i) * k);
      pos.setZ(i, pos.getZ(i) * k);
    }
    ridges.computeVertexNormals();
    const capBody = new THREE.Mesh(ridges, this.capMat);
    capBody.position.y = 0.05;
    const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.084, 0.088, 0.012, 48), this.capMat);
    capTop.position.y = 0.104;
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.016, 48), this.capMat);
    ring.position.y = -0.006;
    this.cap.add(capBody, capTop, ring);
    this.cap.position.y = BOTTLE_NECK_TOP - 0.03;
    this.cap.scale.setScalar(0);
    this.root.add(this.cap);

    if (process.env.NODE_ENV === "development") {
      (window as unknown as { __zyro: unknown }).__zyro = { rig: this, stage };
    }
  }

  /** Load the first label, then pour on every variant change. Returns a cleanup. */
  attach(width: number) {
    let alive = true;
    getLabel(stage.variant, width).then((tex) => {
      if (!alive) return;
      this.label.map = tex;
      this.label.needsUpdate = true;
      stage.ready = true;
      preloadLabels(
        ALL_PRODUCTS.map((p) => p.id),
        width,
      );
    });

    const off = onVariant(async (id) => {
      const tex = await getLabel(id, width);
      if (!alive || stage.variant !== id) return;
      this.pour(tex);
    });

    return () => {
      alive = false;
      this.tween?.kill();
      this.turn?.kill();
      off();
    };
  }

  private settle = () => {
    if (!this.pending) return;
    this.label.map = this.pending;
    this.uniforms.uMix.value = 0;
    this.pending = null;
  };

  private pour(tex: THREE.Texture) {
    this.tween?.kill();
    this.settle();
    if (!this.label.map) {
      this.label.map = tex;
      this.label.needsUpdate = true;
      return;
    }
    if (this.label.map === tex) return;
    this.pending = tex;
    this.uniforms.uMapB.value = tex;
    this.uniforms.uMix.value = 0;
    stage.fizz = Math.max(stage.fizz, 0.9);
    this.tween = gsap.to(this.uniforms.uMix, { value: 1, duration: 0.75, ease: "power2.inOut", onComplete: this.settle });

    // Exactly one forward turn, always the same direction (not for hover previews)
    if (this.still || !stage.pourTurn) return;
    this.turn?.kill();
    stage.spinVelocity = 0;
    stage.turning = true;
    const target = Math.ceil(stage.spin / TAU - 0.02) * TAU + TAU;
    this.turn = gsap.to(stage, {
      spin: target,
      duration: 0.85,
      ease: "power3.out",
      onComplete: () => {
        stage.turning = false;
      },
    });
  }

  /** Place the can from the stage pose. vh/vw are the visible world size at z = 0. */
  tick(outer: THREE.Object3D, inner: THREE.Object3D, t: number, dt: number, vw: number, vh: number) {
    this.uniforms.uTime.value = t;
    const p = stage.pose;
    const m = Math.min(1, Math.max(p.m, stage.morphBoost));
    // Reduced motion: no idle float, no spinning
    const live = this.still ? 0 : 1;
    const scale = (p.h * vh) / CAN_HEIGHT;
    outer.position.set((p.x * vw) / 2, (p.y * vh) / 2 + Math.sin(t * 1.1) * 0.02 * live, 0);
    outer.scale.setScalar(scale);
    // The intro rise, in outer-local units
    inner.position.y = (stage.drop * vh * live) / scale;
    // The mouse never moves the can; only dragging (dragSpin) turns it
    outer.rotation.set(p.rx, 0, p.rz + Math.sin(t * 0.7) * 0.02 * live);

    // While a drag is moving the can directly, leave the spin alone
    const swiping = performance.now() - stage.swipeAt < 90;
    if (!stage.turning && !swiping) {
      stage.spin += stage.spinVelocity * dt;
      stage.spinVelocity *= Math.exp(-dt * 2.4);
      // As a drag dies down, keep going the same way to the next whole turn
      if (Math.abs(stage.spinVelocity) < 0.8) {
        const dir = stage.spinVelocity < -0.01 ? Math.floor : Math.ceil;
        const goal = dir(stage.spin / TAU - (stage.spinVelocity < -0.01 ? -0.02 : 0.02)) * TAU;
        stage.spin += (goal - stage.spin) * (1 - Math.exp(-dt * 3));
      }
    }
    inner.rotation.y = this.still ? 0 : p.ry + stage.spin;

    // Can <-> bottle
    const s = m * m * (3 - 2 * m);
    for (const mesh of this.morphMeshes) mesh.morphTargetInfluences![0] = s;
    const product = PRODUCTS[stage.variant];
    this.plastic.lerp(new THREE.Color(product.label.bg), 1 - Math.exp(-dt * 6));
    this.shell.color.copy(METAL).lerp(this.plastic, s);
    this.shell.metalness = 1 - s * 0.92;
    this.shell.roughness = 0.18 + s * 0.12;
    this.label.metalness = 0.35 * (1 - s) + 0.04 * s;
    if (product.cap) this.capMat.color.lerp(new THREE.Color(product.cap), 1 - Math.exp(-dt * 6));

    const lidScale = 1 - Math.min(1, s * 2.2);
    this.lid.visible = lidScale > 0.001;
    this.lid.scale.set(lidScale, 1, lidScale);
    const capIn = Math.max(0, (s - 0.45) / 0.55);
    this.cap.scale.setScalar(capIn * capIn * (3 - 2 * capIn));
    this.cap.visible = capIn > 0.001;

    if (this.tab) this.tab.rotation.x = this.tabBase - stage.open * 1.15;

  }
}
