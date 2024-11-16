/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false
    return config
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.anthropic.com/:path*',
      },
    ]
  },
}

module.exports = nextConfig 