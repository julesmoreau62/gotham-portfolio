"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Edges, Environment, Float, Lightformer } from "@react-three/drei"
import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"

type MouseRef = React.MutableRefObject<{ x: number; y: number }>

function Shell({ mouse }: { mouse: MouseRef }) {
  const group = useRef<THREE.Group>(null)
  const core = useRef<THREE.Mesh>(null)
  const ringA = useRef<THREE.Mesh>(null)
  const ringB = useRef<THREE.Mesh>(null)
  const sats = useRef<THREE.Group>(null)

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    const d = Math.min(dt, 0.05)
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, mouse.current.x * 0.6 + t * 0.12, 2.5, d)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -mouse.current.y * 0.45, 2.5, d)
    g.position.x = THREE.MathUtils.damp(g.position.x, mouse.current.x * 0.18, 2, d)
    g.position.y = THREE.MathUtils.damp(g.position.y, mouse.current.y * 0.12, 2, d)
    if (core.current) core.current.rotation.z = t * 0.08
    if (ringA.current) ringA.current.rotation.z = t * 0.35
    if (ringB.current) ringB.current.rotation.z = -t * 0.22
    if (sats.current) sats.current.rotation.y = t * 0.5
  })

  const satPositions = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2
        return [Math.cos(a) * 2.35, Math.sin(a * 2) * 0.25, Math.sin(a) * 2.35] as [number, number, number]
      }),
    []
  )

  return (
    <group ref={group}>
      <Float speed={1.1} rotationIntensity={0.35} floatIntensity={0.7}>
        {/* Core shell */}
        <mesh ref={core}>
          <icosahedronGeometry args={[1.45, 1]} />
          <meshPhysicalMaterial
            color="#0d0d0d"
            metalness={0.92}
            roughness={0.16}
            clearcoat={1}
            clearcoatRoughness={0.08}
            iridescence={0.55}
            iridescenceIOR={1.35}
            envMapIntensity={1.8}
            flatShading
          />
          <Edges scale={1.004} threshold={12} color="#c8ff00" />
        </mesh>

        {/* Inner glowing core */}
        <mesh scale={0.42}>
          <icosahedronGeometry args={[1, 2]} />
          <meshBasicMaterial color="#c8ff00" wireframe transparent opacity={0.35} />
        </mesh>

        {/* Orbital rings */}
        <mesh ref={ringA} rotation={[Math.PI / 2.25, 0.2, 0]}>
          <torusGeometry args={[2.15, 0.006, 6, 200]} />
          <meshBasicMaterial color="#c8ff00" transparent opacity={0.8} />
        </mesh>
        <mesh ref={ringB} rotation={[Math.PI / 2.9, -0.6, 0.4]}>
          <torusGeometry args={[2.6, 0.004, 6, 220]} />
          <meshBasicMaterial color="#f2f1ec" transparent opacity={0.28} />
        </mesh>
        <mesh rotation={[0.4, 0.3, Math.PI / 2.4]}>
          <torusGeometry args={[1.85, 0.003, 6, 180]} />
          <meshBasicMaterial color="#ff2e88" transparent opacity={0.45} />
        </mesh>

        {/* Satellites */}
        <group ref={sats}>
          {satPositions.map((p, i) => (
            <mesh key={i} position={p}>
              <boxGeometry args={[0.06, 0.06, 0.06]} />
              <meshBasicMaterial color={i % 2 ? "#c8ff00" : "#f2f1ec"} />
            </mesh>
          ))}
        </group>
      </Float>
    </group>
  )
}

function Rig({ mouse }: { mouse: MouseRef }) {
  const { size } = useThree()
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [mouse])
  void size
  return null
}

export default function HeroArtifact({ className }: { className?: string }) {
  const mouse = useRef({ x: 0, y: 0 })
  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 6.4], fov: 34 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Rig mouse={mouse} />
        <Shell mouse={mouse} />
        <Environment resolution={256} frames={1}>
          <Lightformer intensity={5} color="#c8ff00" position={[-4, 3, -3]} scale={[5, 2.5, 1]} form="rect" />
          <Lightformer intensity={2.2} color="#ffffff" position={[4.5, 0.5, 2.5]} scale={[1, 7, 1]} form="rect" />
          <Lightformer intensity={1.4} color="#ff2e88" position={[0, -4.5, 2]} scale={[7, 1, 1]} form="rect" />
          <Lightformer intensity={0.8} color="#2ee6ff" position={[0, 4.5, 3]} scale={[3, 1, 1]} form="ring" />
        </Environment>
        <ambientLight intensity={0.15} />
      </Canvas>
    </div>
  )
}
