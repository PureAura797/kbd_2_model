"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useConfigStore } from "@/store/useConfigStore"
import { SPEC_POINTS } from "@/lib/specs"
import { X } from "lucide-react"

export function SpecHUD() {
  const activeSpecId = useConfigStore(state => state.activeSpec)
  const setActiveSpec = useConfigStore(state => state.setActiveSpec)
  const isDark = useConfigStore(state => state.theme === 'dark')

  const activeSpec = SPEC_POINTS.find(s => s.id === activeSpecId)

  return (
    <AnimatePresence>
      {activeSpec && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 sm:bottom-auto sm:top-0 right-0 w-full sm:w-[400px] sm:h-full pointer-events-none z-50 p-3 sm:p-8 flex flex-col justify-end sm:justify-center"
        >
          <div className="pointer-events-auto max-h-[60vh] sm:max-h-full flex flex-col rounded-2xl sm:rounded-[2rem] overflow-hidden border border-[var(--text-primary)]/10 shadow-[0_24px_80px_rgba(0,0,0,0.12)] backdrop-blur-[40px] bg-white/40 dark:bg-[#050505]/60 relative isolate [transform:translateZ(0)]">
            
            {/* Fake Noise Texture for Premium Feel */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />

            {/* Header */}
            <div className="p-6 pb-4 border-b border-[var(--text-primary)]/10 flex justify-between items-center relative z-10">
              <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--text-muted)] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                SYS.LOG / {activeSpec.id}
              </div>
              <button 
                onClick={() => setActiveSpec(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--text-primary)]/10 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 relative z-10 flex-1 overflow-y-auto hidden-scrollbar">
              <h2 className="text-2xl font-bold font-display tracking-tight text-[var(--text-primary)] mb-1">
                {activeSpec.title}
              </h2>
              <h3 className="text-[11px] font-mono tracking-widest uppercase text-[var(--text-muted)] mb-6">
                // {activeSpec.subtitle}
              </h3>

              <p className="text-sm font-medium text-[var(--text-primary)]/80 leading-relaxed mb-8">
                {activeSpec.desc}
              </p>

              {/* Technical Grid */}
              <div className="space-y-3">
                {activeSpec.technical.map((tech, i) => (
                  <div key={i} className="flex justify-between items-end border-b border-[var(--text-primary)]/10 pb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                      {tech.label}
                    </span>
                    <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-primary)] font-semibold">
                      {tech.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Bar */}
            <div className="h-2 bg-[var(--text-primary)]/5 relative z-10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-full bg-[var(--text-primary)]"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
