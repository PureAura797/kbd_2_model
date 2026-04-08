"use client"

import { motion } from "framer-motion"

const SPECS = [
  { group: "ПРОЦЕССОР", items: [
    { param: "Микроконтроллер", value: "ARM® Cortex®-A7" },
    { param: "Тактовая частота", value: "528 MHz" },
    { param: "L2 Cache", value: "128 KB" },
    { param: "Оперативная память", value: "256 МБ DDR" },
    { param: "Энергонез. память", value: "256 МБ Flash" },
  ]},
  { group: "ДИСПЛЕЙ", items: [
    { param: "Тип", value: "TFT 2.4\" цветной" },
    { param: "Разрешение", value: "320 × 240 px" },
    { param: "Управление", value: "Энкодер + 4 кнопки" },
  ]},
  { group: "ИНТЕРФЕЙСЫ", items: [
    { param: "Ethernet", value: "10/100 Мбит/с" },
    { param: "MicroUSB", value: "Host / Device" },
    { param: "MicroSD", value: "До 32 ГБ" },
  ]},
  { group: "КОНСТРУКТИВ", items: [
    { param: "Габариты", value: "118 × 80 × 44 мм" },
    { param: "Масса", value: "≤ 0.3 кг" },
    { param: "Потребляемая мощность", value: "≤ 5 ВА" },
    { param: "Степень защиты", value: "IP20" },
    { param: "Температура", value: "+5 … +50 °C" },
    { param: "Влажность", value: "≤ 80 %, без конд." },
    { param: "Монтаж", value: "DIN-рейка" },
  ]},
]

export function TechSpecs() {
  let rowIndex = 0

  return (
    <section id="specs" className="py-[var(--space-section)] gradient-mesh-2">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
          {/* Left column — editorial message */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 lg:sticky lg:top-[120px] lg:self-start"
          >
            <p className="label-mono mb-5">Спецификации</p>
            <h2 className="font-display text-[var(--text-display)] font-bold text-white mb-6" style={{ lineHeight: 1.05 }}>
              Цифры,<br />
              которые<br />
              говорят.
            </h2>
            <p className="text-[var(--text-secondary)] text-[var(--text-body)] max-w-sm mb-8">
              Каждый параметр — результат инженерного расчёта.
            </p>
            <p className="font-mono text-[10px] text-[var(--text-dim)] uppercase tracking-[0.15em]">
              ТУ 26.30.30-173-00225549-2025
            </p>
          </motion.div>

          {/* Right column — specs table */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-8"
          >
            <div className="glass-card p-6 md:p-8">
              <div className="font-mono text-[13px]">
                {SPECS.map((group) => (
                  <div key={group.group} className="mb-8 last:mb-0">
                    {/* Group header */}
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-dim)] pb-3 mb-1">
                      {group.group}
                    </div>

                    {/* Rows */}
                    {group.items.map((item) => {
                      const idx = rowIndex++
                      return (
                        <motion.div
                          key={item.param}
                          initial={{ opacity: 0, x: -8 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: idx * 0.02 }}
                          className="flex items-baseline justify-between py-2.5 border-b border-white/[0.04] last:border-0"
                        >
                          <span className="text-[var(--text-muted)]">
                            {item.param}
                          </span>
                          <span className="text-right text-white/80 font-medium">
                            {item.value}
                          </span>
                        </motion.div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
