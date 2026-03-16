/**
 * Unit tests – Energy Loss Calculator logic
 * Tests the pure calculation functions independently of UI
 */

// ── Calculation helpers (extracted for testability) ──────────────────
type SystemType = 'vehicle' | 'ship' | 'aircraft' | 'pipeline' | 'industrial'

interface CalcInputs {
  systemType: SystemType
  velocity: number   // km/h
  surfaceArea: number // m²
  power: number      // kW
}

interface CalcResults {
  aeroDrag: number
  frictionLoss: number
  turbulenceLoss: number
  totalLoss: number
  efficiency: number
  optimisationPotential: number
}

const SYSTEM_PARAMS: Record<SystemType, { cd: number; cf: number; turbFactor: number }> = {
  vehicle:    { cd: 0.30,  cf: 0.015, turbFactor: 0.12 },
  ship:       { cd: 0.60,  cf: 0.003, turbFactor: 0.22 },
  aircraft:   { cd: 0.025, cf: 0.004, turbFactor: 0.08 },
  pipeline:   { cd: 0.02,  cf: 0.018, turbFactor: 0.18 },
  industrial: { cd: 0.15,  cf: 0.025, turbFactor: 0.20 },
}

const RHO_AIR   = 1.225
const RHO_WATER = 1025

function calcResults(inputs: CalcInputs): CalcResults {
  const { systemType, velocity, surfaceArea, power } = inputs
  const params = SYSTEM_PARAMS[systemType]
  const rho = systemType === 'ship' ? RHO_WATER : RHO_AIR
  const v = velocity / 3.6

  const aeroDrag       = 0.5 * rho * v * v * params.cd * surfaceArea
  const frictionLoss   = power * 1000 * params.cf
  const turbulenceLoss = power * 1000 * params.turbFactor
  const totalLoss      = aeroDrag * v + frictionLoss + turbulenceLoss
  const totalPowerW    = power * 1000
  const efficiency     = Math.max(20, Math.min(95, ((totalPowerW - totalLoss) / totalPowerW) * 100))
  const optimisationPotential = Math.min(40, (100 - efficiency) * 0.6)

  return {
    aeroDrag:               Math.round(aeroDrag),
    frictionLoss:           Math.round(frictionLoss / 1000),
    turbulenceLoss:         Math.round(turbulenceLoss / 1000),
    totalLoss:              Math.round(totalLoss / 1000),
    efficiency:             Math.round(efficiency * 10) / 10,
    optimisationPotential:  Math.round(optimisationPotential * 10) / 10,
  }
}

// ── Tests ─────────────────────────────────────────────────────────────
describe('Energy Loss Calculator – core logic', () => {

  describe('Vehicle system', () => {
    const base: CalcInputs = {
      systemType: 'vehicle',
      velocity: 120,
      surfaceArea: 2.2,
      power: 150,
    }

    test('returns positive values for all outputs', () => {
      const r = calcResults(base)
      expect(r.aeroDrag).toBeGreaterThan(0)
      expect(r.frictionLoss).toBeGreaterThan(0)
      expect(r.turbulenceLoss).toBeGreaterThan(0)
      expect(r.totalLoss).toBeGreaterThan(0)
    })

    test('efficiency is clamped between 20 and 95', () => {
      const r = calcResults(base)
      expect(r.efficiency).toBeGreaterThanOrEqual(20)
      expect(r.efficiency).toBeLessThanOrEqual(95)
    })

    test('optimisation potential is clamped to max 40%', () => {
      const r = calcResults(base)
      expect(r.optimisationPotential).toBeLessThanOrEqual(40)
      expect(r.optimisationPotential).toBeGreaterThanOrEqual(0)
    })

    test('higher velocity produces higher aero drag', () => {
      const low  = calcResults({ ...base, velocity: 60  })
      const high = calcResults({ ...base, velocity: 200 })
      expect(high.aeroDrag).toBeGreaterThan(low.aeroDrag)
    })

    test('larger surface area produces higher aero drag', () => {
      const small = calcResults({ ...base, surfaceArea: 1.0 })
      const large = calcResults({ ...base, surfaceArea: 5.0 })
      expect(large.aeroDrag).toBeGreaterThan(small.aeroDrag)
    })

    test('higher power produces higher friction and turbulence losses', () => {
      const low  = calcResults({ ...base, power: 50  })
      const high = calcResults({ ...base, power: 500 })
      expect(high.frictionLoss).toBeGreaterThan(low.frictionLoss)
      expect(high.turbulenceLoss).toBeGreaterThan(low.turbulenceLoss)
    })
  })

  describe('Ship system uses water density', () => {
    test('ship drag is much higher than equivalent air system', () => {
      const inputs: CalcInputs = { systemType: 'vehicle', velocity: 30, surfaceArea: 10, power: 500 }
      const shipInputs: CalcInputs = { ...inputs, systemType: 'ship' }
      const vehicle = calcResults(inputs)
      const ship    = calcResults(shipInputs)
      // Water density (1025) >> air density (1.225) so ship drag >> vehicle drag
      expect(ship.aeroDrag).toBeGreaterThan(vehicle.aeroDrag)
    })
  })

  describe('Aircraft system', () => {
    test('aircraft has very low Cd resulting in low aero drag', () => {
      const aircraft: CalcInputs = { systemType: 'aircraft', velocity: 850, surfaceArea: 100, power: 20000 }
      const r = calcResults(aircraft)
      // Even at high speed, efficient aircraft should have measurable but bounded drag
      expect(r.aeroDrag).toBeGreaterThan(0)
    })
  })

  describe('Edge cases', () => {
    test('zero velocity produces near-zero aero drag', () => {
      const inputs: CalcInputs = { systemType: 'vehicle', velocity: 0.001, surfaceArea: 2.2, power: 150 }
      const r = calcResults(inputs)
      expect(r.aeroDrag).toBeLessThan(10)
    })

    test('minimum power inputs produce valid results', () => {
      const inputs: CalcInputs = { systemType: 'vehicle', velocity: 10, surfaceArea: 0.5, power: 10 }
      const r = calcResults(inputs)
      expect(r.efficiency).toBeGreaterThanOrEqual(20)
      expect(r.efficiency).toBeLessThanOrEqual(95)
    })

    test('all system types return defined results', () => {
      const systemTypes: SystemType[] = ['vehicle', 'ship', 'aircraft', 'pipeline', 'industrial']
      systemTypes.forEach(systemType => {
        const r = calcResults({ systemType, velocity: 100, surfaceArea: 5, power: 500 })
        expect(r).toBeDefined()
        expect(r.efficiency).toBeGreaterThan(0)
      })
    })
  })

  describe('Physics invariants', () => {
    test('drag force scales quadratically with velocity', () => {
      const base: CalcInputs = { systemType: 'vehicle', velocity: 100, surfaceArea: 2, power: 200 }
      const r1 = calcResults(base)
      const r2 = calcResults({ ...base, velocity: 200 })
      // F_d ∝ v², so doubling v should ~4× aero drag
      const ratio = r2.aeroDrag / r1.aeroDrag
      expect(ratio).toBeGreaterThan(3.5)
      expect(ratio).toBeLessThan(4.5)
    })
  })
})
