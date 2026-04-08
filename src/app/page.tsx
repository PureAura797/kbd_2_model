"use client"

import { Scene } from "@/components/Scene"
import { Header } from "@/components/Header"
import { HeroSection } from "@/components/HeroSection"
import { Marquee } from "@/components/Marquee"
import { FeaturesBento } from "@/components/FeaturesBento"
import { TechSpecs } from "@/components/TechSpecs"
import { Ecosystem } from "@/components/Ecosystem"
import { Variants } from "@/components/Variants"
import { FinalCTA } from "@/components/FinalCTA"
import { Footer } from "@/components/Footer"
import { motion, AnimatePresence, useScroll } from "framer-motion"
import { useState, useEffect, useCallback, useRef } from "react"
import { useProgress } from "@react-three/drei"
import { ConfigState } from "@/lib/types"


/* ═══════════════════════════════════════════
   PRELOADER — Cinematic viewfinder
   ═══════════════════════════════════════════ */
function Preloader({ onExit }: { onExit: () => void }) {
  const { progress } = useProgress()
  const [done, setDone] = useState(false)
  const [minTimeReached, setMinTimeReached] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMinTimeReached(true), 1500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (progress === 100 && minTimeReached && !done) {
      const t = setTimeout(() => { setDone(true); onExit() }, 600)
      return () => clearTimeout(t)
    }
  }, [progress, minTimeReached, done, onExit])

  const circumference = 2 * Math.PI * 98

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[200] flex items-center justify-center select-none bg-[#0A0A0C]"
        >
          {/* Corner brackets */}
          <div className="absolute inset-8 sm:inset-12 pointer-events-none">
            <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-white/10" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-white/10" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-white/10" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-white/10" />
          </div>

          <div className="absolute top-14 left-14 font-mono text-[9px] tracking-[0.25em] text-white/10 uppercase hidden sm:block">
            SYS.INIT // KB.D-2
          </div>

          {/* Ring */}
          <div className="relative flex flex-col items-center justify-center w-[180px] h-[180px]">
            <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="100" cy="100" r="98" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              <motion.circle
                cx="100" cy="100" r="98" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference * (1 - (progress || 0) / 100) }}
                transition={{ ease: "easeOut", duration: 0.5 }}
              />
            </svg>
            <span className="font-display text-5xl font-bold text-white/80 tracking-tighter">
              {Math.round(progress || 0)}
            </span>
            <span className="font-mono text-[8px] tracking-[0.4em] uppercase mt-2 text-white/20">
              Загрузка
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


/* ═══════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════ */
export default function Home() {
  const [sceneReady, setSceneReady] = useState(false)
  const [showUI, setShowUI] = useState(false)
  const mainRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll()
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => setScrollProgress(v))
    return unsubscribe
  }, [scrollYProgress])

  const [config] = useState<ConfigState>({
    bodyColor: '#A32121',
    buttonsColor: '#F0F0F0',
    screenOn: false,
    lightIntensity: 1.0,
    environment: 'studio',
    wireframe: false,
    exploded: false,
    amount: 1,
    layout: 'cinematic'
  })

  const handlePreloaderExit = useCallback(() => {
    setTimeout(() => setSceneReady(true), 600)
    setTimeout(() => setShowUI(true), 1800)
  }, [])

  return (
    <div ref={mainRef} className="grain">
      <Preloader onExit={handlePreloaderExit} />

      {/* ── Sticky 3D Canvas ── */}
      <div className="sticky top-0 left-0 w-full h-[100dvh] z-0">
        <Scene isReady={sceneReady} config={config} scrollProgress={scrollProgress} />
      </div>

      {/* ── Content overlay ── */}
      <div className="relative z-10" style={{ marginTop: '-100dvh' }}>
        {showUI && (
          <>
            <Header />
            <HeroSection />

            {/* Sections with backgrounds */}
            <div className="relative" style={{ background: 'var(--bg)' }}>
              <Marquee />
              <div className="section-divider" />
              <FeaturesBento />
              <div className="section-divider" />
              <TechSpecs />
              <div className="section-divider" />
              <Ecosystem />
              <div className="section-divider" />
              <Variants />
              <div className="section-divider" />
              <FinalCTA />
              <Footer />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
