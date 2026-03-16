'use client'

import { useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

type SystemType = 'vehicle' | 'ship' | 'aircraft' | 'pipeline' | 'industrial'

interface CalcInputs {
  systemType: SystemType
  velocity: number
  surfaceArea: number
  power: number
}

interface CalcResults {
  aeroDrag: number
  frictionLoss: number
  turbulenceLoss: number
  totalLoss: number
  efficiency: number
  optimisationPotential: number
}

const SYSTEM_PARAMS: Record<SystemType, { cd: number; cf: number; turbFactor: number; label: string }> = {
  vehicle:    { cd: 0.30, cf: 0.015, turbFactor: 0.12, label: 'Road Vehicle' },
  ship:       { cd: 0.60, cf: 0.003, turbFactor: 0.22, label: 'Marine Vessel' },
  aircraft:   { cd: 0.025, cf: 0.004, turbFactor: 0.08, label: 'Aircraft' },
  pipeline:   { cd: 0.02, cf: 0.018, turbFactor: 0.18, label: 'Pipeline System' },
  industrial: { cd: 0.15, cf: 0.025, turbFactor: 0.20, label: 'Industrial Machine' },
}

const RHO_AIR   = 1.225 // kg/m³
const RHO_WATER = 1025  // kg/m³

function calcResults(inputs: CalcInputs): CalcResults {
  const { systemType, velocity, surfaceArea, power } = inputs
  const params = SYSTEM_PARAMS[systemType]
  const rho = systemType === 'ship' ? RHO_WATER : RHO_AIR

  const v = velocity / 3.6 // m/s
  const aeroDrag = 0.5 * rho * v * v * params.cd * surfaceArea
  const frictionLoss = power * 1000 * params.cf
  const turbulenceLoss = power * 1000 * params.turbFactor

  const totalLoss = aeroDrag * v + frictionLoss + turbulenceLoss
  const totalPowerW = power * 1000
  const efficiency = Math.max(20, Math.min(95, ((totalPowerW - totalLoss) / totalPowerW) * 100))
  const optimisationPotential = Math.min(40, (100 - efficiency) * 0.6)

  return {
    aeroDrag: Math.round(aeroDrag),
    frictionLoss: Math.round(frictionLoss / 1000),
    turbulenceLoss: Math.round(turbulenceLoss / 1000),
    totalLoss: Math.round(totalLoss / 1000),
    efficiency: Math.round(efficiency * 10) / 10,
    optimisationPotential: Math.round(optimisationPotential * 10) / 10,
  }
}

function GaugeCircle({ value, max = 100, label, color }: { value: number; max?: number; label: string; color: string }) {
  const pct = value / max
  const r = 36
  const circ = 2 * Math.PI * r
  const dash = circ * pct

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx="44" cy="44" r={r} fill="none" stroke="var(--color-border)" strokeWidth="4" />
        <motion.circle
          cx="44" cy="44" r={r}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${circ}`}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          transform="rotate(-90 44 44)"
        />
        <text x="44" y="48" textAnchor="middle" fontSize="15" fontFamily="JetBrains Mono, monospace" fontWeight="300" fill="var(--color-text-primary)">
          {value.toFixed(1)}
        </text>
      </svg>
      <span className="label-engineering">{label}</span>
    </div>
  )
}

export default function ToolsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const [inputs, setInputs] = useState<CalcInputs>({
    systemType: 'vehicle',
    velocity: 120,
    surfaceArea: 2.2,
    power: 150,
  })

  const [results, setResults] = useState<CalcResults>(() => calcResults(inputs))

  useEffect(() => {
    setResults(calcResults(inputs))
  }, [inputs])

  const set = <K extends keyof CalcInputs>(key: K, value: CalcInputs[K]) =>
    setInputs(prev => ({ ...prev, [key]: value }))

  return (
    <section id="tools" className="section-padding bg-[var(--color-bg-alt)]" ref={ref}>
      <div className="container-eng">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="rule-eng-accent" />
            <span className="label-engineering">Interactive Engineering Tools</span>
          </div>
          <h2 className="font-display" style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 400, lineHeight: 1.1 }}>
            Energy Loss Calculator
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-px bg-[var(--color-border)]">

          {/* Inputs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-[var(--color-bg)] p-8 space-y-6"
          >
            <div className="label-engineering mb-2">System Configuration</div>

            {/* System type */}
            <div>
              <label className="label-engineering block mb-2">System Type</label>
              <select
                className="input-eng select-eng"
                value={inputs.systemType}
                onChange={e => set('systemType', e.target.value as SystemType)}
              >
                {Object.entries(SYSTEM_PARAMS).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>

            {/* Velocity slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="label-engineering">Velocity</label>
                <span className="font-mono text-[13px] text-[var(--color-blue-accent)]">
                  {inputs.velocity} km/h
                </span>
              </div>
              <input
                type="range" min={10} max={400} step={5}
                value={inputs.velocity}
                onChange={e => set('velocity', Number(e.target.value))}
                className="w-full accent-[var(--color-blue-accent)]"
              />
              <div className="flex justify-between label-engineering mt-1">
                <span>10</span><span>400 km/h</span>
              </div>
            </div>

            {/* Surface area */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="label-engineering">Reference Area</label>
                <span className="font-mono text-[13px] text-[var(--color-blue-accent)]">
                  {inputs.surfaceArea} m²
                </span>
              </div>
              <input
                type="range" min={0.5} max={50} step={0.1}
                value={inputs.surfaceArea}
                onChange={e => set('surfaceArea', Number(e.target.value))}
                className="w-full accent-[var(--color-blue-accent)]"
              />
            </div>

            {/* Power */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="label-engineering">Input Power</label>
                <span className="font-mono text-[13px] text-[var(--color-blue-accent)]">
                  {inputs.power} kW
                </span>
              </div>
              <input
                type="range" min={10} max={5000} step={10}
                value={inputs.power}
                onChange={e => set('power', Number(e.target.value))}
                className="w-full accent-[var(--color-blue-accent)]"
              />
            </div>

            {/* Drag coefficient reference */}
            <div className="pt-4 border-t border-[var(--color-border)]">
              <div className="label-engineering mb-2">Reference Coefficients</div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { k: 'Cd (drag)', v: SYSTEM_PARAMS[inputs.systemType].cd },
                  { k: 'Cf (friction)', v: SYSTEM_PARAMS[inputs.systemType].cf },
                ].map(item => (
                  <div key={item.k} className="p-3 bg-[var(--color-bg-alt)]">
                    <div className="label-engineering">{item.k}</div>
                    <div className="font-mono text-[16px] font-300 mt-1">{item.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-[var(--color-bg)] p-8"
          >
            <div className="label-engineering mb-6">Analysis Results</div>

            {/* Gauge row */}
            <div className="flex justify-around mb-8">
              <GaugeCircle
                value={results.efficiency}
                label="Efficiency %"
                color="var(--color-blue-accent)"
              />
              <GaugeCircle
                value={results.optimisationPotential}
                label="Optimisation %"
                color="var(--color-steel)"
              />
            </div>

            {/* Loss breakdown */}
            <div className="space-y-3">
              {[
                { label: 'Aerodynamic / Hydrodynamic Drag', value: results.aeroDrag, unit: 'N', barPct: Math.min(100, results.aeroDrag / 10) },
                { label: 'Friction Losses', value: results.frictionLoss, unit: 'kW', barPct: Math.min(100, (results.frictionLoss / results.totalLoss) * 100 || 0) },
                { label: 'Turbulence Losses', value: results.turbulenceLoss, unit: 'kW', barPct: Math.min(100, (results.turbulenceLoss / results.totalLoss) * 100 || 0) },
                { label: 'Total Power Loss', value: results.totalLoss, unit: 'kW', barPct: Math.min(100, (results.totalLoss / inputs.power) * 100) },
              ].map((item) => (
                <div key={item.label} className="p-3 bg-[var(--color-bg-alt)]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="label-engineering">{item.label}</span>
                    <span className="font-mono text-[14px]">
                      {item.value.toLocaleString()} <span className="text-[var(--color-steel)] text-[11px]">{item.unit}</span>
                    </span>
                  </div>
                  <div className="h-1 bg-[var(--color-graphite)] rounded overflow-hidden">
                    <motion.div
                      className="h-full bg-[var(--color-blue-accent)] rounded"
                      animate={{ width: `${item.barPct}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Note */}
            <p className="mt-6 text-[11px] font-300 text-[var(--color-text-muted)] leading-relaxed">
              Simplified analytical model. Results are indicative. Full diagnostic requires
              system-specific CFD analysis and measured performance data.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
