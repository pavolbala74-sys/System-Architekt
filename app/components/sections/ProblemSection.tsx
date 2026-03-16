'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const LOSS_TYPES = [
  {
    label: 'Friction',
    value: '40%',
    description: 'Surface contact losses in mechanical components, bearings, seals and joints',
    color: 'var(--color-blue-accent)',
  },
  {
    label: 'Turbulence',
    value: '25%',
    description: 'Chaotic flow structures that dissipate kinetic energy as heat and sound',
    color: 'var(--color-steel)',
  },
  {
    label: 'Drag',
    value: '20%',
    description: 'Aerodynamic and hydrodynamic resistance forces opposing motion',
    color: 'var(--color-text-secondary)',
  },
  {
    label: 'Hidden Losses',
    value: '15%',
    description: 'Component interaction inefficiencies invisible without systems analysis',
    color: 'var(--color-text-muted)',
  },
]

function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return { ref, isInView }
}

export default function ProblemSection() {
  const { ref, isInView } = useScrollAnimation()

  return (
    <section id="problem" className="section-padding bg-[var(--color-bg)]" ref={ref}>
      <div className="container-eng">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="rule-eng-accent" />
            <span className="label-engineering">The Core Problem</span>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-start">
            <h2
              className="font-display"
              style={{
                fontSize: 'clamp(32px, 4vw, 56px)',
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              Most complex systems
              <br />
              <em style={{ color: 'var(--color-blue-accent)' }}>waste</em> enormous
              <br />
              amounts of energy
            </h2>

            <div className="prose-eng">
              <p>
                Modern engineering systems — vehicles, ships, industrial machinery, pipelines,
                aircraft — operate far below their theoretical efficiency limits. The gap between
                ideal and actual performance is filled by friction, turbulence, drag, and hidden
                mechanical inefficiencies.
              </p>
              <p>
                These losses are not random. They follow physical laws, emerge from specific
                system configurations, and can be diagnosed with precision. Systems thinking
                reveals them. Engineering corrects them.
              </p>
              <p>
                The question is not whether inefficiencies exist — it is where they hide
                and how large they are.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Loss type bars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--color-border)]">
          {LOSS_TYPES.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.1 }}
              className="bg-[var(--color-bg)] p-8 group"
            >
              {/* Bar chart */}
              <div className="mb-6 h-1 bg-[var(--color-graphite)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: item.value } : {}}
                  transition={{ duration: 1.2, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full"
                  style={{ background: item.color }}
                />
              </div>

              {/* Value */}
              <div
                className="font-mono mb-2"
                style={{
                  fontSize: '36px',
                  fontWeight: 300,
                  letterSpacing: '-0.04em',
                  color: item.color,
                }}
              >
                {item.value}
              </div>

              <div className="label-engineering mb-3">{item.label}</div>
              <p className="font-body text-[13px] font-300 text-[var(--color-text-muted)] leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Systems thinking callout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 p-10 border border-[var(--color-border)] relative overflow-hidden"
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                'linear-gradient(135deg, rgba(37,99,168,0.05) 0%, transparent 60%)',
            }}
          />
          <div className="relative grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <h3
                className="font-display mb-4"
                style={{ fontSize: 'clamp(22px, 2.5vw, 34px)', fontWeight: 400 }}
              >
                Systems thinking can diagnose these losses with precision.
              </h3>
              <p className="prose-eng text-[15px]">
                Rather than optimizing components in isolation, a holistic view of system
                interactions reveals the true sources of inefficiency — and the highest-leverage
                points for improvement.
              </p>
            </div>
            <div className="flex justify-center md:justify-end">
              <div className="text-center">
                <div className="metric-value mb-2">10–40%</div>
                <div className="label-engineering">Efficiency improvement achievable<br />through systematic diagnosis</div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
