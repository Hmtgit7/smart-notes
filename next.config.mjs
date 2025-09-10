/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa'

const nextConfig = {
  // App directory is stable in Next.js 13+
}

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})(nextConfig)
  