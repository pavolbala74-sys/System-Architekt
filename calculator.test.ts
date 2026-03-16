/**
 * Engineering utility functions
 */

// ── Physics helpers ──────────────────────────────────────────────────
export const RHO_AIR   = 1.225   // kg/m³ at sea level, 15°C
export const RHO_WATER = 1025    // kg/m³ seawater
export const G         = 9.81    // m/s²
export const MU_AIR    = 1.81e-5 // Pa·s dynamic viscosity of air
export const MU_WATER  = 1.00e-3 // Pa·s dynamic viscosity of water

/** Convert km/h to m/s */
export const kmhToMs = (kmh: number): number => kmh / 3.6

/** Convert m/s to km/h */
export const msToKmh = (ms: number): number => ms * 3.6

/** Calculate Reynolds number */
export const reynoldsNumber = (
  velocity: number,   // m/s
  length: number,     // m (characteristic length)
  fluid: 'air' | 'water' = 'air'
): number => {
  const rho = fluid === 'air' ? RHO_AIR : RHO_WATER
  const mu  = fluid === 'air' ? MU_AIR  : MU_WATER
  return (rho * velocity * length) / mu
}

/** Determine flow regime from Reynolds number */
export const flowRegime = (re: number): 'laminar' | 'transitional' | 'turbulent' => {
  if (re < 2300) return 'laminar'
  if (re < 4000) return 'transitional'
  return 'turbulent'
}

/** Aerodynamic drag force (N) */
export const dragForce = (
  rho: number,  // kg/m³
  v: number,    // m/s
  cd: number,   // drag coefficient
  A: number     // reference area m²
): number => 0.5 * rho * v * v * cd * A

/** Power to overcome drag (W) */
export const dragPower = (F_drag: number, v: number): number => F_drag * v

/** Darcy-Weisbach pressure drop (Pa) */
export const darcyWeisbach = (
  f: number,    // Darcy friction factor
  L: number,    // pipe length m
  D: number,    // pipe diameter m
  rho: number,  // fluid density kg/m³
  v: number     // flow velocity m/s
): number => f * (L / D) * 0.5 * rho * v * v

/** Colebrook equation approximation (Churchill, 1977) for friction factor */
export const frictionFactor = (re: number, roughness = 0.0001): number => {
  if (re < 2300) return 64 / re  // Hagen-Poiseuille laminar
  // Swamee-Jain approximation
  return 0.25 / Math.pow(Math.log10(roughness / 3.7 + 5.74 / Math.pow(re, 0.9)), 2)
}

/** Format number with SI suffix */
export const formatSI = (n: number, unit = '', decimals = 1): string => {
  const abs = Math.abs(n)
  if (abs >= 1e9) return `${(n / 1e9).toFixed(decimals)} G${unit}`
  if (abs >= 1e6) return `${(n / 1e6).toFixed(decimals)} M${unit}`
  if (abs >= 1e3) return `${(n / 1e3).toFixed(decimals)} k${unit}`
  return `${n.toFixed(decimals)} ${unit}`
}

/** Clamp a value between min and max */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

/** Linear interpolation */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

/** Map a value from one range to another */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin)
