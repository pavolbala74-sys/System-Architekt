'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const RHO = 1.225 // kg/m³ air density at sea level

function dragForce(v: number, Cd: number, A: number): number {
  return 0.5 * RHO * v * v * Cd * A
}

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onChange: (v: number) => void
  formula?: string
}

function EngSlider({ label, value, min, max, step, unit, onChange, formula }: SliderProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="label-engineering">{label}</label>
        <div className="flex items-center gap-2">
          {formula && <code className="font-mono text-[10px] text-[rgba(255,255,255,0.25)]">{formula}</code>}
          <span className="font-mono text-[14px] text-[var(--color-blue-accent)]">
            {value.toFixed(step < 0.1 ? 2 : step < 1 ? 1 : 0)} <span className="text-[11px] text-[rgba(255,255,255,0.35)]">{unit}</span>
          </span>
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-[var(--color-blue-accent)]" />
      <div className="flex justify-between mt-1">
        <span className="label-engineering">{min}</span>
        <span className="label-engineering">{max} {unit}</span>
      </div>
    </div>
  )
}

export default function DragCalculator() {
  const t = useTranslations()
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const [velocity, setVelocity] = useState(30)
  const [area, setArea] = useState(2.5)
  const [cd, setCd] = useState(0.30)

  const dragN = dragForce(velocity, cd, area)
  const powerKW = dragN * velocity / 1000

  // Chart data: drag vs velocity curve
  const velocityRange = Array.from({ length: 21 }, (_, i) => i * 5)
  const dragCurve = velocityRange.map(v => dragForce(v, cd, area))
  const currentDrag = dragForce(velocity, cd, area)

  const chartData = {
    labels: velocityRange.map(v => `${v}`),
    datasets: [
      {
        label: 'Drag Force (N)',
        data: dragCurve,
        borderColor: 'rgba(37, 99, 168, 0.9)',
        backgroundColor: 'rgba(37, 99, 168, 0.08)',
        borderWidth: 1.5,
        pointRadius: 0,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Current operating point',
        data: velocityRange.map(v => (Math.abs(v - velocity) < 2.6 ? currentDrag : null)),
        borderColor: 'rgba(255, 255, 255, 0.6)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderWidth: 0,
        pointRadius: velocityRange.map(v => (Math.abs(v - velocity) < 2.6 ? 5 : 0)),
        pointHoverRadius: 7,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(13,27,42,0.95)',
        borderColor: 'rgba(37,99,168,0.4)',
        borderWidth: 1,
        titleColor: 'rgba(255,255,255,0.5)',
        bodyColor: 'rgba(255,255,255,0.85)',
        titleFont: { family: 'JetBrains Mono, monospace', size: 10 },
        bodyFont: { family: 'JetBrains Mono, monospace', size: 12 },
        callbacks: {
          title: (items: { label: string }[]) => `v = ${items[0].label} m/s`,
          label: (item: { raw: number }) => `F_d = ${item.raw?.toFixed(0)} N`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: 'rgba(255,255,255,0.3)', font: { family: 'JetBrains Mono, monospace', size: 10 } },
        title: { display: true, text: 'Velocity (m/s)', color: 'rgba(255,255,255,0.25)', font: { size: 10 } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: 'rgba(255,255,255,0.3)', font: { family: 'JetBrains Mono, monospace', size: 10 } },
        title: { display: true, text: 'Drag Force (N)', color: 'rgba(255,255,255,0.25)', font: { size: 10 } },
      },
    },
  }

  const CD_PRESETS = [
    { label: 'Sphere', value: 0.47 },
    { label: 'Sedan', value: 0.30 },
    { label: 'SUV', value: 0.38 },
    { label: 'Sports', value: 0.24 },
    { label: 'Truck', value: 0.80 },
    { label: 'Cylinder', value: 1.05 },
  ]

  return (
    <section className="section-padding bg-[var(--color-navy)] relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="container-eng relative z-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }} className="mb-12">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-6 h-px bg-[rgba(255,255,255,0.25)]" />
            <span className="label-engineering">Drag Analysis Tool</span>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-end">
            <h2 className="font-display text-white"
              style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 400, lineHeight: 1.1 }}>
              {t('drag_calc_title')}
            </h2>
            <p className="text-[rgba(255,255,255,0.4)] text-[14px] leading-relaxed">
              {t('drag_calc_desc')}
            </p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-[360px_1fr] gap-6">

          {/* Controls */}
          <motion.div initial={{ opacity: 0, x: -24 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="p-7 border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] space-y-7">

            <EngSlider label={t('drag_velocity')} value={velocity} min={0} max={100} step={1}
              unit="m/s" formula="v" onChange={setVelocity} />
            <EngSlider label={t('drag_area')} value={area} min={0.1} max={20} step={0.1}
              unit="m²" formula="A" onChange={setArea} />
            <EngSlider label={t('drag_cd')} value={cd} min={0.01} max={1.5} step={0.01}
              unit="" formula="Cd" onChange={setCd} />

            {/* Cd presets */}
            <div>
              <div className="label-engineering mb-3">Cd Reference Shapes</div>
              <div className="grid grid-cols-3 gap-1.5">
                {CD_PRESETS.map(p => (
                  <button key={p.label} onClick={() => setCd(p.value)}
                    className={`py-1.5 font-mono text-[10px] tracking-[0.08em] border transition-all duration-200 cursor-pointer ${
                      Math.abs(cd - p.value) < 0.005
                        ? 'bg-[var(--color-blue-accent)] border-[var(--color-blue-accent)] text-white'
                        : 'border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.4)] hover:border-[rgba(255,255,255,0.3)]'
                    }`}>
                    {p.label}<br />{p.value}
                  </button>
                ))}
              </div>
            </div>

            {/* Result cards */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[rgba(255,255,255,0.07)]">
              <div className="p-4 bg-[rgba(37,99,168,0.12)] border border-[rgba(37,99,168,0.2)]">
                <div className="label-engineering mb-1">{t('drag_result')}</div>
                <div className="font-mono text-[26px] font-300 text-white leading-none">
                  {dragN >= 1000 ? `${(dragN/1000).toFixed(1)} kN` : `${dragN.toFixed(0)} N`}
                </div>
              </div>
              <div className="p-4 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)]">
                <div className="label-engineering mb-1">Power required</div>
                <div className="font-mono text-[26px] font-300 text-white leading-none">
                  {powerKW >= 100 ? `${(powerKW/1000).toFixed(2)} MW` : `${powerKW.toFixed(1)} kW`}
                </div>
              </div>
            </div>

            {/* Formula display */}
            <div className="p-4 border border-[rgba(255,255,255,0.06)] font-mono text-[11px] text-[rgba(255,255,255,0.3)] leading-relaxed">
              F = ½ × {RHO} × {velocity}² × {cd} × {area.toFixed(1)}<br />
              F = <span className="text-[var(--color-blue-accent)]">{dragN.toFixed(1)} N</span>
            </div>
          </motion.div>

          {/* Chart */}
          <motion.div initial={{ opacity: 0, x: 24 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="p-7 border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)]">
            <div className="label-engineering mb-4">Drag Force vs Velocity — F<sub>d</sub> ∝ v²</div>
            <div style={{ height: '320px' }}>
              <Line data={chartData} options={chartOptions as Parameters<typeof Line>[0]['options']} />
            </div>
            <p className="mt-4 text-[11px] font-300 text-[rgba(255,255,255,0.25)] leading-relaxed">
              Drag force scales quadratically with velocity. Doubling speed requires 4× more drag force and 8× more power to overcome. ρ = {RHO} kg/m³ (sea level, 15°C).
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
