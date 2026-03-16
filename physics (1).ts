'use client'

import { useState, useRef, useMemo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface EngResults {
  usablePower: number   // kW
  lossKW: number        // kW
  efficiencyPct: number // %
  lossBreakdown: { label: string; kw: number; pct: number }[]
}

function calcEngineering(inputKW: number, efficiencyPct: number): EngResults {
  const eff = efficiencyPct / 100
  const usable = inputKW * eff
  const loss = inputKW * (1 - eff)

  // Distribute losses across typical mechanisms
  const frictionShare    = 0.42
  const turbulenceShare  = 0.28
  const thermalShare     = 0.18
  const electricalShare  = 0.12

  return {
    usablePower: usable,
    lossKW: loss,
    efficiencyPct: efficiencyPct,
    lossBreakdown: [
      { label: 'Friction',    kw: loss * frictionShare,   pct: (1 - eff) * frictionShare   * 100 },
      { label: 'Turbulence',  kw: loss * turbulenceShare,  pct: (1 - eff) * turbulenceShare * 100 },
      { label: 'Thermal',     kw: loss * thermalShare,     pct: (1 - eff) * thermalShare    * 100 },
      { label: 'Electrical',  kw: loss * electricalShare,  pct: (1 - eff) * electricalShare * 100 },
    ],
  }
}

// Animated counter
function AnimatedNumber({ value, decimals = 1, unit = '' }: { value: number; decimals?: number; unit?: string }) {
  return (
    <motion.span
      key={value.toFixed(decimals)}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="font-mono"
    >
      {value.toFixed(decimals)}{unit && <span className="text-[rgba(255,255,255,0.35)] text-[12px] ml-1">{unit}</span>}
    </motion.span>
  )
}

const SYSTEM_PRESETS = [
  { label: 'Electric Motor', eff: 93 },
  { label: 'ICE Vehicle',    eff: 38 },
  { label: 'Hydraulic Pump', eff: 75 },
  { label: 'Industrial Fan', eff: 70 },
  { label: 'Steam Turbine',  eff: 42 },
  { label: 'Wind Turbine',   eff: 45 },
]

export default function EnergyLossAnalyzer() {
  const t = useTranslations()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const [inputKW, setInputKW] = useState(100)
  const [efficiency, setEfficiency] = useState(72)

  const results = useMemo(() => calcEngineering(inputKW, efficiency), [inputKW, efficiency])

  // Doughnut chart
  const doughnutData = {
    labels: ['Usable Power', ...results.lossBreakdown.map(l => l.label)],
    datasets: [{
      data: [results.usablePower, ...results.lossBreakdown.map(l => l.kw)],
      backgroundColor: [
        'rgba(37, 99, 168, 0.85)',
        'rgba(154, 160, 168, 0.6)',
        'rgba(95, 99, 104, 0.6)',
        'rgba(60, 65, 72, 0.6)',
        'rgba(40, 44, 50, 0.6)',
      ],
      borderColor: [
        'rgba(37, 99, 168, 1)',
        'rgba(154, 160, 168, 0.8)',
        'rgba(95, 99, 104, 0.8)',
        'rgba(60, 65, 72, 0.8)',
        'rgba(40, 44, 50, 0.8)',
      ],
      borderWidth: 1,
    }],
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'rgba(255,255,255,0.45)',
          font: { family: 'JetBrains Mono, monospace', size: 10 },
          boxWidth: 10,
          padding: 12,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(8,15,24,0.95)',
        borderColor: 'rgba(37,99,168,0.3)',
        borderWidth: 1,
        bodyColor: 'rgba(255,255,255,0.8)',
        bodyFont: { family: 'JetBrains Mono, monospace', size: 12 },
        callbacks: {
          label: (item: { raw: number; label: string }) =>
            ` ${item.label}: ${item.raw.toFixed(1)} kW (${((item.raw / inputKW) * 100).toFixed(1)}%)`,
        },
      },
    },
  }

  // Bar chart — loss breakdown
  const barData = {
    labels: results.lossBreakdown.map(l => l.label),
    datasets: [{
      label: 'Loss (kW)',
      data: results.lossBreakdown.map(l => l.kw),
      backgroundColor: [
        'rgba(154, 160, 168, 0.55)',
        'rgba(114, 120, 128, 0.55)',
        'rgba(80, 85, 92, 0.55)',
        'rgba(52, 57, 64, 0.55)',
      ],
      borderColor: [
        'rgba(154, 160, 168, 0.9)',
        'rgba(114, 120, 128, 0.9)',
        'rgba(80, 85, 92, 0.9)',
        'rgba(52, 57, 64, 0.9)',
      ],
      borderWidth: 1,
      borderRadius: 1,
    }],
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(8,15,24,0.95)',
        borderColor: 'rgba(37,99,168,0.3)',
        borderWidth: 1,
        bodyColor: 'rgba(255,255,255,0.8)',
        bodyFont: { family: 'JetBrains Mono, monospace', size: 12 },
      },
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'rgba(255,255,255,0.3)', font: { family: 'JetBrains Mono, monospace', size: 10 } } },
      y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: 'rgba(255,255,255,0.3)', font: { family: 'JetBrains Mono, monospace', size: 10 } },
        title: { display: true, text: 'Power Loss (kW)', color: 'rgba(255,255,255,0.25)', font: { size: 10 } } },
    },
  }

  return (
    <section className="section-padding bg-[var(--color-bg-alt)] relative" ref={ref}>
      <div className="container-eng">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }} className="mb-12">
          <div className="flex items-center gap-4 mb-5">
            <div className="rule-eng-accent" />
            <span className="label-engineering">Energy Analysis Tool</span>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-end">
            <h2 className="font-display"
              style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 400, lineHeight: 1.1 }}>
              {t('energy_title')}
            </h2>
            <p className="prose-eng text-[14px]">{t('energy_desc')}</p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-[320px_1fr] gap-6">

          {/* Left: inputs + system presets */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6">

            {/* System presets */}
            <div className="p-6 border border-[var(--color-border)] bg-white">
              <div className="label-engineering mb-4">System Presets</div>
              <div className="grid grid-cols-2 gap-1.5">
                {SYSTEM_PRESETS.map(p => (
                  <button key={p.label} onClick={() => setEfficiency(p.eff)}
                    className={`py-2.5 px-3 text-left border transition-all duration-200 cursor-pointer ${
                      efficiency === p.eff
                        ? 'bg-[var(--color-text-primary)] border-[var(--color-text-primary)] text-white'
                        : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]'
                    }`}>
                    <div className="font-mono text-[9px] tracking-[0.1em] text-[var(--color-steel)] mb-0.5">{p.eff}% eff.</div>
                    <div className="font-mono text-[11px] text-inherit">{p.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="p-6 border border-[var(--color-border)] bg-white space-y-6">
              {/* Input power */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="label-engineering">{t('energy_input')}</label>
                  <span className="font-mono text-[14px] text-[var(--color-blue-accent)]">{inputKW} kW</span>
                </div>
                <input type="range" min={1} max={10000} step={1} value={inputKW}
                  onChange={e => setInputKW(Number(e.target.value))}
                  className="w-full accent-[var(--color-blue-accent)]" />
                <div className="flex justify-between mt-1"><span className="label-engineering">1 kW</span><span className="label-engineering">10 000 kW</span></div>
              </div>

              {/* Efficiency */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="label-engineering">{t('energy_efficiency')}</label>
                  <span className="font-mono text-[14px] text-[var(--color-blue-accent)]">{efficiency}%</span>
                </div>
                <input type="range" min={1} max={99} step={1} value={efficiency}
                  onChange={e => setEfficiency(Number(e.target.value))}
                  className="w-full accent-[var(--color-blue-accent)]" />
                {/* Efficiency reference bar */}
                <div className="mt-3 h-2 rounded overflow-hidden"
                  style={{ background: `linear-gradient(90deg, rgba(220,38,38,0.6) 0%, rgba(234,179,8,0.6) 40%, rgba(37,99,168,0.7) 70%, rgba(22,163,74,0.7) 100%)` }}>
                  <motion.div className="h-full w-0.5 bg-white"
                    animate={{ marginLeft: `${efficiency}%` }} transition={{ type: 'spring', stiffness: 200, damping: 30 }} />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="label-engineering text-red-400">Poor</span>
                  <span className="label-engineering text-yellow-400">Average</span>
                  <span className="label-engineering text-green-500">Excellent</span>
                </div>
              </div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: t('energy_usable'), value: results.usablePower, unit: 'kW', accent: true },
                { label: t('energy_loss'), value: results.lossKW, unit: 'kW', accent: false },
                { label: t('energy_eff_pct'), value: results.efficiencyPct, unit: '%', accent: false },
              ].map(card => (
                <div key={card.label}
                  className={`p-4 border text-center ${card.accent ? 'border-[var(--color-blue-accent)] bg-[rgba(37,99,168,0.04)]' : 'border-[var(--color-border)] bg-white'}`}>
                  <div className="label-engineering mb-1 text-center leading-tight">{card.label}</div>
                  <div className={`text-[20px] font-300 ${card.accent ? 'text-[var(--color-blue-accent)]' : 'text-[var(--color-text-primary)]'}`}>
                    <AnimatedNumber value={card.value} decimals={card.unit === '%' ? 0 : 1} unit={card.unit} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: charts */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="space-y-4">

            {/* Doughnut */}
            <div className="p-6 border border-[var(--color-border)] bg-white">
              <div className="label-engineering mb-4">Power Distribution</div>
              <div style={{ height: '240px' }}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>

            {/* Bar chart */}
            <div className="p-6 border border-[var(--color-border)] bg-white">
              <div className="label-engineering mb-4">Loss Breakdown by Mechanism</div>
              <div style={{ height: '200px' }}>
                <Bar data={barData} options={barOptions as Parameters<typeof Bar>[0]['options']} />
              </div>
            </div>

            {/* Insight callout */}
            <div className="p-6 border border-[var(--color-border)] bg-[var(--color-navy)] text-white">
              <div className="label-engineering text-[rgba(255,255,255,0.3)] mb-3">Diagnostic Insight</div>
              <p className="text-[13px] leading-relaxed text-[rgba(255,255,255,0.6)]">
                {efficiency < 50
                  ? `At ${efficiency}% efficiency, ${results.lossKW.toFixed(0)} kW is wasted. Primary targets: friction losses (${results.lossBreakdown[0].kw.toFixed(0)} kW) and turbulence (${results.lossBreakdown[1].kw.toFixed(0)} kW). A 10% improvement would recover ${(inputKW * 0.1).toFixed(0)} kW.`
                  : efficiency < 80
                  ? `At ${efficiency}% efficiency, the dominant loss pathway is mechanical friction at ${results.lossBreakdown[0].pct.toFixed(1)}% of input power. Surface treatment, lubrication optimisation, and bearing selection offer the highest return.`
                  : `At ${efficiency}% efficiency, the system is in the high-performance range. Remaining gains require precision engineering: surface finish optimisation, thermal management, and parasitic load reduction.`
                }
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
