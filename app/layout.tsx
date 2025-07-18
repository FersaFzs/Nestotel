import React from 'react';
import '../styles/globals.css';

export const metadata = {
  title: 'Hotel Next.js',
  description: 'Landing page premium para hotel con reservas online.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* IMPORTANTE: Añade en tu _document o aquí los links a Google Fonts: */}
        {/* Playfair Display, Montserrat, Dancing Script */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Montserrat:wght@400;700&family=Dancing+Script:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-black text-black">{children}</body>
    </html>
  );
}
