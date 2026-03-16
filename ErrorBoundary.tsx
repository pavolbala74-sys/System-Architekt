'use client'

import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'

// SVG diagram components
function BoundaryLayerDiagram() {
  return (
    <svg viewBox="0 0 400 200" fill="none" className="w-full max-w-lg" aria-label="Boundary layer diagram">
      {/* Plate surface */}
      <rect x="20" y="160" width="360" height="4" fill="var(--color-steel)" opacity="0.4" />
      <text x="20" y="175" className="font-mono" fontSize="9" fill="var(--color-steel)" fontFamily="monospace">
        Surface
      </text>

      {/* Flow arrows – laminar */}
      {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((frac, i) => {
        const baseLen = 280 * frac
        const y = 155 - i * 16
        return (
          <g key={i}>
            <motion.line
              x1="20" y1={y} x2={20 + baseLen} y2={y}
              stroke="var(--color-blue-accent)"
              strokeWidth={0.8}
              strokeLinecap="round"
              opacity={0.3 + frac * 0.5}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.05 * i }}
            />
            <polygon
              points={`${20 + baseLen},${y} ${20 + baseLen - 6},${y - 3} ${20 + baseLen - 6},${y + 3}`}
              fill="var(--color-blue-accent)"
              opacity={0.3 + frac * 0.5}
            />
          </g>
        )
      })}

      {/* Boundary layer envelope */}
      <motion.path
        d="M20 160 Q100 140 200 80 Q280 40 380 20"
        stroke="var(--color-blue-accent)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
      />

      {/* Labels */}
      <text x="230" y="75" fontSize="9" fill="var(--color-blue-accent)" fontFamily="monospace" opacity="0.8">
        δ — boundary layer
      </text>
      <text x="300" y="140" fontSize="9" fill="var(--color-steel)" fontFamily="monospace">
        Free stream U∞
      </text>

      {/* Flow direction */}
      <text x="20" y="20" fontSize="8" fill="var(--color-text-muted)" fontFamily="monospace">
        ← Flow direction
      </text>
    </svg>
  )
}

function LaminarTurbulentDiagram() {
  return (
    <svg viewBox="0 0 400 180" fill="none" className="w-full max-w-lg" aria-label="Laminar vs turbulent flow">
      {/* Pipe */}
      <rect x="10" y="40" width="380" height="100" rx="2" stroke="var(--color-border-strong)" strokeWidth="1" fill="none" />

      {/* Transition point */}
      <line x1="200" y1="40" x2="200" y2="140" stroke="var(--color-steel)" strokeWidth="0.5" strokeDasharray="3 3" />
      <text x="185" y="30" fontSize="8" fill="var(--color-steel)" fontFamily="monospace">Re ≈ 2300</text>

      {/* Laminar streamlines */}
      {[-30, -15, 0, 15, 30].map((offset, i) => (
        <motion.path
          key={`lam-${i}`}
          d={`M10 ${90 + offset} Q105 ${90 + offset} 200 ${90 + offset}`}
          stroke="var(--color-blue-accent)"
          strokeWidth="0.8"
          fill="none"
          opacity="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.1 * i }}
        />
      ))}

      {/* Turbulent squiggles */}
      {[-25, -10, 5, 20, 35].map((offset, i) => (
        <motion.path
          key={`turb-${i}`}
          d={`M200 ${88 + offset} Q220 ${80 + offset} 240 ${96 + offset} Q260 ${82 + offset} 280 ${92 + offset} Q300 ${78 + offset} 320 ${94 + offset} Q340 ${80 + offset} 380 ${88 + offset}`}
          stroke="var(--color-steel)"
          strokeWidth="0.8"
          fill="none"
          opacity="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.5 + 0.08 * i }}
        />
      ))}

      {/* Labels */}
      <text x="80" y="170" fontSize="9" fill="var(--color-blue-accent)" fontFamily="monospace">Laminar (low Re)</text>
      <text x="255" y="170" fontSize="9" fill="var(--color-steel)" fontFamily="monospace">Turbulent (high Re)</text>
    </svg>
  )
}

const MECHANISMS = [
  {
    title: 'Hydrodynamic Drag',
    formula: 'F_d = ½ρv²C_dA',
    description: 'Pressure difference between leading and trailing surfaces creates form drag. Dominant in blunt bodies and at high Reynolds numbers.',
  },
  {
    title: 'Aerodynamic Drag',
    formula: 'P = F_d · v = ½ρv³C_dA',
    description: 'Power required to overcome air resistance scales with the cube of velocity. A 10% speed increase demands 33% more power.',
  },
  {
    title: 'Rolling Resistance',
    formula: 'F_r = C_rr · N',
    description: 'Viscoelastic deformation losses in tyre-road contact patch. Temperature, pressure, and surface texture are primary variables.',
  },
  {
    title: 'Pipe Friction',
    formula: 'ΔP = f · (L/D) · ½ρv²',
    description: 'Darcy-Weisbach friction losses in pipeline flow. Friction factor f varies by regime: Hagen-Poiseuille (laminar) vs Colebrook (turbulent).',
  },
]

export default function AnalysisSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const t = useTranslations()

  return (
    <section id="analysis" className="section-padding bg-[var(--color-bg)]" ref={ref}>
      <div className="container-eng">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="rule-eng-accent" />
            <span className="label-engineering">{t('analysis_label')}</span>
          </div>
          <h2
            className="font-display"
            style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 400, lineHeight: 1.1 }}
          >
            {t('analysis_title')}
          </h2>
        </motion.div>

        {/* Two columns: diagrams + mechanisms */}
        <div className="grid md:grid-cols-2 gap-16 mb-20">

          {/* Diagrams */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-12"
          >
            <div>
              <div className="label-engineering mb-4">{t('analysis_diagram1_label')}</div>
              <div className="p-6 border border-[var(--color-border)] bg-[var(--color-bg-alt)]">
                <BoundaryLayerDiagram />
              </div>
            </div>
            <div>
              <div className="label-engineering mb-4">{t('analysis_diagram2_label')}</div>
              <div className="p-6 border border-[var(--color-border)] bg-[var(--color-bg-alt)]">
                <LaminarTurbulentDiagram />
              </div>
            </div>
          </motion.div>

          {/* Mechanism cards */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-4"
          >
            {MECHANISMS.map((m, i) => (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.35 + i * 0.1 }}
                className="p-6 border border-[var(--color-border)] group
                  hover:border-[var(--color-blue-accent)] transition-colors duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-display" style={{ fontSize: '18px', fontWeight: 400 }}>
                    {m.title}
                  </h3>
                  <code
                    className="font-mono text-[11px] text-[var(--color-blue-accent)]
                      bg-[rgba(37,99,168,0.06)] px-2 py-0.5 rounded-sm whitespace-nowrap"
                  >
                    {m.formula}
                  </code>
                </div>
                <p className="text-[13px] font-300 text-[var(--color-text-muted)] leading-relaxed">
                  {m.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Flow regimes comparison bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="p-8 border border-[var(--color-border)]"
        >
          <div className="label-engineering mb-6">Reynolds Number Regime Classification</div>
          <div className="relative h-10">
            {/* Gradient bar */}
            <div
              className="absolute inset-y-0 left-0 right-0 rounded-sm"
              style={{
                background:
                  'linear-gradient(90deg, rgba(37,99,168,0.3) 0%, rgba(37,99,168,0.15) 35%, rgba(154,160,168,0.2) 50%, rgba(95,99,104,0.3) 75%, rgba(28,33,40,0.25) 100%)',
              }}
            />
            {/* Regime labels */}
            {[
              { label: 'Stokes', pos: '5%', Re: 'Re < 1' },
              { label: 'Laminar', pos: '20%', Re: 'Re < 2300' },
              { label: 'Transitional', pos: '45%', Re: '2300–4000' },
              { label: 'Turbulent', pos: '70%', Re: 'Re > 4000' },
              { label: 'Fully turbulent', pos: '90%', Re: 'Re → ∞' },
            ].map((regime) => (
              <div
                key={regime.label}
                className="absolute top-0 bottom-0 flex flex-col justify-center"
                style={{ left: regime.pos }}
              >
                <div className="w-px h-full bg-white/30 absolute inset-y-0" />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="font-mono text-[10px] text-[var(--color-blue-accent)]">Stokes Re&lt;1</span>
            <span className="font-mono text-[10px] text-[var(--color-text-muted)]">Laminar</span>
            <span className="font-mono text-[10px] text-[var(--color-steel)]">Transitional</span>
            <span className="font-mono text-[10px] text-[var(--color-text-secondary)]">Turbulent</span>
            <span className="font-mono text-[10px] text-[var(--color-text-primary)]">Fully Turbulent</span>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
