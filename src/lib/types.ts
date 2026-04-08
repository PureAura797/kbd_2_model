export type LightingMode = 'default' | 'blinds' | 'caustics' | 'ring' | 'tracking' | 'breathing' | 'eclipse'

export type StandMode = 'glass' | 'void' | 'monolith' | 'quantum'

export type SpecId = string | null

export type FXKey = 
  | 'macroFocus' | 'mouseFocus' | 'breathingFocus' 
  | 'dollyZoom' | 'whipPan' | 'crashZoom'
  | 'cameraShake' | 'dutchAngle'
  | 'chromaticAberration' | 'scrollBlur' | 'anamorphicFlares'
  | 'vignette' | 'scanline' | 'glitch' | 'noise'

export interface ConfigState {
  theme: 'light' | 'dark';
  lightingMode: LightingMode;
  standMode: StandMode;
  activeSpec: SpecId;
  activeFx: Record<FXKey, boolean>;
  showFxPanel: boolean;
  showAnnotations: boolean;
  bodyColor: string;
  buttonsColor: string;
  screenOn: boolean;
  lightIntensity: number;
  environment: 'studio' | 'city' | 'warehouse';
  wireframe: boolean;
  exploded: boolean;
  amount: number;
  layout: 'line' | 'cinematic';
}
