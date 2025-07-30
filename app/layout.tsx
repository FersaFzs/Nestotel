import React from 'react';
import '../styles/globals.css';
import { AuthProvider } from '../lib/contexts/AuthContext';
import { MobileMenuProvider } from '../lib/contexts/MobileMenuContext';

export const metadata = {
  title: 'Granada Inn - Hotel Premium',
  description: 'Experiencia única en Granada. Reserva tu estancia en nuestro hotel boutique.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='es'>
      <head>
        {/* IMPORTANTE: Añade en tu _document o aquí los links a Google Fonts: */}
        {/* Playfair Display, Montserrat, Dancing Script */}
        <link
          href='https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Montserrat:wght@400;700&family=Dancing+Script:wght@700&display=swap'
          rel='stylesheet'
        />
      </head>
      <body className='font-sans bg-black text-black'>
        <AuthProvider>
          <MobileMenuProvider>
            {children}
          </MobileMenuProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
