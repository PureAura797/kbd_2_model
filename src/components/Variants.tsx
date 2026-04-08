"use client"

import { motion } from "framer-motion"
import { Code, Settings } from "lucide-react"

const VARIANTS = [
  {
    name: "kB.D-2",
    subtitle: "Стандартное исполнение",
    features: ["kStudio IDE", "Компилятор Linaro", "Полный функционал ПАК Комега", "Загрузка через Ethernet"],
    icon: Settings,
  },
  {
    name: "kB.D-2-CDS",
    subtitle: "CODESYS Runtime",
    features: ["kStudio + CODESYS V3.5.19", "Control Runtime System", "IEC 61131-3", "Расширенные библиотеки"],
    icon: Code,
  },
]

export function Variants() {
  return (
    <section className="py-[var(--space-section)]">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-[var(--space-16)] max-w-xl"
        >
          <p className="label-mono mb-5">Исполнения</p>
          <h2 className="font-display text-[var(--text-display)] font-bold text-white" style={{ lineHeight: 1.05 }}>
            Два пути<br />программирования.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {VARIANTS.map((v, i) => (
            <motion.div
              key={v.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="glass-card p-8 md:p-10"
            >
              <v.icon className="w-5 h-5 mb-8 text-[var(--text-dim)] opacity-60" strokeWidth={1} />

              <h3 className="font-display text-2xl font-bold text-white mb-2">{v.name}</h3>
              <p className="text-[var(--text-muted)] text-sm mb-8">{v.subtitle}</p>

              <ul className="space-y-3">
                {v.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-[13px] text-[var(--text-secondary)]">
                    <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-white/[0.04]">
                <a
                  href="https://www.mzta.ru/kb-d"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] uppercase tracking-[0.12em] text-[var(--text-muted)] hover:text-white transition-colors duration-500"
                >
                  Подробнее →
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
