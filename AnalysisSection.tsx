'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

// ── Animated canvas: slow laminar flow streamlines ───────────────────
function FlowCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number, w = 0, h = 0, t = 0

    const resize = () => {
      w = canvas.width = canvas.offsetWidth
      h = canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const N = 48
    type P = { x: number; baseY: number; speed: number; phase: number; amp: number; alpha: number }
    const pts: P[] = Array.from({ length: N }, (_, i) => ({
      x: Math.random() * w,
      baseY: (i / N) * h + Math.random() * (h / N),
      speed: 0.25 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2,
      amp: 3 + Math.random() * 10,
      alpha: 0.03 + Math.random() * 0.08,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      // Soft radial gradient wash
      const g = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.4, w * 0.6)
      g.addColorStop(0, 'rgba(37,99,168,0.025)')
      g.addColorStop(1, 'transparent')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      pts.forEach(p => {
        p.x += p.speed
        if (p.x > w + 80) { p.x = -80; p.baseY = Math.random() * h }

        ctx.beginPath()
        for (let s = -40; s <= 40; s += 2) {
          const px = p.x + s
          const py = p.baseY + Math.sin(px * 0.009 + p.phase + t * 0.25) * p.amp
          s === -40 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
        }
        ctx.strokeStyle = `rgba(37,99,168,${p.alpha})`
        ctx.lineWidth = 0.7
        ctx.stroke()

        // Leading dot
        const dotY = p.baseY + Math.sin(p.x * 0.009 + p.phase + t * 0.25) * p.amp
        ctx.beginPath()
        ctx.arc(p.x + 40, dotY, 0.8, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(37,99,168,${p.alpha * 2.5})`
        ctx.fill()
      })

      t += 0.007
      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={ref} className="absolute inset-0 w-full h-full" aria-hidden="true" />
}

// ── Hero ─────────────────────────────────────────────────────────────
export default function HeroSection() {
  const t = useTranslations()

  const EXPERTISE_KEYS = [
    'expertise_energy', 'expertise_friction', 'expertise_hydro',
    'expertise_aero', 'expertise_optimization',
  ] as const

  const STATS = [
    { vk: 'hero_stat1_value', lk: 'hero_stat1_label' },
    { vk: 'hero_stat2_value', lk: 'hero_stat2_label' },
    { vk: 'hero_stat3_value', lk: 'hero_stat3_label' },
    { vk: 'hero_stat4_value', lk: 'hero_stat4_label' },
  ] as const

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden hero-gradient grid-reference">
      <FlowCanvas />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 50%, transparent 30%, rgba(247,248,250,0.55) 100%)' }} />

      {/* Side rules */}
      <div className="absolute top-0 left-[48px] bottom-0 w-px bg-[var(--color-border)] hide-mobile" aria-hidden="true" />
      <div className="absolute top-0 right-[48px] bottom-0 w-px bg-[var(--color-border)] hide-mobile" aria-hidden="true" />

      {/* Content */}
      <div className="container-eng relative z-10 flex flex-col justify-center flex-1 pt-28 pb-20">
        <div className="max-w-5xl">

          {/* Lab badge */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16,1,0.3,1] }}
            className="flex items-center gap-4 mb-14">
            <span className="inline-block w-6 h-px bg-[var(--color-blue-accent)]" />
            <span className="label-engineering">{t('hero_lab_label')}</span>
            <span className="label-engineering opacity-35">— {t('hero_est')}</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.25, ease: [0.16,1,0.3,1] }}
            className="font-display mb-10"
            style={{ fontSize: 'clamp(44px, 6.5vw, 96px)', fontWeight: 400, lineHeight: 1.04, letterSpacing: '-0.025em' }}>
            {t('hero_title_line1')}
            <br />
            <em style={{ fontStyle: 'italic', color: 'var(--color-blue-accent)' }}>
              {t('hero_title_accent')}
            </em>
            <br />
            {t('hero_title_line2')}
            <br />
            {t('hero_title_line3')}
          </motion.h1>

          {/* Author */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="flex items-center gap-6 mb-12">
            <div className="rule-eng-accent" />
            <div>
              <p className="font-mono text-[13px] text-[var(--color-text-primary)] tracking-[0.1em]">
                {t('hero_author')}
              </p>
              <p className="label-engineering mt-1">{t('hero_role')}</p>
            </div>
          </motion.div>

          {/* Expertise pills */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="flex flex-wrap gap-2">
            {EXPERTISE_KEYS.map((key, i) => (
              <motion.span key={key}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 + i * 0.08, ease: [0.16,1,0.3,1] }}
                className="inline-flex items-center px-4 py-2 font-mono text-[10px] tracking-[0.14em] uppercase
                  border border-[var(--color-border-strong)] text-[var(--color-text-secondary)]
                  bg-white/50 backdrop-blur-sm rounded-sm
                  hover:border-[var(--color-blue-accent)] hover:text-[var(--color-blue-accent)]
                  hover:bg-white/80 transition-all duration-300 cursor-default">
                {t(key)}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom stats bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="relative z-10 border-t border-[var(--color-border)] container-eng py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(s => (
            <div key={s.vk}>
              <div className="metric-value text-[32px] mb-1.5">{t(s.vk)}</div>
              <div className="label-engineering leading-snug">{t(s.lk)}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-10 right-12 flex flex-col items-center gap-2 hide-mobile">
        <span className="label-engineering" style={{ writingMode: 'vertical-rl' }}>{t('hero_scroll')}</span>
        <div className="w-px h-14 bg-gradient-to-b from-[var(--color-steel)] to-transparent" />
      </motion.div>
    </section>
  )
}
