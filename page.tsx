'use client'

import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

// ── Types ─────────────────────────────────────────────────────────────
type FlowMode = 'laminar' | 'turbulent'

// ── Particle streamlines ──────────────────────────────────────────────
function StreamParticles({ mode }: { mode: FlowMode }) {
  const COUNT = 600
  const meshRef = useRef<THREE.Points>(null)
  const t = useRef(0)

  // Initial positions and per-particle random params
  const [positions, offsets, speeds] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const off = new Float32Array(COUNT * 3) // phase/amp offsets
    const spd = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 14  // x: spread along tube
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2.4 // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 2.4 // z

      off[i * 3]     = Math.random() * Math.PI * 2  // phase x
      off[i * 3 + 1] = Math.random() * Math.PI * 2  // phase y
      off[i * 3 + 2] = Math.random() * 0.6 + 0.2    // amplitude

      spd[i] = 0.4 + Math.random() * 0.5
    }
    return [pos, off, spd]
  }, [])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3))
    return geo
  }, [positions])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    t.current += delta * 0.35

    const posAttr = meshRef.current.geometry.getAttribute('position') as THREE.BufferAttribute
    const arr = posAttr.array as Float32Array

    for (let i = 0; i < COUNT; i++) {
      // Advance x
      arr[i * 3] += spd[i] * delta * 1.8

      // Wrap around
      if (arr[i * 3] > 7) {
        arr[i * 3] = -7
        arr[i * 3 + 1] = (Math.random() - 0.5) * 2.4
        arr[i * 3 + 2] = (Math.random() - 0.5) * 2.4
      }

      if (mode === 'laminar') {
        // Gentle sinusoidal deviation — stays close to streamline
        arr[i * 3 + 1] = positions[i * 3 + 1] + Math.sin(t.current * 0.5 + off[i * 3]) * 0.08
        arr[i * 3 + 2] = positions[i * 3 + 2] + Math.cos(t.current * 0.4 + off[i * 3 + 1]) * 0.08
      } else {
        // Turbulent — chaotic lateral motion
        const cx = arr[i * 3]
        arr[i * 3 + 1] += Math.sin(cx * 1.1 + t.current * 2.2 + off[i * 3]) * off[i * 3 + 2] * delta * 2.5
        arr[i * 3 + 2] += Math.cos(cx * 0.9 - t.current * 1.8 + off[i * 3 + 1]) * off[i * 3 + 2] * delta * 2.5
        // Clamp to tube radius
        const r = Math.sqrt(arr[i * 3 + 1] ** 2 + arr[i * 3 + 2] ** 2)
        if (r > 1.2) {
          arr[i * 3 + 1] *= 1.1 / r
          arr[i * 3 + 2] *= 1.1 / r
        }
      }
    }

    posAttr.needsUpdate = true
  })

  const color = mode === 'laminar' ? '#3b82f6' : '#64748b'

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        color={color}
        size={0.045}
        sizeAttenuation
        transparent
        opacity={mode === 'laminar' ? 0.75 : 0.55}
        depthWrite={false}
      />
    </points>
  )
}

// ── Tube guide (wire frame) ───────────────────────────────────────────
function TubeGuide() {
  const points = useMemo(() => {
    const pts = []
    for (let i = -7; i <= 7; i += 0.5) pts.push(new THREE.Vector3(i, 0, 0))
    return pts
  }, [])

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points])

  return (
    <mesh>
      <tubeGeometry args={[curve, 80, 1.2, 12, false]} />
      <meshBasicMaterial color="#1c2128" transparent opacity={0.06} wireframe />
    </mesh>
  )
}

// ── Scene ─────────────────────────────────────────────────────────────
function FlowScene({ mode }: { mode: FlowMode }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <TubeGuide />
      <StreamParticles mode={mode} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.4}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI * 0.72}
      />
    </>
  )
}

// ── Public component ──────────────────────────────────────────────────
export default function FlowVisualizer() {
  const t = useTranslations()
  const [mode, setMode] = useState<FlowMode>('laminar')

  const MODES: { id: FlowMode; labelKey: string; re: string; desc: string }[] = [
    { id: 'laminar',   labelKey: 'flow_laminar',   re: 'Re < 2 300', desc: 'Orderly parallel streamlines. Minimal cross-stream mixing. Low friction losses.' },
    { id: 'turbulent', labelKey: 'flow_turbulent',  re: 'Re > 4 000', desc: 'Chaotic vortical motion. 3–5× higher wall friction. Dominant in most engineering flows.' },
  ]

  return (
    <section className="section-padding section-dark relative overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="container-eng relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }} className="mb-12">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-6 h-px bg-[rgba(255,255,255,0.25)]" />
            <span className="label-engineering">{t('flow_label')}</span>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-end">
            <h2 className="font-display text-white"
              style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 400, lineHeight: 1.1 }}>
              {t('flow_viz_title')}
            </h2>
            <p className="text-[rgba(255,255,255,0.45)] text-[14px] font-300 leading-relaxed">
              {t('flow_viz_desc')}
            </p>
          </div>
        </motion.div>

        {/* Mode selector */}
        <div className="flex gap-2 mb-6">
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              className={`px-5 py-2.5 font-mono text-[11px] tracking-[0.12em] uppercase border transition-all duration-300 cursor-pointer ${
                mode === m.id
                  ? 'bg-[var(--color-blue-accent)] border-[var(--color-blue-accent)] text-white'
                  : 'border-[rgba(255,255,255,0.15)] text-[rgba(255,255,255,0.45)] hover:border-[rgba(255,255,255,0.4)] hover:text-white'
              }`}>
              {t(m.labelKey)}
            </button>
          ))}
        </div>

        {/* 3D Canvas */}
        <motion.div key={mode} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
          className="relative border border-[rgba(255,255,255,0.07)] overflow-hidden"
          style={{ height: '400px', background: 'rgba(8,15,24,0.95)' }}>

          <Canvas camera={{ position: [0, 1.5, 6], fov: 48 }} dpr={[1, 2]}>
            <FlowScene mode={mode} />
          </Canvas>

          {/* Overlay labels */}
          <div className="absolute top-4 left-4 pointer-events-none">
            <span className="font-mono text-[10px] text-[rgba(255,255,255,0.3)] tracking-[0.15em] uppercase">
              {mode === 'laminar' ? 'Laminar' : 'Turbulent'} · {MODES.find(m => m.id === mode)?.re}
            </span>
          </div>
          <div className="absolute bottom-4 right-4 pointer-events-none">
            <span className="font-mono text-[10px] text-[rgba(255,255,255,0.2)]">Drag to rotate · Auto-orbit enabled</span>
          </div>
        </motion.div>

        {/* Regime cards */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {MODES.map(m => (
            <div key={m.id}
              className={`p-5 border transition-all duration-300 ${
                mode === m.id ? 'border-[var(--color-blue-accent)] bg-[rgba(37,99,168,0.08)]' : 'border-[rgba(255,255,255,0.06)]'
              }`}>
              <div className="font-mono text-[11px] text-[rgba(255,255,255,0.3)] mb-1 tracking-[0.1em]">{m.re}</div>
              <div className="font-display text-white text-[16px] mb-2">{t(m.labelKey)}</div>
              <p className="text-[12px] text-[rgba(255,255,255,0.35)] leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
