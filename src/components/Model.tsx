/*
  KB.D-2 Controller Model — Premium Light Theme Grade
  MeshPhysicalMaterial on all meshes with enhanced clearcoat.
  Apple-level material quality: satin body, brushed aluminum frame, glossy screen.
  Screen toggle: mesh_7 + mesh_9
*/

import * as THREE from 'three'
import React, { useRef, useEffect, useMemo } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { GLTF } from 'three-stdlib'
import { ConfigState } from '@/lib/types'

const SCREEN_MESH_INDICES = new Set([10])

function createMaterial(origMat: THREE.MeshStandardMaterial, index: number, dashTex: THREE.Texture): THREE.MeshPhysicalMaterial {
  const isScreen = SCREEN_MESH_INDICES.has(index)

  if (isScreen) {
    return new THREE.MeshPhysicalMaterial({
      color: origMat.color,
      emissive: origMat.emissive || new THREE.Color(0),
      roughness: 0.06,
      metalness: 0.02,
      map: dashTex,
      emissiveMap: dashTex,
      side: THREE.DoubleSide,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      ior: 1.55,
      reflectivity: 0.6,
      envMapIntensity: 2.0,
    })
  }

  // Body casing (mesh_0) — premium satin plastic, like Apple product
  if (index === 0) {
    return new THREE.MeshPhysicalMaterial({
      color: origMat.color.clone(),
      roughness: 0.28,
      metalness: 0.1,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
      map: origMat.map,
      envMapIntensity: 2.0,
      sheen: 0.3,
      sheenRoughness: 0.4,
      sheenColor: new THREE.Color(0.8, 0.8, 0.8),
    })
  }

  // Lower base (mesh_1) — matte finish
  if (index === 1) {
    return new THREE.MeshPhysicalMaterial({
      color: origMat.color.clone(),
      roughness: 0.45,
      metalness: 0.05,
      clearcoat: 0.2,
      clearcoatRoughness: 0.3,
      map: origMat.map,
      envMapIntensity: 1.5,
    })
  }

  // Red side panels (mesh_5) — deep satin, rich color reflection
  if (index === 5) {
    return new THREE.MeshPhysicalMaterial({
      color: origMat.color.clone(),
      roughness: 0.2,
      metalness: 0.05,
      clearcoat: 0.8,
      clearcoatRoughness: 0.08,
      map: origMat.map,
      envMapIntensity: 2.2,
      sheen: 0.5,
      sheenRoughness: 0.3,
      sheenColor: new THREE.Color(1.0, 0.3, 0.3),
    })
  }

  // Frame (mesh_6) — brushed aluminum
  if (index === 6) {
    return new THREE.MeshPhysicalMaterial({
      color: origMat.color.clone(),
      roughness: 0.2,
      metalness: 0.65,
      clearcoat: 0.35,
      clearcoatRoughness: 0.15,
      map: origMat.map,
      envMapIntensity: 2.0,
    })
  }

  // Buttons — glossy tactile
  if (index === 2 || index === 3 || index === 4 || index === 8) {
    return new THREE.MeshPhysicalMaterial({
      color: origMat.color.clone(),
      roughness: 0.12,
      metalness: 0.05,
      clearcoat: 0.9,
      clearcoatRoughness: 0.05,
      map: origMat.map,
      envMapIntensity: 1.8,
    })
  }

  // Default — clean, slightly glossy
  return new THREE.MeshPhysicalMaterial({
    color: origMat.color.clone(),
    roughness: Math.max(origMat.roughness * 0.8, 0.2),
    metalness: Math.min(origMat.metalness, 0.2),
    clearcoat: 0.25,
    clearcoatRoughness: 0.2,
    map: origMat.map,
    envMapIntensity: 1.8,
  })
}

export function Model({ config, ...props }: { config: ConfigState } & React.JSX.IntrinsicElements['group']) {
  const gltf = useGLTF('/models/controller.glb') as unknown as GLTF
  const groupRef = useRef<THREE.Group>(null!)
  const configRef = useRef(config)

  const dashboardTexture = useTexture('/textures/screen-dashboard.png')
  dashboardTexture.flipY = false
  dashboardTexture.colorSpace = THREE.SRGBColorSpace

  useEffect(() => {
    configRef.current = config
  }, [config])

  const meshEntries = useMemo(() => {
    const allMeshes: THREE.Mesh[] = []
    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) allMeshes.push(child as THREE.Mesh)
    })

    return allMeshes.map((mesh, i) => {
      const origMat = mesh.material as THREE.MeshStandardMaterial
      return {
        mesh,
        mat: createMaterial(origMat, i, dashboardTexture),
        isScreen: SCREEN_MESH_INDICES.has(i),
        index: i,
        origColor: origMat.color.clone(),
        origEmissive: origMat.emissive ? origMat.emissive.clone() : new THREE.Color(0),
        origRoughness: origMat.roughness,
        origMetalness: origMat.metalness,
        origMap: origMat.map,
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const tempColor = useMemo(() => new THREE.Color(), [])

  useFrame((_, delta) => {
    const cfg = configRef.current

    for (const entry of meshEntries) {
      // Screen toggle with smooth transition
      if (entry.isScreen) {
        const targetEmissive = cfg.screenOn ? 0.8 : 0
        entry.mat.emissiveIntensity = THREE.MathUtils.lerp(
          entry.mat.emissiveIntensity,
          targetEmissive,
          delta * 4
        )

        if (cfg.screenOn) {
          entry.mat.color.setHex(0xffffff)
          entry.mat.emissive.setHex(0xffffff)
          entry.mat.roughness = 0.05
          entry.mat.map = dashboardTexture
          entry.mat.emissiveMap = dashboardTexture
        } else {
          entry.mat.color.lerp(entry.origColor, delta * 3)
          entry.mat.emissive.lerp(entry.origEmissive, delta * 3)
          entry.mat.roughness = THREE.MathUtils.lerp(entry.mat.roughness, entry.origRoughness, delta * 3)
          if (entry.mat.emissiveIntensity < 0.01) {
            entry.mat.map = entry.origMap
            entry.mat.emissiveMap = null
          }
        }
        entry.mat.needsUpdate = true
      }

      // Body color — slower lerp for luxurious transition
      if (entry.index === 0) {
        tempColor.set(cfg.bodyColor)
        entry.mat.color.lerp(tempColor, delta * 3)
      }

      // Wireframe toggle
      if (entry.mat.wireframe !== cfg.wireframe) {
        entry.mat.wireframe = cfg.wireframe
        entry.mat.needsUpdate = true
      }
    }

    // Exploded view — spring-like smooth separation
    for (const { mesh, index } of meshEntries) {
      let targetY = 0
      if (cfg.exploded) {
        if (index === 0) targetY = 1.4
        if (index === 1) targetY = -1.0
        if (index === 6) targetY = 0.3
      }
      mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, targetY, delta * 3)
    }
  })

  return (
    <group ref={groupRef} {...props} dispose={null}>
      {meshEntries.map(({ mesh, mat }, i) => (
        <mesh key={i} geometry={mesh.geometry} material={mat} castShadow receiveShadow />
      ))}
    </group>
  )
}

useGLTF.preload('/models/controller.glb')
