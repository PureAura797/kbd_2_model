/**
 * GPU Capability Detection & Quality Tier System
 * 
 * Detects WebGL support and GPU capabilities, then assigns
 * a quality tier (high / medium / low / fallback) to gracefully
 * degrade the 3D experience on weak hardware.
 * 
 * Known problem: Intel UHD 620/630 on Windows has buggy OpenGL
 * drivers that cause WebGL context loss with:
 *   - MeshTransmissionMaterial (FBO render pass)
 *   - EffectComposer with multisampling
 *   - DepthOfField (multiple render targets)
 * 
 * Apple GPUs (even old A12) work perfectly thanks to Metal backend.
 */

export type QualityTier = 'high' | 'medium' | 'low' | 'fallback'

export interface GPUInfo {
  tier: QualityTier
  renderer: string
  vendor: string
  webglVersion: number
  maxTextureSize: number
  maxRenderbufferSize: number
  hasFloatTextures: boolean
  hasFloatBlend: boolean
  isMobile: boolean
  reason: string // Why this tier was chosen
}

// Known problematic GPU patterns (regex)
const LOW_TIER_PATTERNS = [
  /Intel.*UHD.*6[0-3]0/i,          // Intel UHD 620/630 — most office laptops
  /Intel.*HD.*Graphics\s*(5|6)\d{2}/i, // Intel HD 520/530/620/630
  /Intel.*Iris.*Plus/i,             // Intel Iris Plus (pre-Xe)
  /Intel.*HD.*Graphics$/i,          // Generic Intel HD (very old)
  /SwiftShader/i,                   // Software renderer (Chrome fallback)
  /llvmpipe/i,                      // Mesa software renderer (Linux)
  /Microsoft Basic Render/i,        // Windows software renderer
]

const MEDIUM_TIER_PATTERNS = [
  /Intel.*Iris.*Xe/i,               // Intel Iris Xe — decent but not great
  /Intel.*UHD.*7[0-9]{2}/i,        // Intel UHD 7xx — newer, okayish
  /Adreno.*[3-5]\d{2}/i,           // Qualcomm Adreno 3xx-5xx (older mobile)
  /Mali.*G[5-6]\d/i,               // ARM Mali G5x-G6x (mid-range mobile)
  /PowerVR/i,                       // PowerVR (older devices)
]

/**
 * Detect GPU capabilities and assign quality tier.
 * Must be called on client side only.
 */
export function detectGPU(): GPUInfo {
  const result: GPUInfo = {
    tier: 'high',
    renderer: 'unknown',
    vendor: 'unknown',
    webglVersion: 0,
    maxTextureSize: 0,
    maxRenderbufferSize: 0,
    hasFloatTextures: false,
    hasFloatBlend: false,
    isMobile: false,
    reason: '',
  }

  // Mobile detection
  result.isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry/i.test(navigator.userAgent)

  // Try WebGL2 first, then WebGL1
  const canvas = document.createElement('canvas')
  let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null

  gl = canvas.getContext('webgl2') as WebGL2RenderingContext | null
  if (gl) {
    result.webglVersion = 2
  } else {
    gl = canvas.getContext('webgl') as WebGLRenderingContext | null
    if (gl) {
      result.webglVersion = 1
    }
  }

  // No WebGL at all → fallback
  if (!gl) {
    result.tier = 'fallback'
    result.reason = 'WebGL not available'
    return result
  }

  // Get GPU info via debug extension
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
  if (debugInfo) {
    result.renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'unknown'
    result.vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'unknown'
  }

  // Capabilities
  result.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0
  result.maxRenderbufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) || 0
  
  // Float texture support (needed for TransmissionMaterial)
  result.hasFloatTextures = !!(
    gl.getExtension('OES_texture_float') ||
    gl.getExtension('OES_texture_float_linear') ||
    result.webglVersion === 2
  )
  
  // Float blend (needed for TransmissionMaterial FBO)
  result.hasFloatBlend = !!(
    gl.getExtension('EXT_float_blend') ||
    result.webglVersion === 2
  )

  // Clean up
  const loseExt = gl.getExtension('WEBGL_lose_context')
  if (loseExt) loseExt.loseContext()

  // ═══ TIER ASSIGNMENT ═══

  // Check for known low-tier GPUs
  for (const pattern of LOW_TIER_PATTERNS) {
    if (pattern.test(result.renderer)) {
      result.tier = 'low'
      result.reason = `Known problematic GPU: ${result.renderer}`
      return result
    }
  }

  // Check for medium-tier GPUs
  for (const pattern of MEDIUM_TIER_PATTERNS) {
    if (pattern.test(result.renderer)) {
      result.tier = 'medium'
      result.reason = `Mid-range GPU: ${result.renderer}`
      return result
    }
  }

  // WebGL1 only → medium at best
  if (result.webglVersion < 2) {
    result.tier = 'medium'
    result.reason = 'Only WebGL1 available'
    return result
  }

  // Missing critical extensions → medium
  if (!result.hasFloatTextures || !result.hasFloatBlend) {
    result.tier = 'medium'
    result.reason = 'Missing float texture/blend extensions'
    return result
  }

  // Small texture size → low (very old GPU)
  if (result.maxTextureSize < 4096) {
    result.tier = 'low'
    result.reason = `Small max texture size: ${result.maxTextureSize}`
    return result
  }

  // Mobile with decent GPU → medium (conserve battery/thermals)
  if (result.isMobile && !/Apple.*GPU/i.test(result.renderer)) {
    result.tier = 'medium'
    result.reason = 'Non-Apple mobile GPU — conserving resources'
    return result
  }

  // Everything else → high
  result.tier = 'high'
  result.reason = `Capable GPU: ${result.renderer}`
  return result
}

/**
 * Scene configuration per quality tier.
 * Controls which heavy features are enabled.
 */
export interface QualitySettings {
  // Renderer
  dpr: [number, number]
  antialias: boolean

  // PostProcessing
  multisampling: number
  enableBloom: boolean
  enableDOF: boolean
  enableSMAA: boolean

  // Materials
  useTransmissionMaterial: boolean
  transmissionResolution: number

  // Shadows
  contactShadowResolution: number
  enableContactShadows: boolean

  // Environment
  environmentBlur: number
}

export function getQualitySettings(tier: QualityTier): QualitySettings {
  switch (tier) {
    case 'high':
      return {
        dpr: [1, 2],
        antialias: true,
        multisampling: 4,
        enableBloom: true,
        enableDOF: true,
        enableSMAA: true,
        useTransmissionMaterial: true,
        transmissionResolution: 1024,
        contactShadowResolution: 512,
        enableContactShadows: true,
        environmentBlur: 0.8,
      }
    case 'medium':
      return {
        dpr: [1, 1.5],
        antialias: true,
        multisampling: 0,          // No MSAA — big perf saver
        enableBloom: true,
        enableDOF: false,           // DOF off — saves render targets
        enableSMAA: true,
        useTransmissionMaterial: false, // Standard glass instead
        transmissionResolution: 512,
        contactShadowResolution: 256,
        enableContactShadows: true,
        environmentBlur: 0.8,
      }
    case 'low':
      return {
        dpr: [1, 1],
        antialias: false,           // No AA
        multisampling: 0,
        enableBloom: false,         // No postprocessing
        enableDOF: false,
        enableSMAA: false,
        useTransmissionMaterial: false,
        transmissionResolution: 256,
        contactShadowResolution: 256,
        enableContactShadows: false, // No contact shadows
        environmentBlur: 1.0,
      }
    case 'fallback':
    default:
      return {
        dpr: [1, 1],
        antialias: false,
        multisampling: 0,
        enableBloom: false,
        enableDOF: false,
        enableSMAA: false,
        useTransmissionMaterial: false,
        transmissionResolution: 256,
        contactShadowResolution: 256,
        enableContactShadows: false,
        environmentBlur: 1.0,
      }
  }
}
