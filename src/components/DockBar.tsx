"use client"

import { motion } from "framer-motion"
import { useConfigStore } from "@/store/useConfigStore"
import { ArrowUpRight, Monitor, Box, Layers, Moon, Sun, AlignRight, Waves, Aperture, Focus, Activity, MoonStar, Camera, Waypoints, Disc, Magnet } from "lucide-react"
import { LightingMode, StandMode } from "@/lib/types"

import { flushSync } from 'react-dom'

const BODY_COLORS = [
  { color: '#A32121', label: 'Красный МЗТА' },
  { color: '#2D2D2D', label: 'Графит' },
  { color: '#F0F0F0', label: 'Белый' },
  { color: '#1E3A5F', label: 'Синий' },
  { color: '#2D5A3D', label: 'Зелёный' },
]

const LIGHTING_MODES: { value: LightingMode, icon: any, label: string }[] = [
  { value: 'default', icon: Sun, label: 'Hero Lighting' },
  { value: 'blinds', icon: AlignRight, label: 'Window Blinds' },
  { value: 'caustics', icon: Waves, label: 'Caustic Pool' },
  { value: 'ring', icon: Aperture, label: 'Ring Light' },
  { value: 'tracking', icon: Focus, label: 'Mouse Tracking' },
  { value: 'breathing', icon: Activity, label: 'Breathing' },
  { value: 'eclipse', icon: MoonStar, label: 'Orbital Eclipse' },
]

const STAND_MODES: { value: StandMode, icon: any, label: string }[] = [
  { value: 'glass', icon: Box, label: 'Frosted Glass' },
  { value: 'void', icon: Disc, label: 'Magnetic Void' },
  { value: 'monolith', icon: Layers, label: 'Brutalist Monolith' },
  { value: 'quantum', icon: Magnet, label: 'Quantum Tilt' },
]

const MODES = [
  { key: 'annotations', icon: Waypoints, label: 'Спеки', getter: (s: ReturnType<typeof useConfigStore.getState>) => s.showAnnotations, toggle: (s: ReturnType<typeof useConfigStore.getState>) => s.setAnnotations(!s.showAnnotations) },
]

const ThemeTransitionStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation: none;
      mix-blend-mode: normal;
    }
    ::view-transition-old(root) {
      z-index: 1;
    }
    ::view-transition-new(root) {
      z-index: 9999;
    }
  `}} />
)

export function handleThemeToggleWithTransition(e: React.MouseEvent, store: ReturnType<typeof useConfigStore.getState>) {
  const nextTheme = store.theme === 'dark' ? 'light' : 'dark'

  // Safety check for Browser API
  if (!document.startViewTransition) {
    store.setTheme(nextTheme)
    return
  }

  const x = e.clientX
  const y = e.clientY

  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  )

  const transition = document.startViewTransition(() => {
    flushSync(() => {
      store.setTheme(nextTheme)
    })
  })

  transition.ready.then(() => {
    document.documentElement.animate(
      [
        { clipPath: `circle(0px at ${x}px ${y}px)`, filter: 'blur(24px)' },
        { clipPath: `circle(${endRadius}px at ${x}px ${y}px)`, filter: 'blur(0px)' }
      ],
      {
        duration: 900,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        pseudoElement: '::view-transition-new(root)',
      }
    )
  })
}

export function DockBar() {
  const store = useConfigStore()

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[80] pointer-events-auto"
    >
      <div className="flex items-center gap-0
        bg-white/70 dark:bg-[#111111]/70 backdrop-blur-3xl
        border border-black/[0.05] dark:border-white/[0.08]
        rounded-full
        shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)]
        p-1.5
        "
      >

        {/* ── Lighting Mode Toggle ── */}
        <div className="px-2 flex items-center">
          <button
            onClick={() => {
              const currentLightIdx = LIGHTING_MODES.findIndex(m => m.value === store.lightingMode)
              const nextLight = LIGHTING_MODES[(currentLightIdx + 1) % LIGHTING_MODES.length]
              store.setLightingMode(nextLight.value)
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 text-black/60 hover:text-black hover:bg-black/5 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10"
            title={`Свет: ${LIGHTING_MODES.find(m => m.value === store.lightingMode)?.label}`}
          >
            {(() => {
              const CurrentIcon = LIGHTING_MODES.find(m => m.value === store.lightingMode)?.icon || Sun
              return <CurrentIcon className="w-4 h-4" strokeWidth={1.5} />
            })()}
          </button>
        </div>

        {/* ── Stand Base Toggle ── */}
        <div className="pr-2 flex items-center">
          <button
            onClick={() => {
              const currentStandIdx = STAND_MODES.findIndex(m => m.value === store.standMode)
              const nextStand = STAND_MODES[(currentStandIdx + 1) % STAND_MODES.length]
              store.setStandMode(nextStand.value)
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 text-black/60 hover:text-black hover:bg-black/5 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10"
            title={`База: ${STAND_MODES.find(m => m.value === store.standMode)?.label}`}
          >
            {(() => {
              const CurrentIcon = STAND_MODES.find(m => m.value === store.standMode)?.icon || Box
              return <CurrentIcon className="w-4 h-4" strokeWidth={1.5} />
            })()}
          </button>
        </div>

        {/* ── Divider ── */}
        <div className="w-px h-6 bg-black/[0.1] dark:bg-white/[0.1] mx-1" />

        {/* ── Mode toggles ── */}
        <div className="flex items-center gap-0.5 px-2">
          {MODES.map((mode) => {
            const active = mode.getter(store)
            return (
              <button
                key={mode.key}
                onClick={() => mode.toggle(store)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-medium
                  transition-all duration-300
                  ${active
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'text-black/60 hover:text-black hover:bg-black/5 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10'
                  }`}
                title={mode.label}
              >
                <mode.icon className="w-4 h-4" strokeWidth={1.5} />
                <span className="hidden md:inline">{mode.label}</span>
              </button>
            )
          })}
          
          <button
            onClick={() => store.setShowFxPanel(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-medium transition-all duration-300 text-black/60 hover:text-purple-600 hover:bg-purple-500/10 dark:text-white/60 dark:hover:text-purple-400 dark:hover:bg-purple-500/20"
            title="FX Laboratory"
          >
            <Camera className="w-4 h-4" strokeWidth={1.5} />
            <span className="hidden md:inline">FX Lab</span>
          </button>
        </div>

        {/* ── Theme Tumbler (Right Side) ── */}
        <div className="pl-3 pr-1 py-1 ml-1 border-l border-black/[0.1] dark:border-white/[0.1] flex items-center">
          <ThemeTransitionStyles />
          <button
            onClick={(e) => handleThemeToggleWithTransition(e, store)}
            className={`relative flex items-center w-[44px] h-[24px] rounded-full transition-colors duration-300 focus:outline-none
              ${store.theme === 'dark' ? 'bg-[#2A2A2A] shadow-inner' : 'bg-[#E5E5E5] shadow-inner'}
            `}
            title="Переключить тему"
          >
            <motion.div
              layout
              initial={false}
              animate={{
                x: store.theme === 'dark' ? 22 : 2,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`absolute top-[2px] w-[20px] h-[20px] rounded-full flex items-center justify-center shadow-sm
                ${store.theme === 'dark' ? 'bg-[#111111]' : 'bg-white'}
              `}
            >
              {store.theme === 'dark' ? (
                <Moon className="w-[10px] h-[10px] text-white/80" strokeWidth={2.5} />
              ) : (
                <Sun className="w-[10px] h-[10px] text-black/60" strokeWidth={2.5} />
              )}
            </motion.div>
          </button>
        </div>

      </div>
    </motion.div>
  )
}

/* ── Mobile Dock (simplified) ── */
export function DockBarMobile() {
  const store = useConfigStore()

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="lg:hidden fixed bottom-3 left-3 right-3 z-[80] pointer-events-auto"
    >
      <div className="flex items-center justify-center gap-1
        bg-white/70 dark:bg-[#111111]/70 backdrop-blur-3xl
        border border-black/[0.05] dark:border-white/[0.08]
        rounded-2xl
        shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)]
        px-4 py-3"
      >
        {/* Mode toggles */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              const currentLightIdx = LIGHTING_MODES.findIndex(m => m.value === store.lightingMode)
              const nextLight = LIGHTING_MODES[(currentLightIdx + 1) % LIGHTING_MODES.length]
              store.setLightingMode(nextLight.value)
            }}
            className="p-2 rounded-full transition-all duration-300 text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
            title={`Свет: ${LIGHTING_MODES.find(m => m.value === store.lightingMode)?.label}`}
          >
            {(() => {
              const CurrentIcon = LIGHTING_MODES.find(m => m.value === store.lightingMode)?.icon || Sun
              return <CurrentIcon className="w-4 h-4" strokeWidth={1.5} />
            })()}
          </button>

          <button
            onClick={() => {
              const currentStandIdx = STAND_MODES.findIndex(m => m.value === store.standMode)
              const nextStand = STAND_MODES[(currentStandIdx + 1) % STAND_MODES.length]
              store.setStandMode(nextStand.value)
            }}
            className="p-2 rounded-full transition-all duration-300 text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
            title={`База: ${STAND_MODES.find(m => m.value === store.standMode)?.label}`}
          >
            {(() => {
              const CurrentIcon = STAND_MODES.find(m => m.value === store.standMode)?.icon || Box
              return <CurrentIcon className="w-4 h-4" strokeWidth={1.5} />
            })()}
          </button>
          
          <div className="w-px h-5 bg-black/[0.1] dark:bg-white/[0.1] mx-0.5" />

          {MODES.map((mode) => {
            const active = mode.getter(store)
            return (
              <button
                key={mode.key}
                onClick={() => mode.toggle(store)}
                className={`p-2 rounded-full transition-all duration-300
                  ${active ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'}`}
              >
                <mode.icon className="w-4 h-4" strokeWidth={1.5} />
              </button>
            )
          })}

          <button
            onClick={() => store.setShowFxPanel(true)}
            className="p-2 rounded-full transition-all duration-300 text-black/60 hover:text-purple-600 dark:text-white/60 dark:hover:text-purple-400"
            title="FX Lab"
          >
            <Camera className="w-4 h-4" strokeWidth={1.5} />
          </button>

          <div className="w-px h-5 bg-black/[0.1] dark:bg-white/[0.1] mx-0.5" />

          {/* Theme Tumbler */}
          <button
            onClick={(e) => handleThemeToggleWithTransition(e, store)}
            className={`relative flex items-center w-[40px] h-[22px] rounded-full transition-colors duration-300 focus:outline-none ml-1
              ${store.theme === 'dark' ? 'bg-[#2A2A2A] shadow-inner' : 'bg-[#E5E5E5] shadow-inner'}
            `}
            title="Переключить тему"
          >
            <motion.div
              layout
              initial={false}
              animate={{
                x: store.theme === 'dark' ? 20 : 2,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={`absolute top-[2px] w-[18px] h-[18px] rounded-full flex items-center justify-center shadow-sm
                ${store.theme === 'dark' ? 'bg-[#111111]' : 'bg-white'}
              `}
            >
              {store.theme === 'dark' ? (
                <Moon className="w-[10px] h-[10px] text-white/80" strokeWidth={2.5} />
              ) : (
                <Sun className="w-[10px] h-[10px] text-black/60" strokeWidth={2.5} />
              )}
            </motion.div>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
