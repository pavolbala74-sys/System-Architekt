'use client'

import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'

const SYSTEMS = [
  {
    id: 'vehicle',
    label: 'Road Vehicle',
    category: 'Ground Transport',
    losses: [
      { name: 'Aerodynamic drag',      pct: 35, notes: 'Cd ≈ 0.25–0.45. Dominant above 100 km/h' },
      { name: 'Rolling resistance',    pct: 25, notes: 'Tyre deformation losses. Load and speed dependent' },
      { name: 'Drivetrain friction',   pct: 15, notes: 'Gearbox, differential, bearing losses' },
      { name: 'Braking losses',        pct: 15, notes: 'Kinetic energy dissipated as heat' },
      { name: 'Auxiliary systems',     pct: 10, notes: 'HVAC, power steering, alternator parasitic loads' },
    ],
    keyMetric: '~65% of fuel energy never reaches the wheels',
    insight: 'Aerodynamic drag scales with v³ — halving drag coefficient halves power required at speed.',
  },
  {
    id: 'marine',
    label: 'Marine Vessel',
    category: 'Maritime Transport',
    losses: [
      { name: 'Wave-making resistance', pct: 30, notes: 'Energy dissipated in bow wave formation' },
      { name: 'Viscous friction',      pct: 40, notes: 'Hull wetted surface friction. Dominant in slow ships' },
      { name: 'Propeller losses',      pct: 15, notes: 'Propulsive efficiency typically 60–70%' },
      { name: 'Engine-transmission',   pct: 10, notes: 'Shaft, bearing and gearbox losses' },
      { name: 'Appendage drag',        pct: 5,  notes: 'Rudder, bilge keels, shaft struts' },
    ],
    keyMetric: '~50% of engine power lost in hull resistance',
    insight: 'Biofouling increases hull roughness — adding 15–30% extra resistance within months.',
  },
  {
    id: 'pump',
    label: 'Pumping System',
    category: 'Industrial Process',
    losses: [
      { name: 'Pipe friction losses',  pct: 40, notes: 'Darcy-Weisbach losses. Strong diameter dependence' },
      { name: 'Motor losses',          pct: 10, notes: 'Electrical and thermal losses in motor' },
      { name: 'Pump hydraulic loss',   pct: 20, notes: 'Impeller and volute inefficiencies' },
      { name: 'Throttling losses',     pct: 20, notes: 'Control valve pressure drop — avoidable with VFD' },
      { name: 'Minor losses',          pct: 10, notes: 'Fittings, bends, transitions, valves' },
    ],
    keyMetric: '~40% of pumping energy wasted in throttle valves alone',
    insight: 'Variable frequency drives eliminate throttling losses — typical payback < 18 months.',
  },
  {
    id: 'aircraft',
    label: 'Aircraft',
    category: 'Aerospace',
    losses: [
      { name: 'Induced drag',          pct: 40, notes: 'Lift-dependent drag. Dominant at low speed / high α' },
      { name: 'Parasite drag',         pct: 35, notes: 'Form + skin friction at cruise. Scales with v²' },
      { name: 'Engine thermal losses', pct: 15, notes: 'Carnot efficiency limitations in thermodynamic cycle' },
      { name: 'Wave drag',             pct: 5,  notes: 'Transonic/supersonic compressibility effects' },
      { name: 'Interference drag',     pct: 5,  notes: 'Wing-fuselage and nacelle junction losses' },
    ],
    keyMetric: 'Only ~30% of fuel energy produces useful thrust',
    insight: 'Winglets reduce induced drag by 3–5%, saving ~300–400 tonnes of fuel per aircraft per year.',
  },
]

export default function SystemsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const t = useTranslations()
  const [active, setActive] = useState(SYSTEMS[0])

  return (
    <section id="systems" className="section-padding bg-[var(--color-bg)]" ref={ref}>
      <div className="container-eng">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="rule-eng-accent" />
            <span className="label-engineering">{t('systems_label')}</span>
          </div>
          <h2 className="font-display" style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 400, lineHeight: 1.1 }}>
            Where energy disappears
            <br />in real systems
          </h2>
        </motion.div>

        {/* System tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap gap-px border border-[var(--color-border)] mb-8 overflow-hidden"
        >
          {SYSTEMS.map((sys) => (
            <button
              key={sys.id}
              onClick={() => setActive(sys)}
              className={`flex-1 min-w-[120px] px-5 py-3.5 font-mono text-[11px] tracking-[0.1em]
                uppercase transition-all duration-200 cursor-pointer
                ${active.id === sys.id
                  ? 'bg-[var(--color-text-primary)] text-white'
                  : 'bg-white text-[var(--color-text-muted)] hover:bg-[var(--color-bg-alt)]'
                }`}
            >
              {sys.label}
            </button>
          ))}
        </motion.div>

        {/* System detail */}
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-[1fr_320px] gap-8"
        >
          {/* Loss breakdown */}
          <div className="border border-[var(--color-border)] p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="label-engineering mb-1">{active.category}</div>
                <h3 className="font-display text-2xl">{active.label} — Energy Loss Map</h3>
              </div>
            </div>

            <div className="space-y-4">
              {active.losses.map((loss, i) => (
                <motion.div
                  key={loss.name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] font-400 text-[var(--color-text-secondary)]">{loss.name}</span>
                    <span className="font-mono text-[14px] font-300">{loss.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-[var(--color-graphite)] rounded overflow-hidden mb-1">
                    <motion.div
                      className="h-full rounded"
                      style={{
                        background: `linear-gradient(90deg, var(--color-blue-accent), rgba(37,99,168,${0.4 + loss.pct/150}))`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${loss.pct}%` }}
                      transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <p className="label-engineering">{loss.notes}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Key insight panel */}
          <div className="space-y-4">
            <div className="p-6 bg-[var(--color-navy)] text-white">
              <div className="label-engineering text-[rgba(255,255,255,0.35)] mb-4">Key Metric</div>
              <p className="font-display text-lg leading-snug text-white/90">
                {active.keyMetric}
              </p>
            </div>

            <div className="p-6 border border-[var(--color-border)]">
              <div className="label-engineering mb-3">{t('systems_insight')}</div>
              <p className="text-[13px] font-300 text-[var(--color-text-secondary)] leading-relaxed">
                {active.insight}
              </p>
            </div>

            {/* Total losses visual */}
            <div className="p-6 border border-[var(--color-border)]">
              <div className="label-engineering mb-4">{t('systems_distribution')}</div>
              <div className="flex h-8 rounded overflow-hidden gap-px">
                {active.losses.map((loss, i) => (
                  <motion.div
                    key={loss.name}
                    initial={{ flex: 0 }}
                    animate={{ flex: loss.pct }}
                    transition={{ duration: 1, delay: i * 0.08 }}
                    className="h-full"
                    style={{
                      background: `rgba(37,99,168,${0.2 + i * 0.15})`,
                    }}
                    title={`${loss.name}: ${loss.pct}%`}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3">
                {active.losses.map((loss) => (
                  <span key={loss.name} className="label-engineering">{loss.pct}% {loss.name.split(' ')[0]}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
