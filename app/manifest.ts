import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Granada Inn - Sistema de Gestión Hotelera',
    short_name: 'Granada Inn',
    description: 'Prototipo profesional de sistema de gestión hotelera desarrollado con Next.js 14, TypeScript y MongoDB',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#C9A86B',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '16x16',
        type: 'image/x-icon',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['business', 'productivity', 'travel'],
    lang: 'es',
    dir: 'ltr',
  };
}