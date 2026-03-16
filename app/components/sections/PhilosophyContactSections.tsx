'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'

// ── Philosophy Section ────────────────────────────────────────────────
export function PhilosophySection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const principles = [
    {
      n: '01',
      title: 'Systems before components',
      text: 'Optimising a component in isolation rarely produces lasting efficiency gains. The system is the unit of analysis. Interactions between components create emergent loss mechanisms invisible at the component level.',
    },
    {
      n: '02',
      title: 'Measure before optimise',
      text: 'Engineering intuition is insufficient for complex systems. Quantified loss accounting replaces assumption with evidence. The highest-leverage intervention is almost never the obvious one.',
    },
    {
      n: '03',
      title: 'Physics governs',
      text: 'Every inefficiency has a physical explanation rooted in thermodynamics, fluid mechanics, or contact mechanics. Understanding the mechanism is prerequisite to correcting it. Empirical shortcuts compound downstream.',
    },
    {
      n: '04',
      title: 'Breakthroughs from clarity',
      text: 'Significant performance improvements rarely require new invention. They require clarity about where energy is disappearing. Diagnosis is the discipline. Solutions often follow naturally.',
    },
  ]

  return (
    <section id="philosophy" className="section-padding section-dark relative overflow-hidden" ref={ref}>

      {/* Large background letter */}
      <div
        className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4
          font-display text-[320px] font-400 text-[rgba(255,255,255,0.02)]
          whitespace-nowrap pointer-events-none select-none leading-none hide-mobile"
        aria-hidden="true"
      >
        η
      </div>

      <div className="container-eng relative z-10">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-6 h-px bg-[rgba(255,255,255,0.3)]" />
            <span className="label-engineering">Engineering Philosophy</span>
          </div>

          <blockquote className="max-w-3xl">
            <p
              className="font-display text-white"
              style={{ fontSize: 'clamp(24px, 3vw, 44px)', fontWeight: 400, lineHeight: 1.2, letterSpacing: '-0.02em' }}
            >
              "Engineering breakthroughs often come not from new inventions, but from identifying
              and eliminating{' '}
              <em style={{ color: 'var(--color-blue-accent)', fontStyle: 'italic' }}>hidden inefficiencies</em>
              {' '}that were always present."
            </p>
          </blockquote>
        </motion.div>

        {/* Principles */}
        <div className="grid md:grid-cols-2 gap-px bg-[rgba(255,255,255,0.06)]">
          {principles.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.1 }}
              className="p-8 bg-[var(--color-navy)] group"
            >
              <div className="flex items-start gap-5">
                <span className="font-mono text-[11px] text-[rgba(255,255,255,0.25)] tracking-[0.2em] mt-1 shrink-0">
                  {p.n}
                </span>
                <div>
                  <h3
                    className="font-display text-white mb-3"
                    style={{ fontSize: '20px', fontWeight: 400 }}
                  >
                    {p.title}
                  </h3>
                  <p className="text-[13px] font-300 text-[rgba(255,255,255,0.45)] leading-relaxed">
                    {p.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Contact Section ───────────────────────────────────────────────────
export function ContactSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', org: '', email: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production: send to API endpoint
    setSubmitted(true)
  }

  return (
    <section id="contact" className="section-padding bg-[var(--color-bg)]" ref={ref}>
      <div className="container-eng">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="rule-eng-accent" />
            <span className="label-engineering">Contact</span>
          </div>
          <div className="grid md:grid-cols-2 gap-16">
            <h2 className="font-display" style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 400, lineHeight: 1.1 }}>
              Start a systems
              <br />analysis conversation
            </h2>
            <div className="prose-eng self-end">
              <p>
                Consulting engagements, research collaboration, or technical advisory roles
                in energy efficiency and fluid systems optimisation.
              </p>
              <div className="flex flex-col gap-2 mt-6">
                <a
                  href="mailto:pavol@balazik.engineering"
                  className="font-mono text-[13px] text-[var(--color-blue-accent)] hover:underline"
                >
                  pavol@balazik.engineering
                </a>
                <a
                  href="https://linkedin.com/in/pbalazik"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[13px] text-[var(--color-text-muted)] hover:text-[var(--color-blue-accent)] transition-colors"
                >
                  LinkedIn — Pavol Baláž
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl"
        >
          {submitted ? (
            <div className="p-8 border border-[var(--color-border)] text-center">
              <div className="font-mono text-[13px] text-[var(--color-blue-accent)] mb-2">Message received</div>
              <p className="text-[var(--color-text-muted)] text-[14px]">
                Thank you. I will respond within 48 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label-engineering block mb-2">Name</label>
                  <input
                    type="text"
                    required
                    className="input-eng"
                    placeholder="Your name"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="label-engineering block mb-2">Organisation</label>
                  <input
                    type="text"
                    className="input-eng"
                    placeholder="Company or institution"
                    value={form.org}
                    onChange={e => setForm(p => ({ ...p, org: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="label-engineering block mb-2">Email</label>
                <input
                  type="email"
                  required
                  className="input-eng"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="label-engineering block mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  className="input-eng resize-none"
                  placeholder="Describe the system or challenge you are working on..."
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                />
              </div>
              <button type="submit" className="btn-eng">
                Send Message
                <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-8">
      <div className="container-eng">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] text-[var(--color-text-primary)] tracking-[0.15em] uppercase">
              Pavol Baláž
            </span>
            <span className="label-engineering">Independent Systems Architect</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="label-engineering">
              © {new Date().getFullYear()} — All rights reserved
            </span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-blue-accent)] animate-pulse" />
              <span className="label-engineering">Available for consulting</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
