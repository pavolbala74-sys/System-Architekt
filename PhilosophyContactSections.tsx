'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, useInView } from 'framer-motion'

type FlowMode = 'laminar' | 'turbulent' | 'boundary'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  hue: number
}

function FlowVisualizationCanvas({ mode }: { mode: FlowMode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    let w = 0, h = 0
    let t = 0

    const resize = () => {
      w = canvas.width = canvas.offsetWidth
      h = canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: Particle[] = []
    const N = mode === 'turbulent' ? 200 : 120

    const initParticle = (p: Particle, i: number) => {
      p.x = Math.random() * -100
      p.y = mode === 'boundary'
        ? h - 40 - Math.random() * (h * 0.6)
        : (i / N) * h + (Math.random() - 0.5) * 20
      p.vx = 0.8 + Math.random() * 0.6
      p.vy = 0
      p.life = 0
      p.maxLife = 200 + Math.random() * 200
      p.hue = 210 + Math.random() * 30
    }

    for (let i = 0; i < N; i++) {
      const p: Particle = { x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0, hue: 0 }
      initParticle(p, i)
      p.x = Math.random() * w
      particles.push(p)
    }

    const draw = () => {
      // Fade trail
      ctx.fillStyle = 'rgba(248, 249, 250, 0.08)'
      ctx.fillRect(0, 0, w, h)

      particles.forEach((p, i) => {
        p.life++
        if (p.life > p.maxLife || p.x > w + 50) {
          initParticle(p, i)
          return
        }

        const alpha = Math.min(p.life / 20, 1) * (1 - p.life / p.maxLife) * 0.7

        if (mode === 'laminar') {
          // Pure horizontal streamlines
          p.vx = 1.2
          p.vy = Math.sin(t * 0.5 + p.y * 0.01) * 0.05

        } else if (mode === 'turbulent') {
          // Chaotic vortical motion
          const noise1 = Math.sin(p.x * 0.02 + t * 2) * Math.cos(p.y * 0.03 + t) * 2
          const noise2 = Math.cos(p.x * 0.015 - t * 1.5) * Math.sin(p.y * 0.025 + t * 0.8) * 2
          p.vx = 0.8 + noise1
          p.vy = noise2 * 1.5

        } else {
          // Boundary layer: velocity increases with distance from wall
          const distFromWall = h - 40 - p.y
          const layerFactor = Math.max(0, distFromWall / (h * 0.4))
          p.vx = 0.3 + layerFactor * 1.5
          p.vy = Math.sin(p.x * 0.01 + t * 0.5) * 0.1 * (1 - layerFactor)
        }

        p.x += p.vx
        p.y += p.vy

        // Draw particle as short line
        ctx.beginPath()
        ctx.moveTo(p.x - p.vx * 6, p.y - p.vy * 6)
        ctx.lineTo(p.x, p.y)

        const color = mode === 'turbulent'
          ? `hsla(${p.hue + 20}, 40%, 45%, ${alpha})`
          : `hsla(${p.hue}, 60%, 50%, ${alpha})`

        ctx.strokeStyle = color
        ctx.lineWidth = 1
        ctx.stroke()
      })

      // Boundary layer wall indicator
      if (mode === 'boundary') {
        ctx.fillStyle = 'rgba(154, 160, 168, 0.3)'
        ctx.fillRect(0, h - 40, w, 40)

        // Velocity profile
        ctx.beginPath()
        ctx.moveTo(60, h - 40)
        for (let y = h - 40; y >= 20; y -= 2) {
          const dist = (h - 40 - y) / (h * 0.6)
          const vel = Math.min(1, dist * 2.5)
          const x = 60 + vel * 80
          ctx.lineTo(x, y)
        }
        ctx.strokeStyle = 'rgba(37, 99, 168, 0.5)'
        ctx.lineWidth = 1.5
        ctx.stroke()

        ctx.font = '10px JetBrains Mono, monospace'
        ctx.fillStyle = 'rgba(95, 99, 104, 0.8)'
        ctx.fillText('Wall', 10, h - 20)
        ctx.fillText('U(y) →', 10, h - 55)
      }

      t += 0.012
      raf = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [mode])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      aria-label={`${mode} flow visualization`}
    />
  )
}

export default function FlowVisualizationSection() {
  const [mode, setMode] = useState<FlowMode>('laminar')
  const ref = useRef<HTMLDivElement>(null)
  const t = useTranslations()
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const MODES: { id: FlowMode; label: string; desc: string }[] = [
    { id: 'laminar',   label: t('flow_laminar'),   desc: 'Orderly parallel streamlines. Low Re. Minimal mixing.' },
    { id: 'turbulent', label: t('flow_turbulent'),  desc: 'Chaotic vortices. High Re. Increased friction losses.' },
    { id: 'boundary',  label: t('flow_boundary'),   desc: 'Velocity gradient from wall to free stream. δ(x) growth.' },
  ]

  return (
    <section className="section-padding section-dark relative overflow-hidden" ref={ref}>
      <div className="container-eng">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-6 h-px bg-[rgba(255,255,255,0.3)]" />
            <span className="label-engineering">{t('flow_label')}</span>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-end">
            <h2
              className="font-display text-white"
              style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 400, lineHeight: 1.1 }}
            >
              Observe flow regimes
              <br />in real time
            </h2>
            <p className="text-[rgba(255,255,255,0.5)] text-[14px] font-300 leading-relaxed">
              Particle-based simulation of fluid flow patterns. Select a regime to observe
              how flow behaviour changes — and how energy dissipation rates differ between them.
            </p>
          </div>
        </motion.div>

        {/* Mode selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-5 py-2.5 font-mono text-[11px] tracking-[0.12em] uppercase
                border transition-all duration-300 cursor-pointer
                ${mode === m.id
                  ? 'bg-[var(--color-blue-accent)] border-[var(--color-blue-accent)] text-white'
                  : 'border-[rgba(255,255,255,0.15)] text-[rgba(255,255,255,0.5)] hover:border-[rgba(255,255,255,0.4)] hover:text-white'
                }`}
            >
              {m.label}
            </button>
          ))}
        </motion.div>

        {/* Active mode description */}
        <motion.p
          key={mode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-[12px] text-[rgba(255,255,255,0.4)] mb-4"
        >
          {MODES.find(m => m.id === mode)?.desc}
        </motion.p>

        {/* Canvas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative border border-[rgba(255,255,255,0.08)] overflow-hidden"
          style={{ height: '360px', background: 'rgba(248,249,250,0.97)' }}
        >
          <FlowVisualizationCanvas key={mode} mode={mode} />

          {/* Corner labels */}
          <div className="absolute top-3 right-3 font-mono text-[10px] text-[var(--color-steel)]">
            Re: {mode === 'laminar' ? '< 2300' : mode === 'turbulent' ? '> 4000' : '∂δ/∂x'}
          </div>
        </motion.div>

        {/* Reynolds number reference */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {[
            { regime: 'Laminar', re: 'Re < 2,300', loss: 'Low friction', color: 'var(--color-blue-accent)' },
            { regime: 'Transitional', re: '2,300–4,000', loss: 'Variable', color: 'var(--color-steel)' },
            { regime: 'Turbulent', re: 'Re > 4,000', loss: '3–5× higher friction', color: 'rgba(255,255,255,0.6)' },
          ].map((r) => (
            <div key={r.regime} className="p-4 border border-[rgba(255,255,255,0.06)]">
              <div className="font-mono text-[10px] mb-1" style={{ color: r.color }}>{r.regime}</div>
              <div className="font-mono text-[12px] text-white mb-1">{r.re}</div>
              <div className="label-engineering text-[rgba(255,255,255,0.35)]">{r.loss}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
