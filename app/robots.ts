import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://granada-inn.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/*',
          '/api/*',
          '/unauthorized',
          '/perfil/*',
          '/reservas/*'
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/*',
          '/api/*',
          '/unauthorized',
          '/perfil/*',
          '/reservas/*'
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}