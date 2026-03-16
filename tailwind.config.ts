import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        engineering: {
          white: '#F8F9FA',
          offwhite: '#F2F3F5',
          graphite: '#E8EAED',
          steel: '#9AA0A8',
          gray: '#5F6368',
          dark: '#1C2128',
          navy: '#0D1B2A',
          'navy-deep': '#080F18',
          blue: '#1A3A5C',
          'blue-mid': '#2563A8',
          'blue-accent': '#3B82F6',
          muted: '#6B7280',
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'flow-slow': 'flow 8s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
      },
      keyframes: {
        flow: {
          '0%, 100%': { transform: 'translateX(0) translateY(0)' },
          '50%': { transform: 'translateX(20px) translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      backgroundImage: {
        'gradient-engineering': 'linear-gradient(135deg, #F8F9FA 0%, #E8EAED 50%, #F2F3F5 100%)',
        'gradient-navy': 'linear-gradient(180deg, #0D1B2A 0%, #080F18 100%)',
        'gradient-steel': 'linear-gradient(90deg, rgba(154,160,168,0.1) 0%, rgba(154,160,168,0.05) 100%)',
      }
    },
  },
  plugins: [],
}
export default config
