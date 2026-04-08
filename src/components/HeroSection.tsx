"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

export function HeroSection() {
  return (
    <section id="hero" className="relative h-[100dvh] flex items-end pointer-events-none">
      {/* Bottom gradient for text readability */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(10,10,12,0.95) 0%, rgba(10,10,12,0.4) 35%, transparent 60%)',
        }}
      />

      {/* Content */}
      <div className="relative z-[2] section-container pb-[clamp(3rem,6vh,5rem)] w-full">
        <div className="max-w-3xl">
          {/* Mono eyebrow */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0, duration: 0.8 }}
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] mb-6"
          >
            ПАК «Комега» — Дисплейный модуль
          </motion.p>

          {/* Hero H1 — editorial split */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-white mb-6"
            style={{ fontSize: 'clamp(3rem, 7.5vw, 6.5rem)', lineHeight: 0.9 }}
          >
            KB.D-2
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="text-[var(--text-secondary)] text-[clamp(0.9rem,1.3vw,1.125rem)] leading-relaxed max-w-md mb-10"
          >
            Управляет. Отображает. Архивирует.<br />
            Промышленный интеллект нового поколения.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 0.6 }}
            className="flex items-center gap-6 pointer-events-auto"
          >
            <a
              href="https://www.mzta.ru/kontakty"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-sm font-medium
                bg-white text-[#0A0A0C]
                hover:bg-white/90
                transition-all duration-300"
            >
              Запросить спецификацию
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
            </a>
            <a
              href="mailto:sales@mzta.ru"
              className="text-[13px] text-[var(--text-muted)] hover:text-white transition-colors duration-500 underline underline-offset-4 decoration-white/10 hover:decoration-white/30"
            >
              sales@mzta.ru
            </a>
          </motion.div>
        </div>

        {/* Right-bottom: tech specs micro */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2, duration: 1.0 }}
          className="absolute right-[var(--space-gutter)] bottom-[clamp(3rem,6vh,5rem)] hidden lg:flex flex-col items-end gap-2"
        >
          {["ARM Cortex-A7 / 528 MHz", "256 МБ DDR / 256 МБ Flash", "CODESYS V3.5 / кStudio", "Ethernet 10/100 Мбит/с"].map((spec, i) => (
            <motion.span
              key={spec}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 3.2 + i * 0.1, duration: 0.5 }}
              className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-dim)]"
            >
              {spec}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2]"
      >
        <div className="w-px h-16 bg-white/[0.06] relative overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-white/30"
            animate={{ height: ['0%', '100%', '0%'], top: ['0%', '0%', '100%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  )
}
