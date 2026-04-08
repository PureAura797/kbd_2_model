"use client"

import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-8 sm:top-12 inset-x-0 w-full px-8 sm:px-12 flex flex-row items-start justify-between z-20 pointer-events-none"
    >
      {/* Main Title */}
      <h1 className="font-display font-bold text-[var(--text-primary)] text-5xl sm:text-6xl md:text-7xl">
        KB.D-2
      </h1>

      {/* Elegant subtitle */}
      <p className="text-[var(--text-secondary)] text-[12px] sm:text-[13px] md:text-[14px] font-medium tracking-wide max-w-[280px] sm:max-w-[340px] text-right leading-relaxed pt-3">
        Промышленный интеллект. Контроллер, который управляет, отображает и архивирует.
      </p>
    </motion.div>
  )
}
