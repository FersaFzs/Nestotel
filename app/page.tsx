'use client';
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

function FotoPlaceholder({ className = '', text = 'FOTO' }: { className?: string; text?: string }) {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="400" height="400" rx="32" fill="#e5e7eb" />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="48"
        fill="#b1b1b1"
        fontFamily="Montserrat, sans-serif"
        fontWeight="bold"
      >
        {text}
      </text>
    </svg>
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const roomsRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero animación fade-in
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
    );
    // Animaciones de scroll para secciones
    [infoRef, roomsRef, eventsRef].forEach((ref, i) => {
      if (ref.current) {
        gsap.fromTo(
          ref.current,
          { opacity: 0, y: 80, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 80%',
            },
            delay: 0.2 * (i + 1),
          },
        );
      }
    });
    // Animación de hover para las cards de habitaciones y eventos
    gsap.utils.toArray('.room-card').forEach((card) => {
      const el = card as Element;
      gsap.set(el, { transformOrigin: 'center center' });
      el.addEventListener('mouseenter', () => {
        gsap.to(el, {
          scale: 1.04,
          rotateZ: 1,
          boxShadow: '0 8px 32px #C9A86B55',
          duration: 0.4,
          ease: 'power2.out',
        });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          scale: 1,
          rotateZ: 0,
          boxShadow: '0 4px 16px #00000022',
          duration: 0.4,
          ease: 'power2.in',
        });
      });
    });
    gsap.utils.toArray('.event-card').forEach((card) => {
      const el = card as Element;
      gsap.set(el, { transformOrigin: 'center center' });
      el.addEventListener('mouseenter', () => {
        gsap.to(el, {
          scale: 1.05,
          rotateZ: -1,
          boxShadow: '0 8px 32px #C9A86B88',
          duration: 0.4,
          ease: 'power2.out',
        });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          scale: 1,
          rotateZ: 0,
          boxShadow: '0 4px 16px #00000022',
          duration: 0.4,
          ease: 'power2.in',
        });
      });
    });
  }, []);

  return (
    <main className="bg-[#f7f6f2] min-h-screen w-full">
      {/* ================= NAVBAR ================= */}
      <nav className="w-full flex items-center justify-between px-12 py-8 bg-black/80 fixed top-0 left-0 z-30 shadow-lg">
        <div className="text-3xl font-serif tracking-widest text-gold font-bold">GRANADA INN</div>
        <ul className="flex gap-10 text-lg text-white font-medium">
          <li className="hover:text-gold transition-colors cursor-pointer">Inicio</li>
          <li className="hover:text-gold transition-colors cursor-pointer">Habitaciones</li>
          <li className="hover:text-gold transition-colors cursor-pointer">Eventos</li>
          <li className="hover:text-gold transition-colors cursor-pointer">Restaurante</li>
          <li className="hover:text-gold transition-colors cursor-pointer">Contacto</li>
        </ul>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center min-h-[90vh] pt-32 pb-16 text-center bg-cover bg-center"
        style={{ backgroundImage: `url('/tu-imagen-hero.jpg')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent z-0" />
        <h1 className="relative z-10 text-white text-[3.5rem] md:text-[6rem] font-serif font-bold leading-tight drop-shadow-2xl mb-6">
          TU PARADA <span className="text-gold font-cursive">GASTRONÓMICA</span> EN GRANADA
        </h1>
        <p className="relative z-10 text-white text-xl md:text-2xl font-light max-w-2xl mx-auto mb-10 drop-shadow-lg">
          Descubre el auténtico sabor de Andalucía en nuestro hotel-restaurante de carretera.
          Descansa, disfruta y saborea productos locales de calidad.
        </p>
        {/* Buscador de reservas */}
        <div className="relative z-10 w-full max-w-3xl bg-white/95 rounded-xl shadow-2xl flex flex-col md:flex-row items-center justify-between px-6 py-4 gap-4 backdrop-blur-md border border-gray-200">
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
          <button className="mt-4 md:mt-0 bg-black hover:bg-gold text-white hover:text-black font-bold px-8 py-3 rounded-lg text-lg transition-colors duration-300 shadow-lg">
            RESERVAR
          </button>
        </div>
      </section>

      {/* ================= INFO SECTION (Sobre el hotel) ================= */}
      <section
        ref={infoRef}
        className="relative flex flex-col md:flex-row items-center justify-center min-h-[500px] py-24 px-4 md:px-0 max-w-6xl mx-auto gap-0 md:gap-0 mt-12 mb-12"
      >
        <div className="absolute inset-0 z-0">
          <FotoPlaceholder className="w-full h-full object-cover" text="FOTO HOTEL" />
          <div className="absolute inset-0 bg-white/80 backdrop-blur-md" />
        </div>
        <div className="relative z-10 flex-1 flex flex-col gap-6 p-12 md:p-20">
          <h2 className="text-5xl font-serif font-bold text-black mb-2">
            Bienvenido a Granada Inn
          </h2>
          <p className="text-lg text-gray-700">
            Un hotel-restaurante familiar en la A-92, ideal para viajeros, familias y amantes de la
            buena mesa. Descansa en nuestras habitaciones cómodas y disfruta de la mejor gastronomía
            local.
          </p>
          <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
            <li>Parking gratuito y fácil acceso</li>
            <li>WiFi de alta velocidad</li>
            <li>Atención cercana y profesional</li>
            <li>Ambiente tranquilo y seguro</li>
          </ul>
        </div>
      </section>

      {/* ================= ROOMS SECTION (Habitaciones & Suites) ================= */}
      <section ref={roomsRef} className="bg-white py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-serif font-bold text-black text-center mb-16">
            Habitaciones & Suites
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Card 1 destacada con imagen de fondo */}
            <div className="room-card relative rounded-3xl overflow-hidden shadow-2xl border-4 border-gold min-h-[400px] flex flex-col justify-end group cursor-pointer transition-all">
              <div className="absolute inset-0">
                <FotoPlaceholder className="w-full h-full object-cover" text="FOTO SUITE" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>
              <div className="relative z-10 p-10 text-white">
                <h3 className="text-3xl font-serif font-bold mb-2">Suite Premium</h3>
                <p className="text-gold text-xl font-semibold mb-1">desde 120€/noche</p>
                <p className="text-lg">4 personas | terraza privada | bañera hidromasaje</p>
              </div>
            </div>
            {/* Card 2 cuadrada con animación parallax */}
            <div className="room-card bg-[#f7f6f2] rounded-3xl shadow-xl border border-gray-200 flex flex-col overflow-hidden min-h-[400px] group cursor-pointer transition-all">
              <div className="overflow-hidden">
                <FotoPlaceholder
                  className="w-full h-[400px] object-cover group-hover:scale-110 transition-transform duration-500"
                  text="FOTO DELUXE"
                />
              </div>
              <div className="p-10 flex flex-col gap-2">
                <h3 className="text-2xl font-serif font-bold text-black mb-1">Habitación Deluxe</h3>
                <p className="text-gold text-lg font-semibold">desde 80€/noche</p>
                <p className="text-gray-700 text-base">
                  2-3 personas | desayuno incluido | baño privado
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= EVENTS & CELEBRACIONES SECTION ================= */}
      <section ref={eventsRef} className="relative py-32 px-4 bg-black/90">
        <div className="absolute inset-0 -z-10">
          <FotoPlaceholder className="w-full h-full object-cover" text="FOTO EVENTO" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-serif font-bold text-gold text-center mb-16">
            Eventos & Celebraciones
          </h2>
          <p className="text-white text-xl text-center max-w-3xl mx-auto mb-16">
            Celebra bodas, comuniones y eventos especiales en un entorno elegante y tradicional, con
            la mejor gastronomía y atención personalizada.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Card 1 */}
            <div className="event-card bg-white/90 rounded-2xl shadow-2xl border-2 border-gold flex flex-col items-center p-10 gap-4 cursor-pointer transition-all">
              <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="22" stroke="#C9A86B" strokeWidth="4" />
                <path
                  d="M16 32l8-8 8 8"
                  stroke="#C9A86B"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h3 className="text-xl font-serif font-bold text-black">Bodas y comuniones</h3>
              <p className="text-gray-700 text-center">
                Salones elegantes, menús personalizados y decoración especial para tu gran día.
              </p>
            </div>
            {/* Card 2 */}
            <div className="event-card bg-white/90 rounded-2xl shadow-2xl border-2 border-gold flex flex-col items-center p-10 gap-4 cursor-pointer transition-all">
              <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
                <rect x="8" y="16" width="32" height="20" rx="4" stroke="#C9A86B" strokeWidth="4" />
                <path
                  d="M16 36V16M32 36V16"
                  stroke="#C9A86B"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <h3 className="text-xl font-serif font-bold text-black">Eventos de empresa</h3>
              <p className="text-gray-700 text-center">
                Salas equipadas, coffee breaks y atención profesional para tus reuniones.
              </p>
            </div>
            {/* Card 3 */}
            <div className="event-card bg-white/90 rounded-2xl shadow-2xl border-2 border-gold flex flex-col items-center p-10 gap-4 cursor-pointer transition-all">
              <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
                <rect
                  x="12"
                  y="12"
                  width="24"
                  height="24"
                  rx="8"
                  stroke="#C9A86B"
                  strokeWidth="4"
                />
                <circle cx="24" cy="24" r="6" stroke="#C9A86B" strokeWidth="3" />
              </svg>
              <h3 className="text-xl font-serif font-bold text-black">Restaurante & tienda</h3>
              <p className="text-gray-700 text-center">
                Cocina tradicional, productos locales y tienda gourmet para tus invitados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FUTURE SECTIONS ================= */}
      {/*
        Aquí puedes añadir nuevas secciones como:
        - Restaurante
        - Galería de fotos
        - Opiniones de clientes
        - Blog o noticias
        - Ofertas especiales
        - Formulario de contacto
        - Mapa y localización
      */}

      {/* ================= FOOTER ================= */}
      {/*
        Ejemplo de footer a implementar:
        GRANADA INN | Carretera A-92, Granada | Tel: 958 123 456
        Aviso legal | Política de privacidad | Cookies
        [iconos de redes sociales]
      */}
    </main>
  );
}
