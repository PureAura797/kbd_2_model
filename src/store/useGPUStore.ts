import { create } from 'zustand'
import { QualityTier, GPUInfo, QualitySettings, detectGPU, getQualitySettings } from '@/lib/gpu-detect'

interface GPUStore {
  /** Whether detection has completed */
  detected: boolean
  /** Raw GPU info from detection */
  gpuInfo: GPUInfo | null
  /** Current quality tier */
  tier: QualityTier
  /** Resolved settings for this tier */
  settings: QualitySettings
  /** Whether user has manually overridden the tier */
  userOverride: boolean
  /** Run GPU detection (call once on mount) */
  detect: () => void
  /** Allow user to manually force a tier */
  setTier: (tier: QualityTier) => void
}

export const useGPUStore = create<GPUStore>((set) => ({
  detected: false,
  gpuInfo: null,
  tier: 'high',
  settings: getQualitySettings('high'),
  userOverride: false,

  detect: () => {
    try {
      const info = detectGPU()
      
      // Log to console for debugging
      console.log(
        `%c[GPU] ${info.renderer}%c → Tier: ${info.tier.toUpperCase()} (${info.reason})`,
        'color: #888; font-weight: bold',
        `color: ${info.tier === 'high' ? '#4CAF50' : info.tier === 'medium' ? '#FF9800' : '#f44336'}; font-weight: bold`
      )
      if (info.tier !== 'high') {
        console.log(
          `%c[GPU] Quality reduced: ${info.reason}`,
          'color: #FF9800'
        )
      }

      set({
        detected: true,
        gpuInfo: info,
        tier: info.tier,
        settings: getQualitySettings(info.tier),
      })
    } catch (e) {
      console.warn('[GPU] Detection failed, defaulting to medium tier', e)
      set({
        detected: true,
        gpuInfo: null,
        tier: 'medium',
        settings: getQualitySettings('medium'),
      })
    }
  },

  setTier: (tier) => set({
    tier,
    settings: getQualitySettings(tier),
    userOverride: true,
  }),
}))
