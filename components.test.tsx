'use client'

import { useEffect } from 'react'

interface PerformanceMetrics {
  fcp: number | null   // First Contentful Paint
  lcp: number | null   // Largest Contentful Paint
  cls: number | null   // Cumulative Layout Shift
  fid: number | null   // First Input Delay
  ttfb: number | null  // Time to First Byte
}

function getMetrics(): Partial<PerformanceMetrics> {
  if (typeof window === 'undefined' || !window.performance) return {}

  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  const paint = performance.getEntriesByType('paint')
  const fcp = paint.find(e => e.name === 'first-contentful-paint')

  return {
    fcp: fcp ? Math.round(fcp.startTime) : null,
    ttfb: nav ? Math.round(nav.responseStart - nav.requestStart) : null,
  }
}

export function usePerformanceMonitor(section: string) {
  useEffect(() => {
    // Report section render time
    const start = performance.now()

    return () => {
      const duration = performance.now() - start
      if (process.env.NODE_ENV === 'development') {
        console.debug(`[Perf] ${section} render: ${duration.toFixed(2)}ms`)
      }
      // Warn on slow sections
      if (duration > 500) {
        console.warn(`[Perf] Slow section: ${section} (${duration.toFixed(0)}ms)`)
      }
    }
  }, [section])
}

export function PerformanceReporter() {
  useEffect(() => {
    // Report Web Vitals after page load
    const reportVitals = () => {
      const metrics = getMetrics()
      if (process.env.NODE_ENV === 'development') {
        console.groupCollapsed('[Performance Vitals]')
        Object.entries(metrics).forEach(([k, v]) =>
          console.log(`  ${k}: ${v !== null ? v + 'ms' : 'n/a'}`)
        )
        console.groupEnd()
      }
      // Warn on poor metrics
      if (metrics.fcp && metrics.fcp > 2500) {
        console.warn(`[Perf] Poor FCP: ${metrics.fcp}ms (target < 1800ms)`)
      }
      if (metrics.ttfb && metrics.ttfb > 600) {
        console.warn(`[Perf] Poor TTFB: ${metrics.ttfb}ms (target < 200ms)`)
      }
    }

    if (document.readyState === 'complete') {
      reportVitals()
    } else {
      window.addEventListener('load', reportVitals, { once: true })
    }
  }, [])

  return null
}
