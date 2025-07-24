import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Import bundle analyzer
const withBundleAnalyzer = process.env.ANALYZE === 'true'
  ? require('@next/bundle-analyzer')({ enabled: true })
  : (config) => config;

let userConfig = undefined

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use export for static deployment on Azure
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // SEO and Performance Optimizations
  staticPageGenerationTimeout: 120, // Increase timeout for static page generation (in seconds)
  generateBuildId: async () => {
    // Generate a unique build ID based on timestamp for better caching
    return `build-${Date.now()}`;
  },
  
  // Optimize build output for SEO
  trailingSlash: false, // Better for SEO consistency
  
  // Performance optimizations
  // swcMinify is enabled by default in Next.js 13+
  
  // PWA and SEO friendly image optimization
  images: {
    unoptimized: true, // Required for static export
    formats: ['image/avif', 'image/webp'], // Modern formats for better performance
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // Cache images for 1 year
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    domains: ['beneficial-bell-dbe99c11c9.strapiapp.com', 'www.taxclusive.com', 'taxclusive.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'beneficial-bell-dbe99c11c9.strapiapp.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.taxclusive.com',
        pathname: '/**',
      },
    ],
  },
  
  // Security headers for hosting environments that support them
  // Note: These won't work with static export but are documented for hosting configuration
  // Configure these at your hosting provider level (Nginx, Apache, CDN, etc.)
  // Recommended headers for hosting configuration:
  /*
  headers: [
    {
      key: 'X-Frame-Options',
      value: 'DENY'
    },
    {
      key: 'X-Content-Type-Options', 
      value: 'nosniff'
    },
    {
      key: 'Referrer-Policy',
      value: 'strict-origin-when-cross-origin'
    },
    {
      key: 'X-XSS-Protection',
      value: '1; mode=block'
    },
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains; preload'
    },
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
    }
  ]
  */
  
  // Webpack optimizations for better performance
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    
    return config;
  },
  
  // Performance and build optimizations
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
    optimizePackageImports: ['@/components', '@/lib', '@/hooks'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Better error handling in production
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // SEO-friendly redirects (configure these at hosting level for static export)
  // For static sites, handle redirects via your hosting provider
  
  // Enable source maps in development for better debugging
  productionBrowserSourceMaps: false, // Disable in production for better performance
  
  // Better error pages for SEO
  poweredByHeader: false, // Remove X-Powered-By header
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
