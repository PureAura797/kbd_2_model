"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useConfigStore } from "@/store/useConfigStore"
import type { LucideIcon } from "lucide-react"
import {
  Palette,
  Monitor,
  Sun,
  Layers,
  RotateCcw,
  ChevronDown,
  Grip,
} from "lucide-react"

const BODY_COLORS = [
  { color: '#A32121', label: 'Красный МЗТА' },
  { color: '#2D2D2D', label: 'Графит' },
  { color: '#F0F0F0', label: 'Белый' },
  { color: '#1E3A5F', label: 'Синий' },
  { color: '#2D5A3D', label: 'Зелёный' },
]

/* ── Toggle Switch ── */
function Toggle({ active, onToggle, label }: { active: boolean, onToggle: () => void, label: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] text-[var(--text-secondary)]">{label}</span>
      <button
        onClick={onToggle}
        className={`toggle-track ${active ? 'active' : ''}`}
        aria-label={label}
      >
        <div className="toggle-thumb" />
      </button>
    </div>
  )
}

/* ── Section Wrapper ── */
function PanelSection({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string
  icon: LucideIcon
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-black/[0.04] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 px-1 group"
      >
        <div className="flex items-center gap-2.5">
          <Icon className="w-4 h-4 text-[var(--text-muted)]" strokeWidth={1.5} />
          <span className="text-[12px] font-medium uppercase tracking-[0.1em] text-[var(--text-secondary)]">
            {title}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[var(--text-dim)] transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          strokeWidth={1.5}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 px-1 space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Desktop Config Panel ── */
export function ConfigPanel() {
  const store = useConfigStore()

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="hidden lg:block fixed right-[var(--space-gutter)] top-1/2 -translate-y-1/2 z-[90]
        w-[280px] config-panel p-5"
    >
      {/* Panel header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/[0.04]">
        <div className="flex items-center gap-2">
          <Grip className="w-3.5 h-3.5 text-[var(--text-dim)]" strokeWidth={1.5} />
          <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-[var(--text-muted)]">
            Конфигуратор
          </span>
        </div>
        <button
          onClick={store.reset}
          className="p-1.5 rounded-md hover:bg-black/[0.03] transition-colors duration-300"
          title="Сбросить"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[var(--text-dim)]" strokeWidth={1.5} />
        </button>
      </div>

      {/* ── Color Section ── */}
      <PanelSection title="Цвет корпуса" icon={Palette}>
        <div className="flex items-center gap-3">
          {BODY_COLORS.map((c) => (
            <button
              key={c.color}
              onClick={() => store.setBodyColor(c.color)}
              className={`color-swatch ${store.bodyColor === c.color ? 'active' : ''}`}
              style={{ backgroundColor: c.color }}
              title={c.label}
              aria-label={c.label}
            />
          ))}
        </div>
        <p className="text-[11px] text-[var(--text-dim)] mt-1 font-mono">
          {BODY_COLORS.find(c => c.color === store.bodyColor)?.label || 'Кастомный'}
        </p>
      </PanelSection>

      {/* ── Screen Section ── */}
      <PanelSection title="Дисплей" icon={Monitor}>
        <Toggle
          active={store.screenOn}
          onToggle={() => store.setScreenOn(!store.screenOn)}
          label="Включить экран"
        />
        {store.screenOn && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[11px] text-[var(--text-dim)]"
          >
            TFT 2.4&quot; — Dashboard Preview
          </motion.p>
        )}
      </PanelSection>

      {/* ── Lighting Section ── */}
      <PanelSection title="Освещение" icon={Sun} defaultOpen={false}>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-[var(--text-secondary)]">Интенсивность</span>
            <span className="text-[11px] font-mono text-[var(--text-dim)]">
              {store.lightIntensity.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min="0.3"
            max="2.0"
            step="0.1"
            value={store.lightIntensity}
            onChange={(e) => store.setLightIntensity(parseFloat(e.target.value))}
            className="w-full h-1 bg-black/[0.06] rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-[var(--text-primary)]
              [&::-webkit-slider-thumb]:shadow-[0_1px_4px_rgba(0,0,0,0.2)]
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-200
              [&::-webkit-slider-thumb]:hover:scale-110"
          />
        </div>
      </PanelSection>

      {/* ── Technical Section ── */}
      <PanelSection title="Техн. режим" icon={Layers} defaultOpen={false}>
        <Toggle
          active={store.wireframe}
          onToggle={() => store.setWireframe(!store.wireframe)}
          label="Wireframe"
        />
        <Toggle
          active={store.exploded}
          onToggle={() => store.setExploded(!store.exploded)}
          label="Разобрать"
        />
      </PanelSection>
    </motion.div>
  )
}

/* ── Mobile Config Panel (Bottom Sheet) ── */
export function ConfigPanelMobile() {
  const store = useConfigStore()
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 3.0, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-[90]"
    >
      {/* Collapsed bar */}
      <div className="config-panel mx-3 mb-3 overflow-hidden">
        {/* Drag handle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex flex-col items-center pt-3 pb-2"
        >
          <div className="w-8 h-1 rounded-full bg-black/10 mb-2" />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-muted)]">
            {expanded ? 'Скрыть' : 'Конфигуратор'}
          </span>
        </button>

        {/* Quick color bar — always visible */}
        <div className="flex items-center justify-center gap-3 pb-3 px-4">
          {BODY_COLORS.map((c) => (
            <button
              key={c.color}
              onClick={() => store.setBodyColor(c.color)}
              className={`color-swatch ${store.bodyColor === c.color ? 'active' : ''}`}
              style={{ backgroundColor: c.color, width: 28, height: 28 }}
              aria-label={c.label}
            />
          ))}
        </div>

        {/* Expanded controls */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-4 border-t border-black/[0.04] pt-4">
                <Toggle
                  active={store.screenOn}
                  onToggle={() => store.setScreenOn(!store.screenOn)}
                  label="Включить экран"
                />
                <Toggle
                  active={store.wireframe}
                  onToggle={() => store.setWireframe(!store.wireframe)}
                  label="Wireframe"
                />
                <Toggle
                  active={store.exploded}
                  onToggle={() => store.setExploded(!store.exploded)}
                  label="Разобрать"
                />

                <button
                  onClick={store.reset}
                  className="w-full text-center text-[12px] text-[var(--text-muted)] py-2
                    hover:text-[var(--text-primary)] transition-colors duration-300"
                >
                  Сбросить настройки
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
