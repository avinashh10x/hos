"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { Can } from "./Can";
import { stage, type Pose } from "@/lib/stage";
import { collectAnchors, poseAt, POSE_KEYS, type Anchor } from "@/lib/poses";

/** Turns scroll position into the can's target pose, with a little inertia. */
function Director({ mobile }: { mobile: boolean }) {
  const anchors = useRef<Anchor[]>([]);
  const target = useMemo<Pose>(() => ({ ...stage.pose }), []);

  useEffect(() => {
    const refresh = () => {
      anchors.current = collectAnchors(mobile);
    };
    refresh();
    const ro = new ResizeObserver(refresh);
    ro.observe(document.body);
    window.addEventListener("resize", refresh);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", refresh);
    };
  }, [mobile]);

  useFrame((_, dt) => {
    poseAt(anchors.current, window.scrollY, target);
    const k = 1 - Math.exp(-dt * 7);
    const p = stage.pose;
    for (const key of POSE_KEYS) {
      p[key] += (target[key] - p[key]) * k;
    }
  }, -1);

  return null;
}

function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <group rotation={[0, 0, 0]}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 4]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={4} position={[-4, 0, 2]} rotation-y={Math.PI / 2} scale={[1.2, 10, 1]} />
        <Lightformer form="rect" intensity={4} position={[4, 0, 2]} rotation-y={-Math.PI / 2} scale={[1.2, 10, 1]} />
        <Lightformer form="rect" intensity={1.5} position={[0, 0, -6]} scale={[12, 6, 1]} />
        <Lightformer form="ring" intensity={2} position={[2.5, 2.5, 3]} scale={1.5} />
      </group>
    </Environment>
  );
}

export default function Scene() {
  const mobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

  return (
    <Canvas
      style={{ position: "fixed", inset: 0, zIndex: 10, pointerEvents: "none" }}
      dpr={[1, mobile ? 1.5 : 2]}
      camera={{ position: [0, 0, 5], fov: 30 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} />
      <directionalLight position={[-4, -2, 2]} intensity={0.5} color="#ffd9c2" />
      <Director mobile={mobile} />
      <Suspense fallback={null}>
        <Can lowPower={mobile} />
        <Studio />
      </Suspense>
    </Canvas>
  );
}
