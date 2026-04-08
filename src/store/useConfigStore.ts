import { create } from 'zustand'
import { ConfigState, StandMode, SpecId } from '@/lib/types'

interface ConfigStore extends ConfigState {
  setTheme: (theme: 'light' | 'dark') => void
  setLightingMode: (mode: ConfigState['lightingMode']) => void
  setStandMode: (mode: StandMode) => void
  setActiveSpec: (id: SpecId | null) => void
  toggleFx: (key: import('@/lib/types').FXKey) => void
  setShowFxPanel: (show: boolean) => void
  setAnnotations: (show: boolean) => void
  setBodyColor: (color: string) => void
  setButtonsColor: (color: string) => void
  setScreenOn: (on: boolean) => void
  setLightIntensity: (intensity: number) => void
  setEnvironment: (env: 'studio' | 'city' | 'warehouse') => void
  setWireframe: (on: boolean) => void
  setExploded: (on: boolean) => void
  setAmount: (amount: number) => void
  setLayout: (layout: 'line' | 'cinematic') => void
  reset: () => void
}

const DEFAULT_CONFIG: ConfigState = {
  theme: 'light',
  lightingMode: 'default',
  standMode: 'glass',
  activeSpec: null,
  activeFx: {
    macroFocus: false,
    mouseFocus: false,
    breathingFocus: false,
    dollyZoom: false,
    whipPan: false,
    crashZoom: false,
    cameraShake: false,
    dutchAngle: false,
    chromaticAberration: false,
    scrollBlur: false,
    anamorphicFlares: false,
    vignette: false,
    scanline: false,
    glitch: false,
    noise: false
  },
  showFxPanel: false,
  showAnnotations: false,
  bodyColor: '#A32121',
  buttonsColor: '#000000',
  screenOn: true,
  lightIntensity: 1.0,
  environment: 'studio',
  wireframe: false,
  exploded: false,
  amount: 0,
  layout: 'cinematic',
}

export const useConfigStore = create<ConfigStore>((set) => ({
  ...DEFAULT_CONFIG,

  setTheme: (theme) => set({ theme }),
  setLightingMode: (mode) => set({ lightingMode: mode }),
  setStandMode: (mode) => set({ standMode: mode }),
  setActiveSpec: (id) => set({ activeSpec: id }),
  toggleFx: (key) => set((state) => ({ activeFx: { ...state.activeFx, [key]: !state.activeFx[key] } })),
  setShowFxPanel: (show) => set({ showFxPanel: show }),
  setAnnotations: (show) => set({ showAnnotations: show }),
  setBodyColor: (color) => set({ bodyColor: color }),
  setButtonsColor: (color) => set({ buttonsColor: color }),
  setScreenOn: (on) => set({ screenOn: on }),
  setLightIntensity: (intensity) => set({ lightIntensity: intensity }),
  setEnvironment: (env) => set({ environment: env }),
  setWireframe: (on) => set({ wireframe: on }),
  setExploded: (on) => set({ exploded: on }),
  setAmount: (amount) => set({ amount }),
  setLayout: (layout) => set({ layout }),
  reset: () => set(DEFAULT_CONFIG),
}))
