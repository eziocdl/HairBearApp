const withNextIntl = require('next-intl/plugin')('./i18n-request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,

  // ⚠️ CAPACITOR/MOBILE: Static export required
  // Temporarily disabled for dev mode testing - re-enable for production build
  // output: 'export',
  trailingSlash: true,

  // Permitir Node 18 (temporário - recomenda-se atualizar para Node 20+)
  experimental: {
    // Configurações experimentais se necessário
  },

  // Otimizações de imagem
  images: {
    unoptimized: true, // Required for static export
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
  },

  // Headers de segurança (não aplicam em static export, mas mantidos para web)
  async headers() {
    return [
      {
        source: '/:path*',
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
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
