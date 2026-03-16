'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const EXPERTISE = [
  'Energy Systems',
  'Friction Reduction',
  'Hydrodynamics',
  'Aerodynamics',
  'System Optimization',
]

// ── Canvas Flow Lines Animation ──────────────────────────────────────
function FlowCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animFrameId: number
    let w = 0, h = 0

    const resize = () => {
      w = canvas.width = canvas.offsetWidth
      h = canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Streamline particles
    const LINES = 40
    type Particle = {
      x: number; y: number; baseY: number
      speed: number; phase: number; amp: number; alpha: number
    }

    const particles: Particle[] = Array.from({ length: LINES }, (_, i) => ({
      x: Math.random() * -200,
      y: (i / LINES) * 120 + (h / 2 - 60),
      baseY: (i / LINES) * 120 + (h / 2 - 60),
      speed: 0.3 + Math.random() * 0.4,
      phase: Math.random() * Math.PI * 2,
      amp: 2 + Math.random() * 8,
      alpha: 0.04 + Math.random() * 0.12,
    }))

    let t = 0

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      // Gradient background hint
      const grad = ctx.createLinearGradient(0, h * 0.3, 0, h * 0.7)
      grad.addColorStop(0, 'rgba(37, 99, 168, 0.02)')
      grad.addColorStop(1, 'rgba(13, 27, 42, 0.03)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      particles.forEach((p) => {
        p.x += p.speed

        if (p.x > w + 100) {
          p.x = -100 - Math.random() * 200
          p.baseY = Math.random() * h
        }

        // Sinusoidal streamline
        const y = p.baseY + Math.sin(p.x * 0.008 + p.phase + t * 0.3) * p.amp

        ctx.beginPath()
        ctx.moveTo(p.x - 60, y)

        // Draw smooth bezier streamline
        for (let s = 0; s < 80; s += 4) {
          const sx = p.x - 60 + s
          const sy = p.baseY + Math.sin(sx * 0.008 + p.phase + t * 0.3) * p.amp
          ctx.lineTo(sx, sy)
        }

        ctx.strokeStyle = `rgba(37, 99, 168, ${p.alpha})`
        ctx.lineWidth = 0.8
        ctx.stroke()

        // Small dot at front
        ctx.beginPath()
        ctx.arc(p.x + 20, y, 1, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(37, 99, 168, ${p.alpha * 2})`
        ctx.fill()
      })

      t += 0.008
      animFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animFrameId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  )
}

// ── Hero Section ──────────────────────────────────────────────────────
export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-engineering-white grid-reference">
      {/* Flow Canvas Background */}
      <FlowCanvas />

      {/* Subtle gradient vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(248,249,250,0.6) 100%)',
        }}
      />

      {/* Vertical rule lines */}
      <div className="absolute top-0 left-[40px] bottom-0 w-px bg-[var(--color-border)] opacity-60 hide-mobile" aria-hidden="true" />
      <div className="absolute top-0 right-[40px] bottom-0 w-px bg-[var(--color-border)] opacity-60 hide-mobile" aria-hidden="true" />

      {/* Main Content */}
      <div className="container-eng relative z-10 flex flex-col justify-center flex-1 pt-24 pb-16">
        <div className="max-w-5xl">

          {/* Lab label */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-4 mb-12"
          >
            <div className="w-8 h-px bg-[var(--color-blue-accent)]" />
            <span className="label-engineering">Systems Architecture Laboratory</span>
            <span className="label-engineering opacity-40">— Est. 2024</span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="font-display mb-8"
            style={{
              fontSize: 'clamp(40px, 6vw, 88px)',
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: 'var(--color-text-primary)',
            }}
          >
            Engineering
            <br />
            <em style={{ fontStyle: 'italic', color: 'var(--color-blue-accent)' }}>Efficiency</em>
            <br />
            in Complex
            <br />
            Physical Systems
          </motion.h1>

          {/* Author + title */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center gap-6 mb-10"
          >
            <div className="rule-eng-accent" />
            <div>
              <p className="font-mono text-[13px] font-400 text-[var(--color-text-primary)] tracking-[0.08em]">
                Pavol Baláž
              </p>
              <p className="label-engineering mt-0.5">Independent Systems Architect</p>
            </div>
          </motion.div>

          {/* Expertise tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap gap-2"
          >
            {EXPERTISE.map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.07 }}
                className="inline-flex items-center px-4 py-1.5 rounded-sm
                  font-mono text-[11px] tracking-[0.12em] uppercase
                  border border-[var(--color-border-strong)]
                  text-[var(--color-text-secondary)]
                  bg-white/60 backdrop-blur-sm
                  hover:border-[var(--color-blue-accent)] hover:text-[var(--color-blue-accent)]
                  transition-all duration-300 cursor-default"
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom metrics bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="relative z-10 border-t border-[var(--color-border)] container-eng py-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '30–60%', label: 'Typical energy loss in complex systems' },
            { value: '∼15%',   label: 'Rolling resistance in heavy transport' },
            { value: '∼40%',   label: 'Friction losses in industrial machinery' },
            { value: '∼25%',   label: 'Hydrodynamic drag in marine vessels' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="metric-value text-3xl mb-1">{stat.value}</div>
              <div className="label-engineering leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 right-10 flex flex-col items-center gap-2 hide-mobile"
      >
        <span className="label-engineering" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-[var(--color-steel)] to-transparent" />
      </motion.div>
    </section>
  )
}
