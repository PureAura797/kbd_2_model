"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

export function FinalCTA() {
  return (
    <section id="cta" className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="section-container text-center relative z-10"
      >
        <p className="label-mono mb-8">Следующий шаг</p>

        <h2
          className="font-display font-bold text-white mb-6"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 0.95 }}
        >
          Готовы<br />автоматизировать?
        </h2>

        <p className="text-[var(--text-muted)] max-w-md mx-auto mb-12 text-[var(--text-body)]">
          Свяжитесь с нашим отделом продаж для расчёта проекта
          и подбора конфигурации.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.a
            href="https://www.mzta.ru/kontakty"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full text-sm font-medium
              bg-white text-[#0A0A0C]
              hover:bg-white/90
              transition-all duration-300"
          >
            Запросить спецификацию
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
          </motion.a>

          <motion.a
            href="mailto:sales@mzta.ru"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center px-6 py-4 rounded-full text-sm
              border border-white/10 text-[var(--text-muted)]
              hover:border-white/20 hover:text-white
              transition-all duration-500"
          >
            sales@mzta.ru
          </motion.a>
        </div>

        <div className="mt-16 flex flex-col items-center gap-1">
          <p className="font-mono text-[10px] text-[var(--text-dim)] tracking-[0.1em]">
            +7 (495) 720-54-44 · 8-800-555-61-84
          </p>
          <p className="font-mono text-[10px] text-[var(--text-dim)] tracking-[0.1em]">
            Москва, ул. Мироновская, д. 33, стр. 26
          </p>
        </div>
      </motion.div>
    </section>
  )
}
