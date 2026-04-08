"use client"

import { Scene } from "@/components/Scene"
import { Header } from "@/components/Header"
import { HeroSection } from "@/components/HeroSection"
import { DockBar, DockBarMobile } from "@/components/DockBar"
import { FXPanel } from "@/components/FXPanel"
import { SpecHUD } from "@/components/SpecHUD"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import { useProgress } from "@react-three/drei"
import { useConfigStore } from "@/store/useConfigStore"


/* ═══════════════════════════════════════════
   PRELOADER — Cinematic Industrial
   ═══════════════════════════════════════════ */
function Preloader({ onDone }: { onDone: () => void }) {
  const { progress } = useProgress()
  const store = useConfigStore()
  const [done, setDone] = useState(false)
  const [minTime, setMinTime] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMinTime(true), 1500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (progress >= 99 && minTime && !done) {
      const t = setTimeout(() => { setDone(true); onDone() }, 500)
      return () => clearTimeout(t)
    }
  }, [progress, minTime, done, onDone])

  const isDark = store.theme === 'dark'

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.02 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className={`fixed inset-0 z-[200] flex flex-col justify-between p-6 md:p-10 select-none overflow-hidden
            ${isDark ? 'bg-[#0B0C10] text-white' : 'bg-[#e5e5e5] text-black'}
          `}
        >
          {/* Subtle noise grain for the preloader itself */}
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/noise.png")', backgroundSize: '100px' }} />

          {/* Top HUD */}
          <div className="relative z-10 flex justify-between items-start font-mono text-[10px] uppercase tracking-[0.2em] opacity-40">
            <span>SYS.BOOT SEQUENCE</span>
            <span>MZTA KOMEGA // 2026</span>
          </div>

          {/* Center Graphic */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
            {/* Ambient glow behind logo in dark mode */}
            {isDark && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vh] h-[30vh] bg-white/5 rounded-full blur-[100px]" />
            )}
            
            <div className="relative w-48 md:w-64 h-auto mb-6">
              {/* Dimmed Base Logo */}
              <svg viewBox="0 0 5.98 4.05" className={`w-full h-full fill-current ${isDark ? 'text-white/10' : 'text-black/10'}`}>
                <path d="M0.88 2.16l-0.31 -2.12 -0.57 0 0 4.01 0.47 0 0 -2.19 0.29 2.19 0.23 0 0.31 -2.19 0 2.19 0.47 0 0 -4.01 -0.58 0 -0.31 2.12zm4.83 -2.12l-0.78 0 -0.26 4.01 0.47 0 0.05 -0.89 0.28 0 0.04 0.89 0.47 0 -0.27 -4.01zm-0.5 2.71l0.12 -2.33 0.11 2.33 -0.23 0zm-2.05 -0.85l-0.06 -0.02c0.11,-0.05 0.2,-0.08 0.24,-0.2 0.02,-0.07 0.02,-0.15 0.02,-0.26l0 -1.04c0,-0.52 -1.24,-0.5 -1.24,0.04l0 0.91 0.51 0 0 -0.82c0,-0.15 0.21,-0.15 0.21,0l0 0.98c0,0.1 -0.11,0.17 -0.21,0.17l-0.09 0 0 0.35 0.09 0c0.14,0 0.21,0.06 0.21,0.15l0 1.38c0,0.15 -0.21,0.15 -0.21,0l0 -1.14 -0.51 0 0 1.24c0,0.53 1.25,0.56 1.25,0.03l0 -1.37c0,-0.15 0.01,-0.35 -0.21,-0.4l0 0zm0.42 -1.48l0.24 0 0 3.63 0.51 0 0 -3.63 0.23 0 0 -0.38 -0.98 0 0 0.38z" />
              </svg>

              {/* Filled Logo (Masked by progress) */}
              <motion.div 
                className="absolute inset-0"
                initial={{ clipPath: "inset(100% 0 0 0)" }}
                animate={{ clipPath: `inset(${100 - (progress || 0)}% 0 0 0)` }}
                transition={{ ease: "easeOut", duration: 0.3 }}
              >
                <svg viewBox="0 0 5.98 4.05" className="w-full h-full fill-current" style={{ color: '#A32121' }}>
                   <path d="M0.88 2.16l-0.31 -2.12 -0.57 0 0 4.01 0.47 0 0 -2.19 0.29 2.19 0.23 0 0.31 -2.19 0 2.19 0.47 0 0 -4.01 -0.58 0 -0.31 2.12zm4.83 -2.12l-0.78 0 -0.26 4.01 0.47 0 0.05 -0.89 0.28 0 0.04 0.89 0.47 0 -0.27 -4.01zm-0.5 2.71l0.12 -2.33 0.11 2.33 -0.23 0zm-2.05 -0.85l-0.06 -0.02c0.11,-0.05 0.2,-0.08 0.24,-0.2 0.02,-0.07 0.02,-0.15 0.02,-0.26l0 -1.04c0,-0.52 -1.24,-0.5 -1.24,0.04l0 0.91 0.51 0 0 -0.82c0,-0.15 0.21,-0.15 0.21,0l0 0.98c0,0.1 -0.11,0.17 -0.21,0.17l-0.09 0 0 0.35 0.09 0c0.14,0 0.21,0.06 0.21,0.15l0 1.38c0,0.15 -0.21,0.15 -0.21,0l0 -1.14 -0.51 0 0 1.24c0,0.53 1.25,0.56 1.25,0.03l0 -1.37c0,-0.15 0.01,-0.35 -0.21,-0.4l0 0zm0.42 -1.48l0.24 0 0 3.63 0.51 0 0 -3.63 0.23 0 0 -0.38 -0.98 0 0 0.38z" />
                </svg>
              </motion.div>
            </div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-mono text-[11px] md:text-[13px] tracking-[0.3em] uppercase"
              style={{ color: isDark ? '#fff' : '#1a1a1a' }}
            >
              Загрузка — {Math.round(progress)}%
            </motion.div>
          </div>

          {/* Boot Log background */}
          <div className="absolute left-6 md:left-10 bottom-24 opacity-20 pointer-events-none font-mono text-[8px] md:text-[10px] leading-relaxed uppercase tracking-wider">
            {progress >= 0 && <div>[00] Mount WebGL Context... OK</div>}
            {progress > 30 && <div>[01] Compiling Core Shaders... OK</div>}
            {progress > 60 && <div>[02] Loading Structural Buffers... OK</div>}
            {progress > 80 && <div>[03] Initializing Camera Rig... OK</div>}
            {progress > 90 && <div>[04] Controller KB.D-2 Ready.</div>}
          </div>

          {/* Bottom Bar */}
          <div className="relative z-10 w-full mt-auto">
            <div className="h-[2px] w-full bg-black/10 dark:bg-white/10 overflow-hidden rounded-full">
              <motion.div 
                className="h-full bg-black dark:bg-white"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear", duration: 0.1 }}
              />
            </div>
            <div className="flex justify-between mt-4 font-mono text-[9px] md:text-[10px] uppercase tracking-widest opacity-40">
              <span>Initializing KB.D-2</span>
              <span>Industrial Engine</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


/* ═══════════════════════════════════════════
   PAGE — Spatial UI Layout
   ═══════════════════════════════════════════ */
export default function Home() {
  const [showUI, setShowUI] = useState(false)
  const config = useConfigStore()

  const handleDone = useCallback(() => {
    setTimeout(() => setShowUI(true), 300)
  }, [])

  return (
    <div className={config.theme === 'dark' ? 'dark' : ''}>
      <div className="grain bg-background min-h-screen text-foreground transition-colors duration-700">
        <Preloader onDone={handleDone} />

        {/* ── Full-screen 3D Canvas ── */}
        <motion.div 
          className="fixed inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: showUI ? 1 : 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Scene config={config} />
        </motion.div>

        {/* ── Spatial UI Overlay ── */}
        <AnimatePresence>
          {showUI && (
            <motion.div 
              className="fixed inset-0 z-10 pointer-events-none flex flex-col justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <HeroSection />
              <DockBar />
              <DockBarMobile />
              <div className="pointer-events-auto">
                <FXPanel />
              </div>
              
              {/* ── Technical HUD ── */}
              <SpecHUD />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
