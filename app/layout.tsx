import type { Metadata, Viewport } from 'next'
import './styles/globals.css'

export const metadata: Metadata = {
  title: 'Pavol Baláž — Independent Systems Architect',
  description:
    'Engineering efficiency in complex physical systems. Energy loss analysis, friction optimization, hydrodynamic and aerodynamic systems.',
  keywords: [
    'systems architect',
    'energy efficiency',
    'friction optimization',
    'hydrodynamics',
    'aerodynamics',
    'mechanical engineering',
  ],
  authors: [{ name: 'Pavol Baláž' }],
  openGraph: {
    title: 'Pavol Baláž — Independent Systems Architect',
    description: 'Engineering efficiency in complex physical systems.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F8F9FA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}
