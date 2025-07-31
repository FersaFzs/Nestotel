import React from 'react';
import '../styles/globals.css';
import { AuthProvider } from '../lib/contexts/AuthContext';
import { MobileMenuProvider } from '../lib/contexts/MobileMenuContext';

export const metadata = {
  title: 'Granada Inn - Sistema de Gestión Hotelera | Prototipo Profesional',
  description:
    'Prototipo avanzado de sistema de gestión hotelera desarrollado con Next.js 14, TypeScript y MongoDB. Incluye reservas, facturación electrónica española, panel administrativo y más.',
  keywords:
    'hotel management, Next.js, TypeScript, MongoDB, sistema hotelero, facturación AEAT, reservas online, prototipo empresarial',
  authors: [{ name: 'Tu Nombre', url: 'https://tu-portfolio.com' }],
  metadataBase: new URL('https://granada-inn.vercel.app'),
  icons: {
    icon: '/app/icon.png',
    apple: '/app/apple-icon.png',
  },
  openGraph: {
    title: 'Granada Inn - Sistema de Gestión Hotelera Profesional',
    description:
      'Prototipo completo de sistema hotelero con arquitectura moderna y funcionalidades empresariales',
    url: 'https://granada-inn.vercel.app',
    siteName: 'Granada Inn',
    type: 'website',
    locale: 'es_ES',
    images: [
      {
        url: '/app/icon.png',
        width: 32,
        height: 32,
        alt: 'Granada Inn Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Granada Inn - Sistema de Gestión Hotelera',
    description: 'Prototipo profesional desarrollado con tecnologías modernas',
    images: ['/app/icon.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'tu-google-verification-code',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='es'>
      <head>
        {/* Google Fonts optimizados */}
        <link
          href='https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Montserrat:wght@400;700&family=Dancing+Script:wght@700&display=swap'
          rel='stylesheet'
        />
      </head>
      <body className='font-sans bg-black text-black'>
        <AuthProvider>
          <MobileMenuProvider>{children}</MobileMenuProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
