"use client"

import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-4 sm:top-8 md:top-12 inset-x-0 w-full px-4 sm:px-8 md:px-12 flex flex-col sm:flex-row items-start sm:justify-between z-20 pointer-events-none gap-1 sm:gap-4"
    >
      {/* Main Title */}
      <h1 className="font-display font-bold text-[var(--text-primary)] text-3xl sm:text-5xl md:text-6xl lg:text-7xl whitespace-nowrap">
        KB.D-2
      </h1>

      {/* Subtitle — hidden on small mobile, visible from sm+ */}
      <p className="hidden sm:block text-[var(--text-secondary)] text-[12px] md:text-[14px] font-medium tracking-wide max-w-[280px] sm:max-w-[340px] text-left sm:text-right leading-relaxed sm:pt-3">
        Промышленный интеллект. Контроллер, который управляет, отображает и архивирует.
      </p>
    </motion.div>
  )
}
