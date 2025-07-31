/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración de imágenes
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },

  // Configuración de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // Configuración de redirecciones
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ];
  },

  // Configuración de rewrites
  async rewrites() {
    return [
      {
        source: '/api/health',
        destination: '/api/health/route',
      },
    ];
  },

  // Configuración de compilación
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Configuración de experimental features
  experimental: {
    // optimizeCss: true, // Deshabilitado - requiere módulo 'critters'
    scrollRestoration: true,
  },

  // Configuración de webpack
  webpack: (config, { dev, isServer }) => {
    // Optimizaciones para producción
    if (!dev && !isServer) {
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

  // Configuración de TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },

  // Configuración de ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Configuración de output
  output: 'standalone',

  // Configuración de trailing slash
  trailingSlash: false,

  // Configuración de powered by header
  poweredByHeader: false,
};

module.exports = nextConfig;
