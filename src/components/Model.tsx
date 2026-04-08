/*
  KB.D-2 Controller Model — Premium Matte Grade
  MeshPhysicalMaterial on all meshes with subtle clearcoat.
  Screen toggle: mesh_7 + mesh_9
*/

import * as THREE from 'three'
import React, { useRef, useEffect, useMemo } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { GLTF } from 'three-stdlib'
import { ConfigState } from '@/lib/types'

const SCREEN_MESH_INDICES = new Set([7, 9])

function createMaterial(origMat: THREE.MeshStandardMaterial, index: number, dashTex: THREE.Texture): THREE.MeshPhysicalMaterial {
  const isScreen = SCREEN_MESH_INDICES.has(index)

  if (isScreen) {
    return new THREE.MeshPhysicalMaterial({
      color: origMat.color,
      emissive: origMat.emissive || new THREE.Color(0),
      roughness: 0.1,
      metalness: 0.05,
      map: dashTex,
      emissiveMap: dashTex,
      side: THREE.DoubleSide,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      ior: 1.52,
      envMapIntensity: 1.5,
    })
  }

  // Body casing (mesh_0) — premium matte paint
  if (index === 0) {
    return new THREE.MeshPhysicalMaterial({
      color: origMat.color.clone(),
      roughness: 0.35,
      metalness: 0.15,
      clearcoat: 0.4,
      clearcoatRoughness: 0.25,
      map: origMat.map,
      envMapIntensity: 1.5,
    })
  }

  // Lower base (mesh_1)
  if (index === 1) {
    return new THREE.MeshPhysicalMaterial({
      color: origMat.color.clone(),
      roughness: 0.5,
      metalness: 0.05,
      clearcoat: 0.15,
      clearcoatRoughness: 0.4,
      map: origMat.map,
      envMapIntensity: 1.0,
    })
  }

  // Red side panels (mesh_5) — satin finish
  if (index === 5) {
    return new THREE.MeshPhysicalMaterial({
      color: origMat.color.clone(),
      roughness: 0.25,
      metalness: 0.1,
      clearcoat: 0.6,
      clearcoatRoughness: 0.1,
      map: origMat.map,
      envMapIntensity: 1.8,
    })
  }

  // Frame (mesh_6) — subtle metallic
  if (index === 6) {
    return new THREE.MeshPhysicalMaterial({
      color: origMat.color.clone(),
      roughness: 0.3,
      metalness: 0.4,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
      map: origMat.map,
      envMapIntensity: 1.5,
    })
  }

  // Default — clean matte
  return new THREE.MeshPhysicalMaterial({
    color: origMat.color.clone(),
    roughness: Math.max(origMat.roughness, 0.3),
    metalness: Math.min(origMat.metalness, 0.2),
    clearcoat: 0.15,
    clearcoatRoughness: 0.3,
    map: origMat.map,
    envMapIntensity: 1.2,
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

  useFrame(() => {
    const cfg = configRef.current

    for (const entry of meshEntries) {
      if (entry.isScreen) {
        if (cfg.screenOn) {
          entry.mat.color.setHex(0xffffff)
          entry.mat.emissive.setHex(0xffffff)
          entry.mat.emissiveIntensity = 0.8
          entry.mat.roughness = 0.08
          entry.mat.map = dashboardTexture
          entry.mat.emissiveMap = dashboardTexture
        } else {
          entry.mat.color.copy(entry.origColor)
          entry.mat.emissive.copy(entry.origEmissive)
          entry.mat.emissiveIntensity = 0
          entry.mat.roughness = entry.origRoughness
          entry.mat.map = entry.origMap
          entry.mat.emissiveMap = null
        }
        entry.mat.needsUpdate = true
      }

      if (entry.index === 0) {
        tempColor.set(cfg.bodyColor)
        entry.mat.color.lerp(tempColor, 0.08)
      }

      if (entry.mat.wireframe !== cfg.wireframe) {
        entry.mat.wireframe = cfg.wireframe
        entry.mat.needsUpdate = true
      }
    }

    for (const { mesh, index } of meshEntries) {
      let targetY = 0
      if (cfg.exploded) {
        if (index === 0) targetY = 1.2
        if (index === 1) targetY = -0.8
      }
      mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, targetY, 0.08)
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
