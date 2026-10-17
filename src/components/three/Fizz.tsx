"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { stage } from "@/lib/stage";
import { PRODUCTS, type LineId } from "@/lib/products";

// Deterministic 0..1 noise so layouts are pure across renders
const rand = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// Glassy bubble: bright fresnel rim, one sharp highlight, nearly clear centre
const glass = (tint: string) =>
  new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uTint: { value: new THREE.Color(tint) }, uOpacity: { value: 1 } },
    vertexShader: /* glsl */ `
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        vec4 mv = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * mat3(instanceMatrix) * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uTint;
      uniform float uOpacity;
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        vec3 n = normalize(vN);
        float rim = pow(1.0 - abs(dot(n, normalize(vV))), 2.2);
        float spec = pow(max(dot(n, normalize(vec3(-0.45, 0.65, 0.6))), 0.0), 60.0);
        vec3 col = mix(uTint, vec3(1.0), 0.5) * rim + vec3(spec * 1.4);
        float a = clamp(rim * 0.85 + spec + 0.05, 0.0, 1.0) * uOpacity;
        gl_FragColor = vec4(col, a);
      }
    `,
  });

// How each line fizzes
const STYLE: Record<LineId, { speed: [number, number]; size: [number, number]; wobble: number; streams: number; tint: string }> = {
  energy: { speed: [0.9, 1.7], size: [0.004, 0.01], wobble: 0.018, streams: 0, tint: "#cfe8ff" },
  hydrate: { speed: [0.18, 0.4], size: [0.009, 0.02], wobble: 0.006, streams: 0, tint: "#dcfff3" },
  indie: { speed: [0.35, 0.75], size: [0.006, 0.015], wobble: 0.012, streams: 0, tint: "#ffe2b8" },
  skinny: { speed: [0.5, 0.95], size: [0.003, 0.008], wobble: 0.004, streams: 9, tint: "#ffffff" },
};

const AMBIENT = 0.22;

class Bubbles {
  private a: Float32Array;
  private y: Float32Array;
  private seed: Float32Array;
  private dummy = new THREE.Object3D();

  constructor(private count: number) {
    this.a = new Float32Array(count);
    this.y = new Float32Array(count);
    this.seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      this.a[i] = rand(i, 1) * Math.PI * 2;
      this.y[i] = -0.5 + rand(i, 3);
      this.seed[i] = rand(i, 4);
    }
  }

  tick(mesh: THREE.InstancedMesh, mat: THREE.ShaderMaterial, dt: number, t: number) {
    const product = PRODUCTS[stage.variant];
    const st = STYLE[product.line];
    stage.fizz = Math.max(AMBIENT, stage.fizz * Math.exp(-dt * 0.8));
    const f = stage.fizz * (1 - stage.quiet);
    mesh.visible = f > 0.01;
    if (!mesh.visible) return;
    (mat.uniforms.uTint.value as THREE.Color).lerp(new THREE.Color(st.tint), 1 - Math.exp(-dt * 3));

    const m = stage.pose.m;
    const top = 0.47 + m * 0.09;
    const radius = 0.2 - m * 0.02;
    const d = this.dummy;
    for (let i = 0; i < this.count; i++) {
      const k = this.seed[i];
      const speed = st.speed[0] + (st.speed[1] - st.speed[0]) * k;
      this.y[i] += speed * dt;
      if (this.y[i] > top) {
        this.y[i] = -0.5 - m * 0.08;
        this.a[i] = st.streams ? (Math.floor(rand(i, t) * st.streams) / st.streams) * Math.PI * 2 : Math.random() * Math.PI * 2;
      }
      const y = this.y[i];
      const wob = Math.sin(y * 18 + i * 1.7 + t * 2) * st.wobble;
      const r = radius + k * 0.03 + wob;
      d.position.set(Math.cos(this.a[i] + wob * 3) * r, y, Math.sin(this.a[i] + wob * 3) * r);
      // Only the most energetic share shows when fizz is low
      const visible = k < f ? 1 : 0;
      const grow = Math.min(1, (y + 0.5) * 6);
      const size = (st.size[0] + (st.size[1] - st.size[0]) * rand(i, 9)) * visible * grow;
      d.scale.setScalar(size);
      d.updateMatrix();
      mesh.setMatrixAt(i, d.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }
}

// Condensation on a cold can: flattened droplets stuck to the label, a few
// slowly running down. They evaporate as the can becomes the bottle.
class Condensation {
  private a: Float32Array;
  private y: Float32Array;
  private s: Float32Array;
  private run: Uint8Array;
  private dummy = new THREE.Object3D();
  private normal = new THREE.Vector3();

  constructor(private count: number) {
    this.a = new Float32Array(count);
    this.y = new Float32Array(count);
    this.s = new Float32Array(count);
    this.run = new Uint8Array(count);
    for (let i = 0; i < count; i++) {
      this.a[i] = rand(i, 11) * Math.PI * 2;
      this.y[i] = -0.42 + rand(i, 12) * 0.84;
      this.s[i] = 0.003 + Math.pow(rand(i, 13), 3) * 0.009;
      this.run[i] = rand(i, 14) < 0.1 ? 1 : 0;
    }
  }

  tick(mesh: THREE.InstancedMesh, dt: number) {
    const fade = (1 - Math.min(1, stage.pose.m * 1.6)) * (1 - stage.quiet);
    mesh.visible = fade > 0.01;
    if (!mesh.visible) return;
    const d = this.dummy;
    for (let i = 0; i < this.count; i++) {
      if (this.run[i]) {
        this.y[i] -= dt * (0.02 + this.s[i] * 4);
        if (this.y[i] < -0.43) this.y[i] = 0.42;
      }
      const x = Math.sin(this.a[i]) * 0.1888;
      const z = Math.cos(this.a[i]) * 0.1888;
      d.position.set(x, this.y[i], z);
      this.normal.set(x * 2, this.y[i], z * 2);
      d.lookAt(this.normal);
      const s = this.s[i] * fade;
      d.scale.set(s, s * (this.run[i] ? 1.9 : 1.2), s * 0.35);
      d.updateMatrix();
      mesh.setMatrixAt(i, d.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }
}

export function Fizz({ lowPower = false }: { lowPower?: boolean }) {
  const bubblesRef = useRef<THREE.InstancedMesh>(null);
  const dropsRef = useRef<THREE.InstancedMesh>(null);
  const nBubbles = lowPower ? 70 : 160;
  const nDrops = lowPower ? 70 : 170;
  const sim = useMemo(
    () => ({
      bubbles: new Bubbles(nBubbles),
      drops: new Condensation(nDrops),
      bubbleMat: glass("#ffffff"),
      dropMat: glass("#ffffff"),
    }),
    [nBubbles, nDrops],
  );

  useFrame((state, dt) => {
    if (bubblesRef.current) sim.bubbles.tick(bubblesRef.current, sim.bubbleMat, dt, state.clock.elapsedTime);
    if (dropsRef.current) sim.drops.tick(dropsRef.current, dt);
  });

  return (
    <>
      <instancedMesh ref={bubblesRef} args={[undefined, sim.bubbleMat, nBubbles]} frustumCulled={false}>
        <sphereGeometry args={[1, 12, 12]} />
      </instancedMesh>
      <instancedMesh ref={dropsRef} args={[undefined, sim.dropMat, nDrops]} frustumCulled={false}>
        <sphereGeometry args={[1, 10, 10]} />
      </instancedMesh>
    </>
  );
}
