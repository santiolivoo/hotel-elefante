/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
    unoptimized: true, // Para deploy en GitHub Pages si se requiere
  },
  output: 'standalone', // Para deploy en Vercel
}

module.exports = nextConfig
