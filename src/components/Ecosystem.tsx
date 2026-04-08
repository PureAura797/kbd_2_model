"use client"

import { motion } from "framer-motion"
import { useState } from "react"

const MODULES = [
  { id: "kB.M", label: "Базовый модуль", description: "Несёт kB.D. Питание и связь с периферией.", ring: 1 },
  { id: "kB.AIO", label: "Аналоговые I/O", description: "Аналоговые каналы ввода-вывода.", ring: 2 },
  { id: "kB.DIO", label: "Цифровые I/O", description: "Дискретные каналы: датчики, реле.", ring: 2 },
  { id: "kB.PDO", label: "Силовые выходы", description: "Управление силовыми нагрузками.", ring: 2 },
  { id: "kB.EG", label: "Шлюз", description: "Связь между сегментами сети.", ring: 2 },
  { id: "kB.PWR", label: "Питание", description: "Модуль питания комплекса.", ring: 2 },
  { id: "SCADA", label: "SuperSCADA", description: "Мониторинг, диспетчеризация, архивы.", ring: 3 },
  { id: "kStudio", label: "kStudio", description: "Визуальная среда разработки.", ring: 3 },
  { id: "CODESYS", label: "CODESYS V3.5", description: "IEC 61131-3 (kB.D-2-CDS).", ring: 3 },
]

export function Ecosystem() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <section id="ecosystem" className="py-[var(--space-section)]">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-[var(--space-16)]"
        >
          <p className="label-mono mb-5">Экосистема</p>
          <h2 className="font-display text-[var(--text-display)] font-bold text-white mb-5" style={{ lineHeight: 1.05 }}>
            Одно ядро —<br />бесконечные возможности.
          </h2>
          <p className="text-[var(--text-secondary)] text-[var(--text-body)] max-w-md mx-auto">
            До 32 модулей расширения. Совместим со SCADA, Modbus TCP, Weintek.
          </p>
        </motion.div>

        {/* Module grid — clean card list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto">
          {/* Center card — KB.D-2 */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="sm:col-span-2 lg:col-span-3 glass-card p-8 text-center"
          >
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="font-display font-bold text-xl text-white tracking-tight">KB.D-2</span>
            </div>
            <p className="text-[var(--text-muted)] text-sm max-w-sm mx-auto">
              Центральный контроллер — управляет всей периферией через распределённый ввод-вывод.
            </p>
          </motion.div>

          {/* Module cards */}
          {MODULES.map((mod, i) => (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.04, duration: 0.5 }}
              onMouseEnter={() => setActive(mod.id)}
              onMouseLeave={() => setActive(null)}
              className={`glass-card p-5 cursor-default transition-all duration-500
                ${active === mod.id ? '!bg-white/[0.06] !border-white/[0.12]' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/70">
                  {mod.id}
                </span>
                <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${
                  active === mod.id ? 'bg-white' : 'bg-white/10'
                }`} />
              </div>
              <p className="text-[var(--text-secondary)] text-[12px] font-medium mb-1">{mod.label}</p>
              <p className="text-[var(--text-dim)] text-[11px] leading-relaxed">{mod.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
