"use client"

import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  Environment,
  Center,
  Float,
  OrbitControls,
  ContactShadows,
  RoundedBox,
  MeshTransmissionMaterial
} from '@react-three/drei'
import {
  EffectComposer,
  Bloom,
  SMAA,
  DepthOfField,
  ChromaticAberration,
  Vignette,
  Noise,
  Scanline,
  Glitch
} from "@react-three/postprocessing"
import { BlendFunction } from "postprocessing"
import { Suspense, useRef, useEffect, useState } from "react"
import * as THREE from "three"
import { Model } from "./Model"
import { Annotations } from "./Annotations"
import { ConfigState } from "@/lib/types"
import { SPEC_POINTS } from "@/lib/specs"
import { useGPUStore } from "@/store/useGPUStore"
import type { QualitySettings } from "@/lib/gpu-detect"

/* ── Background — respects theme ── */
function SceneBG({ theme }: { theme: 'light' | 'dark' }) {
  const { scene } = useThree()

  useEffect(() => {
    const hex = theme === 'dark' ? '#0B0C10' : '#F2F2F0'
    scene.background = new THREE.Color(hex)
    scene.fog = new THREE.FogExp2(hex, 0.015)
    return () => { scene.fog = null }
  }, [scene, theme])

  return null
}

/* ── Frosted Glass Slab ── */
function FrostedGlassSlab({ theme, quality }: { theme: 'light' | 'dark', quality: QualitySettings }) {
  const isDark = theme === 'dark'
  
  return (
    <group position={[0, -0.5, 0]}>
      {/* 
        This is the frosted glass slab. 
        Uses TransmissionMaterial on high-tier GPUs,
        falls back to standard glass on medium/low.
      */}
      <RoundedBox args={[2.8, 0.01, 2.0]} radius={0.1} smoothness={4}>
        {quality.useTransmissionMaterial ? (
          <MeshTransmissionMaterial
            backside
            samples={4}
            thickness={0.02}
            roughness={isDark ? 0.3 : 0.15}
            chromaticAberration={0.05}
            anisotropy={0.3}
            distortion={0}
            color={isDark ? "#2A2C35" : "#FFFFFF"}
            resolution={quality.transmissionResolution}
            transmission={1}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        ) : (
          <meshPhysicalMaterial
            color={isDark ? "#2A2C35" : "#F8F8F8"}
            roughness={isDark ? 0.3 : 0.15}
            metalness={0.05}
            transmission={0.92}
            thickness={0.02}
            clearcoat={1}
            clearcoatRoughness={0.1}
            ior={1.5}
            transparent
            opacity={0.9}
          />
        )}
      </RoundedBox>
    </group>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   LIGHTING RIG METASYSTEM (6 MODES)
   ══════════════════════════════════════════════════════════════════════════ */

// 1. Hero Default (Classic Apple Studio)
function DefaultRig({ isDark }: { isDark: boolean }) {
  return (
    <>
      <spotLight position={[4, -4, -6]} intensity={180} color={isDark ? "#FFEEEE" : "#FFF5E8"} angle={0.6} penumbra={0.3} castShadow decay={2} distance={40} />
      <directionalLight position={[0, 2, 6]} intensity={isDark ? 0.05 : 0.15} color="#E0E8F5" />
    </>
  )
}

// 2. Window Blinds (Gobo)
function WindowBlindsRig({ isDark }: { isDark: boolean }) {
  return (
    <>
      <spotLight position={[-4, 8, 4]} intensity={250} color={isDark ? "#F5E6D3" : "#FFFFFF"} angle={0.8} penumbra={0.2} castShadow />;
      <group position={[-2, 5, 2]} rotation={[Math.PI / 4, 0, Math.PI / 4]}>
        {Array.from({ length: 14 }).map((_, i) => (
          // Physical blockers to create blinds shadow
          <mesh castShadow key={i} position={[0, i * 0.3 - 2, 0]}>
            <boxGeometry args={[10, 0.15, 0.01]} />
            <meshBasicMaterial color="black" />
          </mesh>
        ))}
      </group>
    </>
  )
}

// 3. Caustic Pool (Organic Water Refractions)
function CausticsRig({ isDark }: { isDark: boolean }) {
  const l1 = useRef<THREE.DirectionalLight>(null!)
  const l2 = useRef<THREE.DirectionalLight>(null!)
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (l1.current) { l1.current.position.x = Math.sin(t * 0.5) * 5; l1.current.position.z = Math.cos(t * 0.6) * 5; }
    if (l2.current) { l2.current.position.x = Math.cos(t * 0.4) * 5; l2.current.position.z = Math.sin(t * 0.7) * 5; }
  })
  
  return (
    <>
      <directionalLight ref={l1} intensity={1.5} color="#00e5ff" position={[0, 4, 0]} castShadow />
      <directionalLight ref={l2} intensity={1.5} color={isDark ? "#0055ff" : "#00aaff"} position={[0, 4, 0]} castShadow />
      <ambientLight intensity={isDark ? 0.05 : 0.1} color="#00aaff" />
    </>
  )
}

// 4. Ring Light
function RingLightRig({ isDark }: { isDark: boolean }) {
  return (
    <>
      <mesh position={[0, 3, 1]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.05, 32, 100]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <spotLight position={[0, 3, 1]} intensity={isDark ? 80 : 150} angle={1.2} penumbra={1} decay={2} castShadow />
    </>
  )
}

// 5. Mouse Tracking
function TrackingRig({ isDark }: { isDark: boolean }) {
  const lightRef = useRef<THREE.SpotLight>(null!)
  
  useFrame(({ pointer }) => {
    if (lightRef.current) {
      lightRef.current.target.position.x = THREE.MathUtils.lerp(lightRef.current.target.position.x, pointer.x * 5, 0.1)
      lightRef.current.target.position.z = THREE.MathUtils.lerp(lightRef.current.target.position.z, -pointer.y * 5, 0.1)
      lightRef.current.target.updateMatrixWorld()
    }
  })
  
  return (
    <>
      <spotLight ref={lightRef} position={[0, 6, 0]} intensity={isDark ? 150 : 250} angle={0.2} penumbra={0.5} castShadow />
      <primitive object={new THREE.Object3D()} ref={(n: THREE.Object3D) => {
        if (n && lightRef.current) lightRef.current.target = n
      }} position={[0,0,0]} />
    </>
  )
}

// 6. Breathing Light
function BreathingRig({ isDark }: { isDark: boolean }) {
  const lightRef = useRef<THREE.SpotLight>(null!)
  
  useFrame(({ clock }) => {
    if (lightRef.current) {
      const breathe = (Math.sin(clock.getElapsedTime() * 2) + 1) / 2
      lightRef.current.intensity = isDark ? 20 + breathe * 150 : 50 + breathe * 200
    }
  })
  
  return <spotLight ref={lightRef} position={[-2, 4, 4]} intensity={100} color={isDark ? "#ff4444" : "#ff8888"} angle={0.8} penumbra={0.5} castShadow />
}

// 7. Scroll-Driven Eclipse (Orbital)
function EclipseRig({ isDark }: { isDark: boolean }) {
  const lightRef = useRef<THREE.SpotLight>(null!)
  
  useFrame(() => {
    if (!lightRef.current) return
    const scrollY = window.scrollY || 0
    const max = document.body.scrollHeight - window.innerHeight
    const progress = max > 0 ? scrollY / max : 0
    
    // Orbital rotation from front right (-PI/4) to back behind (3*PI/4)
    const angle = -Math.PI / 4 + progress * Math.PI
    const radius = 6
    lightRef.current.position.x = Math.sin(angle) * radius
    lightRef.current.position.z = Math.cos(angle) * radius
  })
  
  return <spotLight ref={lightRef} position={[0, 2, 6]} intensity={isDark ? 150 : 250} color="#FFFFFF" angle={1} penumbra={0.2} castShadow />
}

// Orchestrator
function LightingRig({ config }: { config: ConfigState }) {
  const isDark = config.theme === 'dark'
  
  return (
    <>
      {/* Universal weak base */}
      <Environment preset="studio" blur={0.8} environmentIntensity={isDark ? 0.08 : 0.4} />
      <ambientLight intensity={isDark ? 0.02 : 0.1} color="#FFFFFF" />
      
      {config.lightingMode === 'blinds' && <WindowBlindsRig isDark={isDark} />}
      {config.lightingMode === 'caustics' && <CausticsRig isDark={isDark} />}
      {config.lightingMode === 'ring' && <RingLightRig isDark={isDark} />}
      {config.lightingMode === 'tracking' && <TrackingRig isDark={isDark} />}
      {config.lightingMode === 'breathing' && <BreathingRig isDark={isDark} />}
      {config.lightingMode === 'eclipse' && <EclipseRig isDark={isDark} />}
      {config.lightingMode === 'default' && <DefaultRig isDark={isDark} />}
    </>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   CAMERA PRESETS & POSTPROCESSING (FX LAB)
   ══════════════════════════════════════════════════════════════════════════ */

// Camera presets: position + target in world space
import type { CameraPreset } from "@/lib/types"

interface PresetDef {
  position: [number, number, number]
  target: [number, number, number]
  label: string
}

const CAMERA_PRESETS: Record<CameraPreset, PresetDef> = {
  hero:      { position: [-3, 2, 6],    target: [0, 0, 0], label: '3/4 Hero' },
  front:     { position: [0, 0.5, 7],   target: [0, 0, 0], label: 'Front' },
  top:       { position: [0, 8, 0.5],   target: [0, 0, 0], label: 'Top-Down' },
  low:       { position: [3, -1, 6],    target: [0, 0.5, 0], label: 'Low Angle' },
  side:      { position: [7, 0.5, 0],   target: [0, 0, 0], label: 'Side Profile' },
  isometric: { position: [5, 5, 5],     target: [0, 0, 0], label: 'Isometric' },
}

export { CAMERA_PRESETS }

function CameraRig({ config }: { config: ConfigState }) {
  const { activeFx, activeSpec, cameraPreset, cameraFov } = config
  const isSettling = useRef(false)
  const { controls, camera } = useThree()
  
  // Ref for the target we want orbitControls to look at
  const orbitTarget = useRef(new THREE.Vector3(0, 0, 0))
  // Ref for desired camera position
  const desiredPos = useRef(new THREE.Vector3(-3, 2, 6))
  // Track if we're in preset transition
  const isTransitioning = useRef(false)
  const transitionProgress = useRef(1)

  // When preset changes, start transition
  const lastPreset = useRef(cameraPreset)
  
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const hasKinematic = activeFx.dutchAngle || activeFx.dollyZoom || activeFx.cameraShake
    const presetDef = CAMERA_PRESETS[cameraPreset]
    
    // ── PRESET TRANSITION ──
    if (lastPreset.current !== cameraPreset) {
      lastPreset.current = cameraPreset
      isTransitioning.current = true
      transitionProgress.current = 0
    }
    
    if (isTransitioning.current) {
      transitionProgress.current = Math.min(transitionProgress.current + delta * 1.0, 1)
      if (transitionProgress.current >= 1) {
        isTransitioning.current = false
      }
    }

    // ── HOTSPOT FOCUS LOGIC ──
    const currentSpec = SPEC_POINTS.find(s => s.id === activeSpec)
    if (currentSpec) {
      orbitTarget.current.set(...currentSpec.target)
    } else {
      // Lerp to preset's target
      const pt = presetDef.target
      orbitTarget.current.lerp(new THREE.Vector3(pt[0], pt[1], pt[2]), delta * 1.5)
    }

    // Smoothly lerp OrbitControls target
    if (controls && (controls as any).target) {
      (controls as any).target.lerp(orbitTarget.current, delta * 2)
    }

    // ── CAMERA POSITION (preset-driven) ──
    if (!currentSpec && isTransitioning.current) {
      // Smooth transition to preset position
      const pp = presetDef.position
      desiredPos.current.lerp(new THREE.Vector3(pp[0], pp[1], pp[2]), delta * 1.5)
      state.camera.position.lerp(desiredPos.current, delta * 2)
    }

    // ── FOV CONTROL ──
    if (state.camera instanceof THREE.PerspectiveCamera) {
      const targetFov = currentSpec 
        ? 18  // Macro focus for specs
        : activeFx.dollyZoom 
          ? cameraFov + Math.sin(t * 0.8) * 15  // Dolly zoom oscillation around user FOV
          : cameraFov  // User-selected FOV
      
      state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, targetFov, delta * 1.5)
      state.camera.updateProjectionMatrix()
    }

    if (!hasKinematic && !isSettling.current && !currentSpec && !isTransitioning.current) return

    // Dutch Angle
    if (activeFx.dutchAngle) {
      state.camera.rotation.z = THREE.MathUtils.lerp(state.camera.rotation.z, state.pointer.x * 0.2, 0.1)
      isSettling.current = true
    } else if (isSettling.current) {
      state.camera.rotation.z = THREE.MathUtils.lerp(state.camera.rotation.z, 0, 0.1)
    }

    // Dolly Zoom (FOV oscillation handled above)
    if (activeFx.dollyZoom) {
      isSettling.current = true
    }

    // Handheld Shake
    if (activeFx.cameraShake) {
       const shakeX = (Math.sin(t * 5.1) * 0.05 + Math.cos(t * 3.2) * 0.03) * 0.2
       const shakeY = (Math.sin(t * 4.6) * 0.05 + Math.sin(t * 6.3) * 0.03) * 0.2
       state.camera.translateX(shakeX)
       state.camera.translateY(shakeY)
       isSettling.current = true
    }

    // Check if settled
    if (!hasKinematic && isSettling.current && !currentSpec) {
      if (Math.abs(state.camera.rotation.z) < 0.005 && state.camera instanceof THREE.PerspectiveCamera && Math.abs(state.camera.fov - cameraFov) < 0.1) {
        state.camera.rotation.z = 0
        state.camera.fov = cameraFov
        state.camera.updateProjectionMatrix()
        isSettling.current = false
      }
    }
  })

  return null
}

function FXRig({ config, quality }: { config: ConfigState, quality: QualitySettings }) {
  const { activeFx } = config
  
  const focusTarget = useRef(new THREE.Vector3(0,0,0))
  useFrame(({ pointer, raycaster, scene, camera }) => {
    if (quality.enableDOF && activeFx.mouseFocus) {
      raycaster.setFromCamera(pointer, camera)
      const intersects = raycaster.intersectObjects(scene.children, true)
      if (intersects.length > 0) {
        focusTarget.current.lerp(intersects[0].point, 0.1)
      } else {
        focusTarget.current.lerp(new THREE.Vector3(0,0,0), 0.05)
      }
    }
  })

  // On low tier — skip EffectComposer entirely
  if (!quality.enableBloom && !quality.enableSMAA && !quality.enableDOF) {
    return null
  }

  return (
    <EffectComposer enableNormalPass={false} multisampling={quality.multisampling}>
      {quality.enableBloom ? (
        <Bloom luminanceThreshold={0.92} mipmapBlur intensity={0.1} />
      ) : <></>}
      {quality.enableSMAA ? <SMAA /> : <></>}
      
      {(quality.enableDOF && activeFx.macroFocus && !activeFx.mouseFocus) ? (
        <MacroFocusDOF activeSpec={config.activeSpec} />
      ) : <></>}
      
      {(quality.enableDOF && activeFx.mouseFocus) ? (
        <MouseFocusDOF />
      ) : <></>}
      
      {(quality.enableDOF && activeFx.breathingFocus && !activeFx.macroFocus && !activeFx.mouseFocus) ? (
        <BreathingDOF />
      ) : <></>}
      
      {/* Stylized FX */}
      {activeFx.chromaticAberration ? (
        <AnimatedChroma />
      ) : <></>}
      
      {activeFx.vignette ? (
        <Vignette eskil={false} offset={0.1} darkness={1.2} blendFunction={BlendFunction.NORMAL} />
      ) : <></>}
      
      {activeFx.scanline ? (
        <Scanline density={1.2} blendFunction={BlendFunction.OVERLAY} />
      ) : <></>}
      
      {activeFx.glitch ? (
        <Glitch delay={new THREE.Vector2(1.5, 3.5)} duration={new THREE.Vector2(0.1, 0.3)} strength={new THREE.Vector2(0.1, 0.5)} />
      ) : <></>}
      
      {activeFx.noise ? (
        <Noise opacity={0.3} blendFunction={BlendFunction.OVERLAY} />
      ) : <></>}
      
      {activeFx.scrollBlur ? (
        <MotionBlurFX />
      ) : <></>}
    </EffectComposer>
  )
}

function AnimatedChroma() {
  const offset = useRef(new THREE.Vector2(0, 0))
  useFrame((state) => {
    const t = state.clock.elapsedTime
    const amount = 0.003 + Math.sin(t * 3) * 0.002
    offset.current.set(amount, amount * 0.5)
  })
  return <ChromaticAberration offset={offset.current} radialModulation={false} />
}

function MotionBlurFX() {
  const offset = useRef(new THREE.Vector2(0, 0))
  const lastPos = useRef(new THREE.Vector2(0, 0))
  useFrame((state) => {
    const dx = state.pointer.x - lastPos.current.x
    const dy = state.pointer.y - lastPos.current.y
    const vel = Math.abs(dx) + Math.abs(dy)
    lastPos.current.set(state.pointer.x, state.pointer.y)
    
    const target = Math.min(vel * 0.4, 0.04)
    offset.current.x = THREE.MathUtils.lerp(offset.current.x, target, 0.1)
    offset.current.y = THREE.MathUtils.lerp(offset.current.y, target, 0.1)
  })
  return <ChromaticAberration offset={offset.current} />
}

/* ─── MACRO FOCUS ───────────────────────────────────────────────────────────
   Product photography style: entire controller sharp, background softly blurred.
   Pass initial target to create Vector3, then mutate via ref each frame. */
function MacroFocusDOF({ activeSpec }: { activeSpec: string | null }) {
  const dofRef = useRef<any>(null)
  const initTarget = useRef(new THREE.Vector3(0, 0, 0))
  
  useFrame((state, delta) => {
    if (!dofRef.current?.target) return
    
    if (activeSpec) {
      const spec = SPEC_POINTS.find(s => s.id === activeSpec)
      if (spec) {
        dofRef.current.target.lerp(new THREE.Vector3(...spec.target), delta * 4)
      }
    } else {
      dofRef.current.target.lerp(new THREE.Vector3(0, 0, 0), delta * 3)
    }
  })
  
  const focalLength = activeSpec ? 0.2 : 0.5
  const bokehScale = activeSpec ? 3 : 2
  
  return <DepthOfField ref={dofRef} target={initTarget.current} focalLength={focalLength} bokehScale={bokehScale} focusDistance={0} />
}

/* ─── BREATHING DOF ────────────────────────────────────────────────────────
   Cinematic lens breathing: bokehScale OSCILLATES over time via ref. */
function BreathingDOF() {
  const dofRef = useRef<any>(null)
  const initTarget = useRef(new THREE.Vector3(0, 0, 0))
  
  useFrame((state) => {
    if (!dofRef.current?.target) return
    const t = state.clock.elapsedTime
    
    dofRef.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.05)
    
    // BREATHING: oscillate bokehScale so blur visibly pulses
    const breathCycle = Math.sin(t * 1.5)
    dofRef.current.bokehScale = 2.5 + breathCycle * 2.0
    
    if (dofRef.current.circleOfConfusionMaterial) {
      dofRef.current.circleOfConfusionMaterial.uniforms.focalLength.value = 0.35 + breathCycle * 0.2
    }
  })
  
  return <DepthOfField ref={dofRef} target={initTarget.current} focalLength={0.35} bokehScale={2.5} focusDistance={0} />
}

/* ─── MOUSE FOCUS DOF ──────────────────────────────────────────────────────
   Interactive: sharp zone follows cursor via raycast.
   Mutates effect.target via ref so focus ACTUALLY tracks the mouse. */
function MouseFocusDOF() {
  const dofRef = useRef<any>(null)
  const initTarget = useRef(new THREE.Vector3(0, 0, 0))
  
  useFrame(({ raycaster, scene, camera, pointer }) => {
    if (!dofRef.current?.target) return
    
    raycaster.setFromCamera(pointer, camera)
    
    const intersects = raycaster.intersectObjects(scene.children, true)
      .filter(hit => hit.object.name !== 'pedestal_base' && hit.object.name !== 'pedestal_glow')
      
    if (intersects.length > 0) {
      dofRef.current.target.lerp(intersects[0].point, 0.3)
    } else {
      dofRef.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.05)
    }
  })
  
  return <DepthOfField ref={dofRef} target={initTarget.current} focalLength={0.03} bokehScale={5} focusDistance={0} />
}

/* ── Subtle idle animation ── */
function IdleAnimation({ groupRef }: { groupRef: React.RefObject<THREE.Group> }) {
  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.getElapsedTime()

    // Majestic slow breathing rotation
    groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.08
    groupRef.current.rotation.x = -0.05 + Math.sin(time * 0.06) * 0.04
    groupRef.current.rotation.z = Math.sin(time * 0.05) * 0.02
  })

  return null
}





/* ── Pedestal System ── */
function Pedestal({ config, quality }: { config: ConfigState, quality: QualitySettings }) {
  if (config.standMode === 'void' || config.standMode === 'quantum') {
     return (
        <group position={[0, -0.495, 0]}>
         <mesh rotation={[-Math.PI / 2, 0, 0]}>
           <ringGeometry args={[1.6, 1.62, 64]} />
           <meshBasicMaterial color={config.theme === 'dark' ? '#333' : '#ccc'} transparent opacity={0.4} />
         </mesh>
         <mesh rotation={[-Math.PI / 2, 0, 0]}>
           <circleGeometry args={[1.6, 64]} />
           <meshBasicMaterial color={config.theme === 'dark' ? '#000' : '#aaa'} transparent opacity={0.1} />
         </mesh>
        </group>
     )
  }
  if (config.standMode === 'monolith') {
     return (
       <group position={[0, -5.5, 0]}>
         {/* A massive deep plinth reaching into the floor */}
         <RoundedBox args={[3.2, 10, 2.4]} radius={0.15} smoothness={4}>
           <meshStandardMaterial 
             color={config.theme === 'dark' ? '#050505' : '#111111'} 
             roughness={0.15} 
             metalness={0.8} 
             envMapIntensity={2} 
           />
         </RoundedBox>
       </group>
     )
  }
  // Default: glass (quality-aware)
  return <FrostedGlassSlab theme={config.theme} quality={quality} />
}

/* ── Animated Pedestal Wrapper ── */
function AnimatedPedestal({ config, quality }: { config: ConfigState, quality: QualitySettings }) {
  const ref = useRef<THREE.Group>(null!)
  const posY = useRef(0)
  const fade = useRef(1)
  const baseOpacitiesStored = useRef(false)
  
  useFrame((_, delta) => {
    if (!ref.current) return
    
    // Store base opacities on first frame (once)
    if (!baseOpacitiesStored.current) {
      ref.current.traverse((child) => {
        const mesh = child as THREE.Mesh
        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          mats.forEach((mat) => {
            if (mat.userData._baseOpacity === undefined) {
              mat.userData._baseOpacity = mat.opacity ?? 1
              mat.transparent = true
            }
          })
        }
      })
      baseOpacitiesStored.current = true
    }
    
    // Lerp targets
    const targetY = config.freeOrbit ? -1.5 : 0
    const targetFade = config.freeOrbit ? 0 : 1
    
    posY.current = THREE.MathUtils.lerp(posY.current, targetY, delta * 1.0)
    fade.current = THREE.MathUtils.lerp(fade.current, targetFade, delta * 1.2)
    
    // Apply position
    ref.current.position.y = posY.current
    
    // Apply opacity to all materials
    ref.current.traverse((child) => {
      const mesh = child as THREE.Mesh
      if (mesh.material) {
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
        mats.forEach((mat) => {
          if (mat.userData._baseOpacity !== undefined) {
            mat.opacity = mat.userData._baseOpacity * fade.current
          }
        })
      }
    })
    
    // Hide when fully faded to save GPU
    ref.current.visible = fade.current > 0.005
  })
  
  return (
    <group ref={ref}>
      <Pedestal config={config} quality={quality} />
    </group>
  )
}

/* ── Animated Contact Shadows ── */
function AnimatedShadows({ config, quality }: { config: ConfigState, quality: QualitySettings }) {
  const ref = useRef<THREE.Group>(null!)
  const currentOpacity = useRef(config.theme === 'dark' ? 0.7 : 0.45)
  
  useFrame((_, delta) => {
    const targetOpacity = config.freeOrbit ? 0 : (config.theme === 'dark' ? 0.7 : 0.45)
    currentOpacity.current = THREE.MathUtils.lerp(currentOpacity.current, targetOpacity, delta * 1.2)
    
    // Update the shadow mesh opacity directly
    if (ref.current) {
      ref.current.traverse((child) => {
        if ((child as THREE.Mesh).material && 'opacity' in (child as THREE.Mesh).material) {
          const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial
          mat.opacity = currentOpacity.current
        }
      })
    }
  })

  if (!quality.enableContactShadows) return null
  
  return (
    <group ref={ref}>
      <ContactShadows
        key={`shadow-${config.standMode}-${config.lightingMode}`}
        position={[0, -0.49, 0]}
        opacity={config.theme === 'dark' ? 0.7 : 0.45}
        scale={config.standMode === 'void' || config.standMode === 'quantum' ? 4 : 6}
        blur={config.standMode === 'void' || config.standMode === 'quantum' ? 1.0 : 2.5}
        far={6}
        frames={1}
        resolution={quality.contactShadowResolution}
        color="#000000"
      />
    </group>
  )
}

/* ── Inner Scene ── */
/* ── Smooth Orbit Limits — only lerps constraints, lets OrbitControls damping move the camera ── */
function SmoothOrbitLimits({ config }: { config: ConfigState }) {
  const { controls } = useThree()
  const wasFreeOrbit = useRef(config.freeOrbit)
  
  // Lerped limit values
  const minPolar = useRef(config.freeOrbit ? 0 : Math.PI / 4)
  const maxPolar = useRef(config.freeOrbit ? Math.PI : Math.PI / 2)
  const minDist = useRef(config.freeOrbit ? 3 : 4)
  const maxDist = useRef(config.freeOrbit ? 16 : 12)
  
  useFrame((_, delta) => {
    const orbitControls = controls as any
    if (!orbitControls) return
    
    // Target values based on mode
    const targetMinPolar = config.freeOrbit ? 0.01 : Math.PI / 4
    const targetMaxPolar = config.freeOrbit ? Math.PI - 0.01 : Math.PI / 2
    const targetMinDist = config.freeOrbit ? 3 : 4
    const targetMaxDist = config.freeOrbit ? 16 : 12
    
    // Detect transition direction for speed
    const entering = !wasFreeOrbit.current && config.freeOrbit
    const exiting = wasFreeOrbit.current && !config.freeOrbit
    if (entering || exiting) wasFreeOrbit.current = config.freeOrbit
    
    // Single smooth lerp — no fighting with OrbitControls
    // OrbitControls damping naturally moves the camera when limits change
    const speed = delta * 1.0  // ~1 second transition
    
    minPolar.current = THREE.MathUtils.lerp(minPolar.current, targetMinPolar, speed)
    maxPolar.current = THREE.MathUtils.lerp(maxPolar.current, targetMaxPolar, speed)
    minDist.current = THREE.MathUtils.lerp(minDist.current, targetMinDist, speed)
    maxDist.current = THREE.MathUtils.lerp(maxDist.current, targetMaxDist, speed)
    
    // Apply
    orbitControls.minPolarAngle = minPolar.current
    orbitControls.maxPolarAngle = maxPolar.current
    orbitControls.minDistance = minDist.current
    orbitControls.maxDistance = maxDist.current
    orbitControls.autoRotate = config.freeOrbit
    orbitControls.autoRotateSpeed = 0.3
  })
  
  return (
    <OrbitControls
      enableZoom={true}
      enablePan={false}
      enableRotate={true}
      minPolarAngle={Math.PI / 4}
      maxPolarAngle={Math.PI / 2}
      minDistance={4}
      maxDistance={12}
      autoRotate={false}
      autoRotateSpeed={0.3}
      target={[0, 0, 0]}
      makeDefault
      dampingFactor={0.03}
      enableDamping
    />
  )
}

/* ── Inner Scene ── */
function InnerScene({ config, quality }: { config: ConfigState, quality: QualitySettings }) {
  const groupRef = useRef<THREE.Group>(null!)

  return (
    <>
      {/* ═══ DYNAMIC LIGHTING METASYSTEM ═══ */}
      <LightingRig config={config} />

      {/* ═══ PEDESTAL — smooth animated hide/show ═══ */}
      <AnimatedPedestal config={config} quality={quality} />

      {/* ═══ SHADOWS — smooth opacity animation ═══ */}
      <AnimatedShadows config={config} quality={quality} />

      {/* ═══ PRODUCT — FLOATING ═══ */}
      <Float
        speed={config.freeOrbit ? 0.6 : (config.standMode === 'monolith' ? 0.2 : 1.5)}
        rotationIntensity={config.freeOrbit ? 0.05 : (config.standMode === 'quantum' ? 0.0 : 0.2)}
        floatIntensity={config.freeOrbit ? 0.1 : (config.standMode === 'quantum' ? 0.1 : 0.4)}
        floatingRange={config.freeOrbit ? [-0.03, 0.03] : (config.standMode === 'monolith' ? [0.0, 0.015] : [-0.1, 0.1])}
      >
        <group 
          ref={groupRef} 
          position={[0, 0.1, 0]} 
          rotation={
            config.standMode === 'quantum' 
              ? [Math.PI / 4, Math.PI / 6, Math.PI / 8] 
              : [0, 0, 0]
          }
          scale={15}
        >
          <Center>
            <Model config={config} />
            <Annotations />
          </Center>
        </group>
      </Float>

      <IdleAnimation groupRef={groupRef} />

      <CameraRig config={config} />
      <FXRig config={config} quality={quality} />

      <SmoothOrbitLimits config={config} />
    </>
  )
}


/* ── WebGL Context Loss Recovery ── */
function ContextGuard() {
  const { gl } = useThree()
  
  useEffect(() => {
    const canvas = gl.domElement
    
    const handleLost = (e: Event) => {
      e.preventDefault()
      console.error('[WebGL] Context lost — attempting recovery...')
    }
    
    const handleRestored = () => {
      console.log('[WebGL] Context restored successfully')
    }
    
    canvas.addEventListener('webglcontextlost', handleLost)
    canvas.addEventListener('webglcontextrestored', handleRestored)
    
    return () => {
      canvas.removeEventListener('webglcontextlost', handleLost)
      canvas.removeEventListener('webglcontextrestored', handleRestored)
    }
  }, [gl])
  
  return null
}

/* ── Static Fallback (no WebGL) ── */
function StaticFallback({ theme }: { theme: 'light' | 'dark' }) {
  const isDark = theme === 'dark'
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-6"
      style={{ background: isDark ? '#0B0C10' : '#F2F2F0' }}
    >
      <div className="text-center space-y-3">
        <div className="text-5xl md:text-7xl font-bold tracking-tighter"
          style={{ color: isDark ? '#fff' : '#1a1a1a' }}
        >
          KB.D-2
        </div>
        <div className="text-sm tracking-widest uppercase"
          style={{ color: isDark ? '#666' : '#999' }}
        >
          Ваш браузер не поддерживает 3D · Попробуйте Chrome или Safari
        </div>
      </div>
    </div>
  )
}

export function Scene({ config }: {
  isReady?: boolean, config: ConfigState, scrollProgress?: number
}) {
  const { settings: quality, tier } = useGPUStore()

  // Full fallback — no WebGL at all
  if (tier === 'fallback') {
    return <StaticFallback theme={config.theme} />
  }

  return (
    <Canvas
      shadows
      camera={{ position: [-3, 2, 6], fov: 50 }}
      dpr={quality.dpr}
      gl={{
        antialias: quality.antialias,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.5,
        outputColorSpace: THREE.SRGBColorSpace,
        // Prevent hard crash on context loss
        powerPreference: tier === 'low' ? 'low-power' : 'high-performance',
      }}
      // Handle unrecoverable context loss
      onCreated={({ gl: renderer }) => {
        renderer.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault()
        })
      }}
    >
      <ContextGuard />
      <Suspense fallback={null}>
        <SceneBG theme={config.theme} />
        <InnerScene config={config} quality={quality} />
      </Suspense>
    </Canvas>
  )
}
