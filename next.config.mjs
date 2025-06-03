import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import bundle analyzer
const withBundleAnalyzer = process.env.ANALYZE === 'true'
  ? require('@next/bundle-analyzer')({ enabled: true })
  : (config) => config;

let userConfig = undefined

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static site generation
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable static optimization features
  staticPageGenerationTimeout: 120, // Increase timeout for static page generation (in seconds)
  generateBuildId: async () => {
    // Generate a unique build ID based on timestamp for better caching
    return `build-${Date.now()}`;
  },
  // Security headers
  // Note: Headers configuration removed as it's not compatible with 'output: export'
  // These headers should be configured at the hosting level (e.g., Nginx, Apache, or CDN)
  // For reference, the previous headers were:
  // - X-Frame-Options: DENY
  // - X-XSS-Protection: 1; mode=block
  // - X-Content-Type-Options: nosniff
  // - Referrer-Policy: strict-origin-when-cross-origin
  // - Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
  // - Content-Security-Policy: (various directives)
  // - Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['beneficial-bell-dbe99c11c9.strapiapp.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'beneficial-bell-dbe99c11c9.strapiapp.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
}

if (userConfig) {
  // ESM imports will have a "default" property
  const config = userConfig.default || userConfig

  for (const key in config) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...config[key],
      }
    } else {
      nextConfig[key] = config[key]
    }
  }
}

export default withBundleAnalyzer(nextConfig)
