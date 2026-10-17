"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { CanRig } from "./canRig";
import { Fizz } from "./Fizz";
import { stage } from "@/lib/stage";

const mouthPos = new THREE.Vector3();
const centerPos = new THREE.Vector3();

/** Width of the content frame as a share of the viewport (matches --frame in globals.css) */
function frameRatio(w: number) {
  if (w >= 1024) return 0.8;
  return (w - (w >= 768 ? 80 : 40)) / w;
}

const MODEL = "/models/zyro-can.glb";

export function Can({ lowPower = false }: { lowPower?: boolean }) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL);
  const rig = useMemo(() => new CanRig(scene), [scene]);

  useEffect(() => rig.attach(lowPower ? 1024 : 2048), [rig, lowPower]);

  useFrame((state, dt) => {
    if (!outer.current || !inner.current) return;
    const cam = state.camera as THREE.PerspectiveCamera;
    const vh = 2 * cam.position.z * Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    // Horizontal poses are measured against the content frame, not the full window
    const vw = vh * (state.size.width / state.size.height) * frameRatio(state.size.width);
    rig.tick(outer.current, inner.current, state.clock.elapsedTime, dt, vw, vh);
    outer.current.getWorldPosition(centerPos).project(cam);
    stage.center.x = ((centerPos.x + 1) / 2) * state.size.width;
    stage.center.y = ((1 - centerPos.y) / 2) * state.size.height;
    rig.mouth.getWorldPosition(mouthPos).project(cam);
    stage.mouth.x = ((mouthPos.x + 1) / 2) * state.size.width;
    stage.mouth.y = ((1 - mouthPos.y) / 2) * state.size.height;
  });

  return (
    <group ref={outer}>
      <group ref={inner}>
        <primitive object={rig.root} />
        <Fizz lowPower={lowPower} />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL);
