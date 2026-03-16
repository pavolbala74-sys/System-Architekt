'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_ITEMS = [
  { label: 'Problem',    href: '#problem' },
  { label: 'Fields',     href: '#fields' },
  { label: 'Analysis',   href: '#analysis' },
  { label: 'Tools',      href: '#tools' },
  { label: 'Systems',    href: '#systems' },
  { label: 'Philosophy', href: '#philosophy' },
  { label: 'Contact',    href: '#contact' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[rgba(248,249,250,0.92)] backdrop-blur-md border-b border-[var(--color-border)]'
            : 'bg-transparent'
        }`}
      >
        <div className="container-eng">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-6 h-6 relative">
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                  <circle cx="12" cy="12" r="10" stroke="var(--color-text-primary)" strokeWidth="0.75" />
                  <path
                    d="M4 12 Q8 6 12 12 Q16 18 20 12"
                    stroke="var(--color-blue-accent)"
                    strokeWidth="1"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="12" r="1.5" fill="var(--color-text-primary)" />
                </svg>
              </div>
              <div>
                <span className="font-mono text-[11px] font-400 tracking-[0.15em] text-[var(--color-text-primary)] uppercase">
                  Pavol Baláž
                </span>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="label-engineering hover:text-[var(--color-text-primary)] transition-colors duration-200"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* CTA */}
            <a
              href="#contact"
              className="hidden md:flex btn-eng text-[11px]"
            >
              Engage
            </a>

            {/* Mobile Toggle */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-px bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
              <span className={`block w-5 h-px bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-px bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[var(--color-bg)] flex flex-col pt-20 px-6"
          >
            <nav className="flex flex-col gap-6 mt-8">
              {NAV_ITEMS.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setMenuOpen(false)}
                  className="font-display text-3xl text-[var(--color-text-primary)] hover:text-[var(--color-blue-accent)] transition-colors"
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
