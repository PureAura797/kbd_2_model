"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, Center, Float, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette, DepthOfField, ChromaticAberration } from "@react-three/postprocessing"
import { Suspense, useRef, useEffect, useState, useLayoutEffect, useMemo } from "react"
import * as THREE from "three"
import { Model } from "./Model"
import { ConfigState } from "@/lib/types"

function easeOutExpo(t: number) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t) }

/* ── Background + Fog ── */
function SceneBG() {
  const { scene } = useThree()

  useEffect(() => {
    scene.background = new THREE.Color("#0A0A0C")
    scene.fog = new THREE.FogExp2("#0A0A0C", 0.06)
    return () => { scene.fog = null }
  }, [scene])

  return null
}

/* ── Subtle floating dust ── */
function SubtleDust({ count = 60 }: { count?: number }) {
  const points = useRef<THREE.Points>(null)

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3)
    for(let i=0; i<count*3; i++) temp[i] = (Math.random() - 0.5) * 15
    return temp
  }, [count])

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.getElapsedTime() * 0.008
      points.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.01) * 0.02
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.01}
        color="#FFFFFF"
        transparent
        opacity={0.15}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/* ── Inner Scene ── */
function InnerScene({ config, scrollProgress, isReady }: {
  config: ConfigState, scrollProgress: number, isReady: boolean
}) {
  const animRef = useRef<THREE.Group>(null)
  const entryRef = useRef({ started: false, time: 0 })

  // Entry animation
  useFrame((state, delta) => {
    if (!animRef.current) return

    if (!isReady) {
      // Keep at minimal scale while not ready
      animRef.current.scale.setScalar(0.001)
      return
    }

    if (!entryRef.current.started) {
      entryRef.current.started = true
      entryRef.current.time = 0
    }

    entryRef.current.time += delta
    const t = Math.min(entryRef.current.time / 1.8, 1)
    const eased = easeOutExpo(t)

    // Scale in
    const currentScale = THREE.MathUtils.lerp(0.01, 1.0, eased)
    animRef.current.scale.setScalar(currentScale)

    // Scroll-driven rotation
    const baseY = scrollProgress * Math.PI * 2
    animRef.current.rotation.y = THREE.MathUtils.lerp(
      animRef.current.rotation.y,
      baseY,
      delta * 2
    )

    const targetTiltX = -0.15 + (scrollProgress * 0.1)
    animRef.current.rotation.x = THREE.MathUtils.lerp(
      animRef.current.rotation.x,
      targetTiltX,
      delta * 2
    )
  })

  useLayoutEffect(() => {
    if (animRef.current) animRef.current.scale.setScalar(0.001)
  }, [])

  return (
    <>
      <Environment preset="studio" blur={1.0} environmentIntensity={0.25} />
      <ambientLight intensity={0.015} color="#FFFFFF" />

      {/* Hero key light — warm top fill */}
      <spotLight
        position={[2, 12, 2]}
        intensity={60}
        color="#FFF8F0"
        angle={0.5}
        penumbra={0.6}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
        decay={2}
        distance={35}
      />

      {/* Cool fill light */}
      <directionalLight position={[-5, 4, 3]} intensity={0.15} color="#B0C0E0" />

      {/* Rim light */}
      <spotLight
        position={[-3, 5, -6]}
        intensity={50}
        color="#FFFFFF"
        angle={0.5}
        penumbra={1}
        decay={2}
      />

      {/* Subtle bottom fill — prevents pure black underside */}
      <directionalLight position={[0, -3, 2]} intensity={0.04} color="#8090B0" />

      {/* Product — no plinth, floating freely */}
      <Float speed={1.2} rotationIntensity={0.06} floatIntensity={0.12} floatingRange={[-0.01, 0.01]}>
        <group ref={animRef} position={[0, 0.5, 0]}>
          <Center>
            <Model config={config} />
          </Center>
        </group>
      </Float>

      <EffectComposer enableNormalPass={false} multisampling={4}>
        <Bloom luminanceThreshold={0.7} mipmapBlur intensity={0.5} />
        <DepthOfField target={[0, 0.5, 0]} focalLength={0.04} bokehScale={4} height={700} />
        <ChromaticAberration offset={new THREE.Vector2(0.0008, 0.0008)} />
        <Noise opacity={0.03} />
        <Vignette eskil={false} offset={0.05} darkness={1.1} />
      </EffectComposer>

      <SubtleDust />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.3}
        autoRotate
        autoRotateSpeed={0.12}
        target={[0, 0.5, 0]}
        makeDefault
        dampingFactor={0.04}
        enableDamping
      />
    </>
  )
}


export function Scene({ isReady, config, scrollProgress = 0 }: {
  isReady: boolean, config: ConfigState, scrollProgress: number
}) {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 1.0, 8], fov: 30 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
    >
      <Suspense fallback={null}>
        <SceneBG />
        <InnerScene config={config} scrollProgress={scrollProgress} isReady={isReady} />
      </Suspense>
    </Canvas>
  )
}
