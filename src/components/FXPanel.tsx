"use client"

import { useConfigStore } from "@/store/useConfigStore"
import { motion, AnimatePresence } from "framer-motion"
import { X, Camera, Aperture, MousePointer2, Activity, ScanLine, Filter, Crosshair, Move, Radio, Flame, ShieldAlert } from "lucide-react"
import { FXKey } from "@/lib/types"

const FX_LIST: { key: FXKey, label: string, desc: string, icon: any }[] = [
  // Optics
  { key: 'macroFocus', label: 'Макро Фокус', desc: 'Бритвенная резкость в центре', icon: Crosshair },
  { key: 'mouseFocus', label: 'Умный Фокус', desc: 'Динамический фокус мыши', icon: MousePointer2 },
  { key: 'breathingFocus', label: 'Дыхание Линзы', desc: 'Пульсирующая дистанция', icon: Aperture },
  // Kinematics
  { key: 'cameraShake', label: 'Съемка с Рук', desc: 'Процедурная тряска оптики', icon: Activity },
  { key: 'dutchAngle', label: 'Голландский Угол', desc: 'Инерционный завал камеры', icon: Move },
  { key: 'dollyZoom', label: 'Транстрав', desc: 'Эффект Хичкока (FOV shift)', icon: Radio },
  // Optics / Post-Processing
  { key: 'chromaticAberration', label: 'Хроматизм', desc: 'RGB-смещение краев', icon: Filter },
  { key: 'vignette', label: 'Виньетирование', desc: 'Туннельное затемнение', icon: Camera },
  { key: 'noise', label: 'Шум ISO', desc: 'Кинематографическое зерно', icon: Flame },
  { key: 'scrollBlur', label: 'Motion Blur', desc: 'Размытие при движении', icon: ScanLine },
  { key: 'scanline', label: 'ЭЛТ Развертка', desc: 'Полосы телеэкрана', icon: ScanLine },
  { key: 'glitch', label: 'Системный Сбой', desc: 'Цифровой разрыв матрицы', icon: ShieldAlert },
]

export function FXPanel() {
  const showFxPanel = useConfigStore(state => state.showFxPanel)
  const setShowFxPanel = useConfigStore(state => state.setShowFxPanel)
  const activeFx = useConfigStore(state => state.activeFx)
  const toggleFx = useConfigStore(state => state.toggleFx)
  const theme = useConfigStore(state => state.theme)
  const isDark = theme === 'dark'

  return (
    <AnimatePresence>
      {showFxPanel && (
        <>
          {/* Backdrop (invisible but catches clicks) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFxPanel(false)}
            className="fixed inset-0 z-[90]" 
          />

          {/* Floating Glass Island */}
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-[92vw] max-w-4xl max-h-[75vh] overflow-y-auto
              rounded-[2rem] p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.12)]
              border ${isDark ? 'bg-black/[0.4] border-white/10' : 'bg-white/[0.6] border-white/40'}
              backdrop-blur-[40px] isolate [transform:translateZ(0)]
            `}
          >
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter text-[var(--text-primary)]">FX Lab</h2>
                <p className="text-xs sm:text-sm font-medium text-[var(--text-muted)] mt-1.5 uppercase tracking-widest opacity-80">
                  Оптика & Кинематика
                </p>
              </div>
              <button
                onClick={() => setShowFxPanel(false)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                  ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-black/5 hover:bg-black/10'}
                `}
              >
                <X className="w-5 h-5 text-[var(--text-primary)]" strokeWidth={1.5} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {FX_LIST.map((fx) => {
                const isActive = activeFx[fx.key]
                const Icon = fx.icon

                return (
                  <button
                    key={fx.key}
                    onClick={() => toggleFx(fx.key)}
                    className={`group text-left relative overflow-hidden flex items-center gap-4 p-2 pr-6 rounded-full border transition-all duration-300
                      ${isActive 
                        ? (isDark 
                            ? 'bg-white/10 border-white/20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]' 
                            : 'bg-black/5 border-black/10 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]')
                        : (isDark
                            ? 'bg-transparent border-white/[0.04] hover:bg-white/[0.08]'
                            : 'bg-white/40 border-white/50 hover:bg-white/60')
                      }
                    `}
                  >
                    <div className={`p-3 rounded-full transition-all duration-300 shrink-0
                      ${isActive 
                        ? (isDark ? 'bg-white text-black' : 'bg-black text-white')
                        : (isDark ? 'bg-white/10 text-white/50 group-hover:text-white/90' : 'bg-black/5 text-black/50 group-hover:text-black/90')
                      }`}
                    >
                      <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h3 className={`font-semibold text-sm transition-colors duration-300 tracking-tight truncate
                        ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)] opacity-70 group-hover:opacity-100'}
                      `}>
                        {fx.label}
                      </h3>
                      <p className={`text-[10px] font-medium uppercase tracking-widest mt-0.5 transition-colors duration-300 truncate
                        ${isActive ? 'text-[var(--text-primary)] opacity-80' : 'text-[var(--text-muted)] group-hover:opacity-80'}
                      `}>
                        {fx.desc}
                      </p>
                    </div>
                    
                    {/* Active Indicator dot */}
                    {isActive && (
                      <div className={`absolute right-4 w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white' : 'bg-black'} shrink-0`} />
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
