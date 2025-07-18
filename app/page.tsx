'use client';
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

export default function HomePage() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
    );
    gsap.fromTo(
      subtitleRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.7, ease: 'power3.out' },
    );
    gsap.fromTo(
      formRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 1.2, ease: 'power3.out' },
    );
  }, []);

  return (
    <main
      className="relative min-h-screen w-full bg-cover bg-center flex flex-col justify-between"
      style={{ backgroundImage: `url('/tu-imagen-hero.jpg')` }}
    >
      {/* Navbar minimalista */}
      <nav className="absolute top-0 left-0 w-full flex items-center justify-between px-10 py-6 z-20">
        <div className="text-3xl font-serif tracking-widest text-white font-bold drop-shadow-lg">
          HOTEL LOGO
        </div>
        <ul className="flex gap-8 text-white font-medium text-lg">
          <li className="hover:underline cursor-pointer">Inicio</li>
          <li className="hover:underline cursor-pointer">Habitaciones</li>
          <li className="hover:underline cursor-pointer">Contacto</li>
          <li className="hover:underline cursor-pointer">Login</li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 text-center select-none">
        <h1
          ref={titleRef}
          className="text-white text-[4rem] md:text-[7rem] font-serif font-bold leading-none drop-shadow-2xl relative z-10"
        >
          YOUR HOME{' '}
          <span className="relative inline-block text-gold font-cursive" style={{ zIndex: 2 }}>
            away
          </span>{' '}
          FROM HOME
        </h1>
        <p
          ref={subtitleRef}
          className="mt-6 text-white text-xl md:text-2xl font-light drop-shadow-lg"
        >
          Vive el lujo y la comodidad en nuestro hotel. Reserva tu experiencia única ahora.
        </p>
      </section>

      {/* Buscador de reservas fijo */}
      <div
        ref={formRef}
        className="fixed left-1/2 -translate-x-1/2 bottom-10 z-30 w-[90vw] max-w-4xl bg-white/95 rounded-xl shadow-2xl flex flex-col md:flex-row items-center justify-between px-6 py-4 gap-4 backdrop-blur-md border border-gray-200"
      >
        <div className="flex flex-col items-start w-full md:w-auto">
          <label className="text-xs font-semibold text-gray-500 mb-1">CHECK IN</label>
          <input
            type="date"
            className="bg-transparent border-b-2 border-gray-300 focus:border-gold outline-none text-lg font-medium px-2 py-1 w-full min-w-[120px]"
          />
        </div>
        <div className="flex flex-col items-start w-full md:w-auto">
          <label className="text-xs font-semibold text-gray-500 mb-1">CHECK OUT</label>
          <input
            type="date"
            className="bg-transparent border-b-2 border-gray-300 focus:border-gold outline-none text-lg font-medium px-2 py-1 w-full min-w-[120px]"
          />
        </div>
        <div className="flex flex-col items-start w-full md:w-auto">
          <label className="text-xs font-semibold text-gray-500 mb-1">GUEST</label>
          <select className="bg-transparent border-b-2 border-gray-300 focus:border-gold outline-none text-lg font-medium px-2 py-1 w-full min-w-[100px]">
            <option>1 Adulto</option>
            <option>2 Adultos</option>
            <option>3 Adultos</option>
            <option>4 Adultos</option>
            <option>Familia</option>
          </select>
        </div>
        <div className="flex flex-col items-start w-full md:w-auto">
          <label className="text-xs font-semibold text-gray-500 mb-1">ROOM</label>
          <select className="bg-transparent border-b-2 border-gray-300 focus:border-gold outline-none text-lg font-medium px-2 py-1 w-full min-w-[120px]">
            <option>Deluxe Room</option>
            <option>Suite</option>
            <option>Individual</option>
            <option>Doble</option>
          </select>
        </div>
        <button className="mt-4 md:mt-0 bg-gray-900 hover:bg-gold text-white hover:text-gray-900 font-bold px-8 py-3 rounded-lg text-lg transition-colors duration-300 shadow-lg">
          RESERVAR
        </button>
      </div>

      {/* Overlay para oscurecer la imagen de fondo y dar contraste al texto */}
      <div className="absolute inset-0 bg-black/40 z-0" />
    </main>
  );
}

// NOTA: Añade tus imágenes en /public y cambia la url de fondo en el main.
// Usa la clase 'text-gold' y 'font-cursive' en tailwind.config.js para personalizar colores y fuentes.
