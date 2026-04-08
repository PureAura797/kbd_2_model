"use client"

import { Html } from "@react-three/drei"
import { motion, AnimatePresence } from "framer-motion"
import { useConfigStore } from "@/store/useConfigStore"
import { SPEC_POINTS } from "@/lib/specs"

export function Annotations() {
  const showAnnotations = useConfigStore(state => state.showAnnotations)
  const activeSpec = useConfigStore(state => state.activeSpec)
  const setActiveSpec = useConfigStore(state => state.setActiveSpec)
  
  return (
    <>
      {SPEC_POINTS.map((spec, i) => {
        const isActive = activeSpec === spec.id

        return (
          <Html
            key={spec.id}
            position={spec.position}
            center
            occlude
            zIndexRange={[100, 0]}
          >
            <AnimatePresence>
              {showAnnotations && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="relative group cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveSpec(isActive ? null : spec.id)
                  }}
                >
                  {/* Outer Ring */}
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border transition-all duration-300
                    ${isActive 
                      ? 'border-[var(--text-primary)] scale-125 bg-[var(--text-primary)]/10 shadow-[0_0_15px_var(--text-primary)]' 
                      : 'border-[var(--text-primary)]/40 hover:border-[var(--text-primary)] hover:scale-110 hover:bg-[var(--text-primary)]/10'
                    }
                  `}>
                    {/* Inner Dot */}
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300
                      ${isActive 
                        ? 'bg-[var(--text-primary)] shadow-[0_0_8px_var(--text-primary)]' 
                        : 'bg-[var(--text-primary)]/60 group-hover:bg-[var(--text-primary)]'
                      }
                    `} />
                  </div>
                  
                  {/* Gentle pulse effect when not active */}
                  {!isActive && (
                    <motion.div
                      animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
                      className="absolute inset-0 rounded-full border border-[var(--text-primary)]/50 pointer-events-none"
                    />
                  )}
                  
                  {/* Hitbox expanded for easier clicking */}
                  <div className="absolute inset-[-10px] sm:inset-[-15px] rounded-full" />
                </motion.div>
              )}
            </AnimatePresence>
          </Html>
        )
      })}
    </>
  )
}
