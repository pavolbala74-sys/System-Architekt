const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react', 'chart.js'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = withNextIntl(nextConfig)
