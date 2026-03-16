'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const FIELDS = [
  {
    id: '01',
    title: 'Energy Loss Diagnostics',
    description:
      'Systematic identification and quantification of energy dissipation pathways across complex systems. Thermal analysis, loss accounting, efficiency benchmarking.',
    tags: ['Thermal Analysis', 'Loss Mapping', 'Benchmarking'],
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="0.75" />
        <path d="M20 8v12l8 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <circle cx="20" cy="20" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: '02',
    title: 'Friction & Surface Interaction',
    description:
      'Analysis of surface contact mechanics, tribological phenomena, lubrication regimes, and material interface behaviour under operational conditions.',
    tags: ['Tribology', 'Surface Science', 'Lubrication'],
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <rect x="4" y="16" width="32" height="8" rx="1" stroke="currentColor" strokeWidth="0.75" />
        <path d="M10 16V8M20 16V8M30 16V8" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" />
        <path d="M4 20h32" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    id: '03',
    title: 'Hydrodynamic Flow Optimization',
    description:
      'Fluid dynamics analysis for pipe networks, marine systems, pumping infrastructure, and hydraulic machinery. Pressure drop reduction and flow regime control.',
    tags: ['CFD', 'Pipe Networks', 'Marine Systems'],
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <path d="M4 20 Q10 12 20 20 Q30 28 36 20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <path d="M4 26 Q10 18 20 26 Q30 34 36 26" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" opacity="0.4" />
        <path d="M4 14 Q10 6 20 14 Q30 22 36 14" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" opacity="0.4" />
        <circle cx="36" cy="20" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: '04',
    title: 'Aerodynamic Efficiency',
    description:
      'Drag characterisation and reduction for ground vehicles, aircraft, and structural systems. Boundary layer analysis, flow separation control, and wake management.',
    tags: ['Drag Reduction', 'Boundary Layer', 'Flow Control'],
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <path d="M8 20 Q16 14 28 20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <path d="M28 20 C32 18 34 16 36 20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <path d="M28 20 C32 22 34 24 36 20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <path d="M18 14 C20 10 22 8 24 10" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    id: '05',
    title: 'Mechanical System Architecture',
    description:
      'Holistic design and analysis of mechanical transmission systems, drivetrain efficiency, power flow optimisation, and mechanical advantage structures.',
    tags: ['Drivetrain', 'Power Flow', 'Transmission'],
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <circle cx="14" cy="20" r="8" stroke="currentColor" strokeWidth="0.75" />
        <circle cx="26" cy="20" r="6" stroke="currentColor" strokeWidth="0.75" />
        <circle cx="14" cy="20" r="2" fill="currentColor" />
        <circle cx="26" cy="20" r="1.5" fill="currentColor" />
        <line x1="22" y1="20" x2="18" y2="20" stroke="currentColor" strokeWidth="0.75" />
      </svg>
    ),
  },
  {
    id: '06',
    title: 'Industrial Efficiency Systems',
    description:
      'Energy efficiency auditing and optimisation for industrial processes, manufacturing systems, HVAC, compressors, and large-scale mechanical infrastructure.',
    tags: ['Energy Audit', 'Process Optimisation', 'HVAC'],
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
        <rect x="6" y="10" width="28" height="20" rx="1" stroke="currentColor" strokeWidth="0.75" />
        <path d="M12 20h16" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <path d="M12 15h8M12 25h8" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" opacity="0.5" />
        <circle cx="30" cy="20" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
]

export default function FieldsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="fields" className="section-padding section-dark" ref={ref}>
      <div className="container-eng">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-6 h-px bg-[rgba(255,255,255,0.3)]" />
            <span className="label-engineering">Engineering Domains</span>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <h2
              className="font-display text-white"
              style={{ fontSize: 'clamp(30px, 3.5vw, 50px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em' }}
            >
              Six domains.
              <br />
              One analytical approach.
            </h2>
            <p className="prose-eng text-[rgba(255,255,255,0.55)] self-end">
              Each domain represents a distinct class of physical energy loss. Together they form
              a diagnostic framework for complex multi-system inefficiency analysis.
            </p>
          </div>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(255,255,255,0.06)]">
          {FIELDS.map((field, i) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.08 }}
              className="group p-8 bg-[var(--color-navy)] hover:bg-[rgba(37,99,168,0.08)]
                transition-colors duration-400 cursor-default relative overflow-hidden"
            >
              {/* Hover accent line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-[var(--color-blue-accent)]
                scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              {/* Number + Icon */}
              <div className="flex items-start justify-between mb-6">
                <span className="font-mono text-[11px] text-[rgba(255,255,255,0.25)] tracking-[0.2em]">
                  {field.id}
                </span>
                <div className="text-[rgba(255,255,255,0.4)] group-hover:text-[rgba(255,255,255,0.7)]
                  transition-colors duration-300">
                  {field.icon}
                </div>
              </div>

              {/* Title */}
              <h3
                className="font-display text-white mb-3"
                style={{ fontSize: '22px', fontWeight: 400, lineHeight: 1.2 }}
              >
                {field.title}
              </h3>

              {/* Description */}
              <p className="text-[13px] font-300 text-[rgba(255,255,255,0.45)] leading-relaxed mb-6">
                {field.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {field.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] tracking-[0.12em] uppercase
                      px-2 py-1 border border-[rgba(255,255,255,0.1)]
                      text-[rgba(255,255,255,0.35)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
