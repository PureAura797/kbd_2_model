"use client"

import { motion } from "framer-motion"
import { Monitor, Cpu, Network, Database, Layers, Code } from "lucide-react"

const FEATURES = [
  {
    icon: Monitor,
    stat: "2.4\"",
    unit: "TFT Display",
    title: "Графический\nинтеллект",
    description: "Цветной дисплей 320×240 с энкодером и 4 тактильными кнопками. Локальная диспетчеризация без внешних панелей.",
    span: "md:col-span-2 md:row-span-2",
    large: true,
  },
  {
    icon: Cpu,
    stat: "528",
    unit: "MHz",
    title: "ARM® Cortex®-A7",
    description: "256 МБ DDR, 256 МБ Flash. Алгоритмы любой сложности.",
    span: "",
    large: false,
  },
  {
    icon: Network,
    stat: "10/100",
    unit: "Мбит/с",
    title: "Ethernet + SCADA",
    description: "Modbus TCP. SuperSCADA, kServer, Weintek.",
    span: "",
    large: false,
  },
  {
    icon: Database,
    stat: "32",
    unit: "ГБ MicroSD",
    title: "Архивирование",
    description: "Логирование параметров на внешний носитель.",
    span: "",
    large: false,
  },
  {
    icon: Layers,
    stat: "×32",
    unit: "модуля",
    title: "Масштабирование",
    description: "Аналоговые, цифровые, силовые модули расширения.",
    span: "",
    large: false,
  },
  {
    icon: Code,
    stat: "IEC",
    unit: "61131-3",
    title: "Свобода\nпрограммирования",
    description: "kStudio для визуального проектирования. CODESYS V3.5 для IEC-стандарта. Два пути — один результат.",
    span: "md:col-span-2",
    large: false,
  },
]

export function FeaturesBento() {
  return (
    <section id="features" className="py-[var(--space-section)] gradient-mesh-1">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-[var(--space-16)] max-w-xl"
        >
          <p className="label-mono mb-5">Возможности</p>
          <h2 className="font-display text-[var(--text-display)] font-bold text-white mb-5" style={{ lineHeight: 1.05 }}>
            Шесть граней<br />одного контроллера.
          </h2>
          <p className="text-[var(--text-secondary)] text-[var(--text-body)]">
            Каждый модуль решает конкретную инженерную задачу.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className={`glass-card ${f.large ? 'p-8 md:p-10' : 'p-6 md:p-7'} ${f.span}`}
            >
              {/* Icon */}
              <f.icon
                className={`${f.large ? 'w-8 h-8' : 'w-5 h-5'} mb-6 text-[var(--text-dim)] opacity-60`}
                strokeWidth={1}
              />

              {/* Stat */}
              <div className="flex items-baseline gap-2 mb-3">
                <span className={`font-display font-bold text-white ${f.large ? 'text-[clamp(2.5rem,5vw,4rem)]' : 'text-[clamp(1.5rem,3vw,2.2rem)]'}`}>
                  {f.stat}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--text-muted)]">
                  {f.unit}
                </span>
              </div>

              {/* Title */}
              <h3 className={`text-[var(--text-primary)] font-semibold mb-3 whitespace-pre-line ${f.large ? 'text-lg' : 'text-sm'}`}>
                {f.title}
              </h3>

              {/* Description */}
              <p className="text-[var(--text-muted)] text-[13px] leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
