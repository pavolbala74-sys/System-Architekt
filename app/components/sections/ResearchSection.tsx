'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const CONCEPTS = [
  {
    id: 'EDLS',
    title: 'Energy Loss Diagnostic System',
    status: 'Conceptual Framework',
    description:
      'A systematic methodology for non-invasive energy loss identification in complex multi-component systems. Combines thermodynamic accounting, flow measurement, and component-level modelling to produce a loss hierarchy — ordered by magnitude and optimisation leverage.',
    pillars: ['Loss Accounting', 'Thermal Mapping', 'Flow Measurement', 'Hierarchy Generation'],
    insight: 'Most systems have 2–3 dominant loss mechanisms responsible for 70% of total inefficiency.',
  },
  {
    id: 'FOM',
    title: 'Flow Optimisation Models',
    status: 'Analytical Framework',
    description:
      'Physics-based models for predicting and optimising flow behaviour in hydraulic and aerodynamic systems. Incorporates Reynolds number sensitivity, surface roughness effects, and geometry-dependent pressure distribution to identify optimal operating regimes.',
    pillars: ['Re Sensitivity', 'Surface Parametrics', 'Pressure Optimisation', 'Regime Control'],
    insight: 'Laminar flow maintenance in pipe networks can reduce friction losses by 50–80% vs turbulent flow.',
  },
  {
    id: 'MEA',
    title: 'Mechanical Efficiency Architecture',
    status: 'Design Framework',
    description:
      'A structured approach to mechanical system design that places efficiency as a primary constraint rather than an afterthought. Analyses power flow paths, identifies loss nodes, and sequences optimisation interventions by return-on-investment.',
    pillars: ['Power Flow Analysis', 'Loss Node Mapping', 'ROI Sequencing', 'Constraint Design'],
    insight: 'Addressing transmission losses before aerodynamic losses often yields higher total efficiency gains.',
  },
]

export default function ResearchSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section className="section-padding bg-[var(--color-bg-alt)] relative overflow-hidden" ref={ref}>

      {/* Background reference grid */}
      <div className="absolute inset-0 grid-reference opacity-60 pointer-events-none" />

      <div className="container-eng relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="rule-eng-accent" />
            <span className="label-engineering">Research Concepts</span>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-end">
            <h2
              className="font-display"
              style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 400, lineHeight: 1.1 }}
            >
              Conceptual frameworks
              <br />for systematic analysis
            </h2>
            <p className="prose-eng text-[14px] self-end">
              These frameworks represent analytical approaches developed through practical
              application. They are not products — they are ways of seeing and interrogating
              complex engineering systems.
            </p>
          </div>
        </motion.div>

        {/* Concept cards */}
        <div className="space-y-4">
          {CONCEPTS.map((concept, i) => (
            <motion.div
              key={concept.id}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.1 }}
              className="group border border-[var(--color-border)] bg-white
                hover:border-[var(--color-blue-accent)] transition-all duration-400 overflow-hidden"
            >
              <div className="grid md:grid-cols-[200px_1fr_260px] gap-0">

                {/* ID column */}
                <div className="p-6 border-r border-[var(--color-border)] flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[28px] font-300 text-[var(--color-graphite)]
                      group-hover:text-[var(--color-blue-accent)] transition-colors duration-300 block">
                      {concept.id}
                    </span>
                    <span className="label-engineering mt-2 block">{concept.status}</span>
                  </div>
                  <div className="w-8 h-px bg-[var(--color-border)] group-hover:bg-[var(--color-blue-accent)]
                    group-hover:w-16 transition-all duration-400 mt-6" />
                </div>

                {/* Main content */}
                <div className="p-6 border-r border-[var(--color-border)]">
                  <h3
                    className="font-display mb-3"
                    style={{ fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 400, lineHeight: 1.2 }}
                  >
                    {concept.title}
                  </h3>
                  <p className="text-[13px] font-300 text-[var(--color-text-muted)] leading-relaxed mb-4">
                    {concept.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {concept.pillars.map((p) => (
                      <span
                        key={p}
                        className="font-mono text-[10px] tracking-[0.1em] uppercase
                          px-2 py-1 bg-[var(--color-bg-alt)] text-[var(--color-text-muted)]"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Insight */}
                <div className="p-6 bg-[var(--color-bg-alt)] flex items-center">
                  <div>
                    <div className="label-engineering mb-2">Key Insight</div>
                    <p className="text-[13px] font-400 text-[var(--color-text-secondary)] leading-relaxed
                      italic">
                      "{concept.insight}"
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
