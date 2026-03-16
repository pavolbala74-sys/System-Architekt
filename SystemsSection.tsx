'use client'

import { motion, useInView } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useRef } from 'react'

const QUESTIONS = [
  {
    n: '01',
    q: 'Where does most energy disappear in complex systems?',
    hint: 'The answer is rarely obvious without systematic loss accounting across all subsystems.',
  },
  {
    n: '02',
    q: 'How much efficiency is lost through friction and turbulence?',
    hint: 'In typical industrial machinery: 30–50% of input energy never reaches the intended output.',
  },
  {
    n: '03',
    q: 'Can hidden inefficiencies be diagnosed before redesign?',
    hint: 'Yes. Non-invasive measurement and analytical modelling can reveal losses without disassembly.',
  },
  {
    n: '04',
    q: 'What is the cost of boundary layer separation in aerodynamic systems?',
    hint: 'Flow separation creates pressure drag that can represent 60–80% of total aerodynamic resistance.',
  },
  {
    n: '05',
    q: 'Why do most optimization projects fail to reach their targets?',
    hint: 'Component-level optimization without systems analysis addresses symptoms, not root causes.',
  },
  {
    n: '06',
    q: 'How does surface roughness affect energy loss at scale?',
    hint: 'A 10% increase in surface roughness can increase turbulent flow friction by 15–25%.',
  },
]

export default function QuestionsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const t = useTranslations()

  return (
    <section className="section-padding bg-[var(--color-bg-alt)] relative overflow-hidden" ref={ref}>

      {/* Large background text */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          font-display text-[200px] font-400 text-[var(--color-graphite)]
          whitespace-nowrap pointer-events-none select-none opacity-40 hide-mobile"
        aria-hidden="true"
        style={{ letterSpacing: '-0.05em' }}
      >
        Why?
      </div>

      <div className="container-eng relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="rule-eng-accent" />
            <span className="label-engineering">{t('questions_label')}</span>
          </div>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(28px, 3.5vw, 48px)',
              fontWeight: 400,
              lineHeight: 1.1,
              maxWidth: '480px',
            }}
          >
            {t('questions_title')}
          </h2>
        </motion.div>

        {/* Questions list */}
        <div className="divide-y divide-[var(--color-border)]">
          {QUESTIONS.map((item, i) => (
            <motion.div
              key={item.n}
              initial={{ opacity: 0, x: -16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.07 }}
              className="group py-8 grid md:grid-cols-[60px_1fr_1fr] gap-4 md:gap-12 items-start
                hover:bg-white/40 transition-colors duration-300 px-4 -mx-4 rounded-sm"
            >
              {/* Number */}
              <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--color-steel)] mt-1">
                {item.n}
              </span>

              {/* Question */}
              <h3
                className="font-display"
                style={{ fontSize: 'clamp(18px, 2vw, 26px)', fontWeight: 400, lineHeight: 1.2 }}
              >
                {item.q}
              </h3>

              {/* Hint */}
              <p className="text-[13px] font-300 text-[var(--color-text-muted)] leading-relaxed
                opacity-0 group-hover:opacity-100 transition-opacity duration-400 mt-1">
                {item.hint}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
