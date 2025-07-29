'use client';
import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '../lib/contexts/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import { useImageLoader } from '../lib/hooks/useImageLoader';
import { useRouter } from 'next/navigation';
gsap.registerPlugin(ScrollTrigger);

// Componente Header inteligente
function SmartHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Si el ratón está en la parte superior, mostrar header
      if (isHovering) {
        setIsVisible(true);
        return;
      }

      // Si estamos en la parte superior de la página, mostrar header
      if (currentScrollY < 100) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      // Ocultar al hacer scroll hacia abajo, mostrar al hacer scroll hacia arriba
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Si el ratón está en la parte superior de la pantalla (primeros 100px)
      if (e.clientY <= 100) {
        setIsHovering(true);
        setIsVisible(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [lastScrollY, isHovering]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      // Error logging out - handled silently in production
    }
  };

  return (
    <nav
      className={`w-full flex items-center justify-between px-12 py-8 bg-gradient-to-r from-black/80 via-gray-900/80 to-black/80 backdrop-blur-md fixed top-0 left-0 z-30 shadow-lg transition-all duration-300 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div
        className="text-3xl font-serif tracking-widest text-gold font-bold cursor-pointer hover:text-yellow-400 transition-colors"
        onClick={scrollToTop}
      >
        GRANADA INN
      </div>

      <div className="flex items-center gap-10">
        {/* Navigation Menu */}
        <ul className="flex gap-10 text-lg text-white font-medium">
          <li className="hover:text-gold transition-colors cursor-pointer" onClick={scrollToTop}>
            Inicio
          </li>
          <li
            className="hover:text-gold transition-colors cursor-pointer"
            onClick={() => scrollToSection('rooms-section')}
          >
            Habitaciones
          </li>
          <li
            className="hover:text-gold transition-colors cursor-pointer"
            onClick={() => scrollToSection('events-section')}
          >
            Eventos
          </li>
          <li
            className="hover:text-gold transition-colors cursor-pointer"
            onClick={() => scrollToSection('garden-section')}
          >
            Jardín
          </li>
          <li
            className="hover:text-gold transition-colors cursor-pointer"
            onClick={() => scrollToSection('footer')}
          >
            Contacto
          </li>
        </ul>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="text-gray-400">Cargando...</div>
          ) : user ? (
            <div className="relative flex items-center gap-4">
              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 text-white hover:text-gold transition-colors focus:outline-none"
                >
                  {/* Avatar placeholder */}
                  <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-black font-bold text-sm">
                    {user.displayName
                      ? user.displayName[0].toUpperCase()
                      : user.email?.[0].toUpperCase()}
                  </div>
                  <span className="text-white text-sm hidden md:block">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  {/* Dropdown arrow */}
                  <svg
                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-48 bg-black/90 backdrop-blur-md border border-gold/30 rounded-xl shadow-2xl py-2 z-50"
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    {/* User Info */}
                    <div className="px-4 py-2 border-b border-gold/20">
                      <p className="text-white font-medium text-sm">
                        {user.displayName || 'Usuario'}
                      </p>
                      <p className="text-gray-400 text-xs">{user.email}</p>
                    </div>

                    {/* Menu Items */}
                    <Link
                      href="/perfil"
                      className="flex items-center gap-2 px-4 py-2 text-white hover:bg-gold/20 hover:text-gold transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="text-sm">Mi Perfil</span>
                    </Link>

                    <Link
                      href="/reservas"
                      className="flex items-center gap-2 px-4 py-2 text-white hover:bg-gold/20 hover:text-gold transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-sm">Mis Reservas</span>
                    </Link>

                    <Link
                      href="/reserva"
                      className="flex items-center gap-2 px-4 py-2 text-white hover:bg-gold/20 hover:text-gold transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <span className="text-sm">Nueva Reserva</span>
                    </Link>

                    <div className="border-t border-gold/20 mt-2 pt-2">
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-white hover:bg-red-500/20 hover:text-red-400 transition-colors w-full text-left"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span className="text-sm">Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <Link
                href="/reserva"
                className="bg-gold hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium transition-colors text-sm"
              >
                Reservar
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-white hover:text-gold transition-colors">
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="bg-gold hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

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

function PuertasSVG({ progress = 0 }: { progress: number }) {
  // progress: 0 (cerradas), 1 (abiertas)
  // Imagen de valla metal con efecto 3D
  return (
    <div className="absolute inset-0 z-20 pointer-events-none select-none">
      {/* Puerta izquierda - anclada al borde izquierdo */}
      <div
        className="absolute left-0 top-0 w-1/2 h-full overflow-hidden"
        style={{
          transform: `scaleX(${1 - progress})`,
          transformOrigin: 'left center',
          transition: 'transform 0.1s',
        }}
      >
        <Image
          src="/images/vallametal.png"
          alt="Valla metálica izquierda"
          fill
          className="object-cover"
          style={{
            filter: 'brightness(0.6) contrast(1.2)',
          }}
        />
      </div>

      {/* Puerta derecha - anclada al borde derecho (efecto espejo) */}
      <div
        className="absolute right-0 top-0 w-1/2 h-full overflow-hidden"
        style={{
          transform: `scaleX(${1 - progress})`,
          transformOrigin: 'right center',
          transition: 'transform 0.1s',
        }}
      >
        <Image
          src="/images/vallametal.png"
          alt="Valla metálica derecha"
          fill
          className="object-cover"
          style={{
            transform: 'scaleX(-1)', // Efecto espejo
            filter: 'brightness(0.6) contrast(1.2)',
          }}
        />
      </div>
    </div>
  );
}

function RoomsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = React.useState(0);
  const [titleVisible, setTitleVisible] = React.useState(true);
  const [roomsVisible, setRoomsVisible] = React.useState(false);
  const [roomsOffset, setRoomsOffset] = React.useState(0);
  const [rooms, setRooms] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  // Cargar habitaciones al montar el componente
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/rooms');
        if (response.ok) {
          const roomsData = await response.json();
          setRooms(roomsData);
        }
      } catch (error) {
        // Error loading rooms - handled silently in production
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleRoomClick = (room: any) => {
    router.push(`/habitacion/${room._id}`);
  };

  useEffect(() => {
    if (sectionRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=300%', // 3 veces la altura de la pantalla
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
            setProgress(self.progress);

            // Fase 1 (0-0.3): Solo aparece el título
            if (self.progress < 0.3) {
              setTitleVisible(true);
              setRoomsVisible(false);
              setRoomsOffset(100); // Las habitaciones están fuera de la pantalla a la derecha
            }
            // Fase 2 (0.3-0.6): Título desaparece, habitaciones entran desde la derecha
            else if (self.progress >= 0.3 && self.progress <= 0.6) {
              setTitleVisible(false);
              setRoomsVisible(true);
              const slidePhase = (self.progress - 0.3) / 0.3; // Normalizar a 0-1 en menos tiempo
              setRoomsOffset(100 - slidePhase * 100); // Las habitaciones se deslizan desde 100% a 0%
            }
            // Fase 3 (0.6-1.0): Habitaciones en posición final + espacio vacío para buffer
            else {
              setTitleVisible(false);
              setRoomsVisible(true);
              setRoomsOffset(0);
            }
          },
        },
      });

      return () => {
        if (tl.scrollTrigger) {
          tl.scrollTrigger.kill();
        }
      };
    }
  }, []);

  return (
    <section
      id="rooms-section"
      ref={sectionRef}
      className="relative w-screen h-screen overflow-hidden"
      style={{ minHeight: '100vh', minWidth: '100vw' }}
    >
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        <Image
          src="/images/pasillo.jpeg"
          alt="Pasillo del hotel"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      {/* Título principal */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-center"
        style={{
          opacity: titleVisible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <h2 className="text-6xl md:text-8xl font-serif font-bold text-white mb-4 drop-shadow-lg">
          Habitaciones & Suites
        </h2>
        <div className="w-32 h-1 bg-gold mx-auto" />
      </div>

      {/* Contenedor de habitaciones que entra desde la derecha */}
      <div
        className="absolute inset-0 flex items-center justify-center z-10"
        style={{
          opacity: roomsVisible ? 1 : 0,
          transform: `translateX(${roomsOffset}%)`,
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        {/* Contenedor de habitaciones dinámicas */}
        <div className="flex gap-12 px-8 w-full max-w-7xl">
          {loading ? (
            // Loading state
            <>
              <div className="flex-1">
                <div className="room-card bg-white rounded-3xl shadow-2xl border-4 border-gold h-[500px] flex flex-col overflow-hidden animate-pulse">
                  <div className="flex-1 bg-gray-200" />
                  <div className="p-8 flex flex-col gap-3">
                    <div className="h-8 bg-gray-200 rounded" />
                    <div className="h-6 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="flex flex-wrap gap-3 mt-4">
                      <div className="h-6 bg-gray-200 rounded-full w-20" />
                      <div className="h-6 bg-gray-200 rounded-full w-16" />
                      <div className="h-6 bg-gray-200 rounded-full w-24" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="room-card bg-white rounded-3xl shadow-2xl border-2 border-gray-200 h-[500px] flex flex-col overflow-hidden animate-pulse">
                  <div className="flex-1 bg-gray-200" />
                  <div className="p-8 flex flex-col gap-3">
                    <div className="h-8 bg-gray-200 rounded" />
                    <div className="h-6 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="flex flex-wrap gap-3 mt-4">
                      <div className="h-6 bg-gray-200 rounded-full w-20" />
                      <div className="h-6 bg-gray-200 rounded-full w-16" />
                      <div className="h-6 bg-gray-200 rounded-full w-24" />
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : rooms.length > 0 ? (
            // Habitaciones dinámicas
            rooms.slice(0, 2).map((room, index) => (
              <div key={room._id} className="flex-1">
                <div 
                  className={`room-card bg-gradient-to-br from-black/80 via-gray-900/80 to-black/80 backdrop-blur-sm rounded-3xl shadow-2xl h-[500px] flex flex-col overflow-hidden cursor-pointer transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-gold/30 hover:shadow-2xl hover:-rotate-1 select-none ${
                    index === 0 ? 'border-4 border-gold hover:border-gold/80' : 'border-2 border-gold/30 hover:border-gold/60'
                  }`}
                  onClick={() => handleRoomClick(room)}
                  style={{ transformOrigin: 'center center' }}
                >
                  <div className="flex-1 overflow-hidden relative pointer-events-none">
                    <Image
                      src={room.images?.[0] || "/images/habitacion.jpeg"}
                      alt={room.name}
                      fill
                      className="object-cover transition-transform duration-500"
                    />
                  </div>
                  <div className="p-8 flex flex-col gap-3 pointer-events-none">
                    <h3 className="text-3xl font-serif font-bold text-white">{room.name}</h3>
                    <p className="text-gold text-xl font-semibold">desde {room.price}€/noche</p>
                    <p className="text-gray-300 text-lg">
                      {room.maxGuests} {room.maxGuests === 1 ? 'persona' : 'personas'} | {room.description.split(' ').slice(0, 3).join(' ')}...
                    </p>
                    <div className="flex flex-wrap gap-3 mt-4">
                      {room.amenities?.slice(0, 3).map((amenity: string, amenityIndex: number) => (
                        <span 
                          key={amenityIndex} 
                          className={`px-4 py-2 rounded-full text-sm ${
                            index === 0 
                              ? 'bg-gold/20 text-gold' 
                              : 'bg-gold/10 text-gold/80'
                          }`}
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Fallback: habitaciones estáticas si no hay datos
            <>
              <div className="flex-1">
                <div className="room-card bg-gradient-to-br from-black/80 via-gray-900/80 to-black/80 backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-gold h-[500px] flex flex-col overflow-hidden cursor-pointer transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-gold/30 hover:shadow-2xl hover:-rotate-1 hover:border-gold/80 select-none" style={{ transformOrigin: 'center center' }}>
                  <div className="flex-1 overflow-hidden relative pointer-events-none">
                    <Image
                      src="/images/habitacion.jpeg"
                      alt="Suite Premium"
                      fill
                      className="object-cover transition-transform duration-500"
                    />
                  </div>
                  <div className="p-8 flex flex-col gap-3 pointer-events-none">
                    <h3 className="text-3xl font-serif font-bold text-white">Suite Premium</h3>
                    <p className="text-gold text-xl font-semibold">desde 120€/noche</p>
                    <p className="text-gray-300 text-lg">
                      4 personas | terraza privada | bañera hidromasaje
                    </p>
                    <div className="flex flex-wrap gap-3 mt-4">
                      <span className="bg-gold/20 px-4 py-2 rounded-full text-sm text-gold">
                        WiFi gratis
                      </span>
                      <span className="bg-gold/20 px-4 py-2 rounded-full text-sm text-gold">
                        TV 4K
                      </span>
                      <span className="bg-gold/20 px-4 py-2 rounded-full text-sm text-gold">
                        Minibar
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="room-card bg-gradient-to-br from-black/80 via-gray-900/80 to-black/80 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-gold/30 h-[500px] flex flex-col overflow-hidden cursor-pointer transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-gold/30 hover:shadow-2xl hover:-rotate-1 hover:border-gold/60 select-none" style={{ transformOrigin: 'center center' }}>
                  <div className="flex-1 overflow-hidden relative pointer-events-none">
                    <Image
                      src="/images/habitacion.jpeg"
                      alt="Habitación Deluxe"
                      fill
                      className="object-cover transition-transform duration-500"
                    />
                  </div>
                  <div className="p-8 flex flex-col gap-3 pointer-events-none">
                    <h3 className="text-3xl font-serif font-bold text-white">Habitación Deluxe</h3>
                    <p className="text-gold text-xl font-semibold">desde 80€/noche</p>
                    <p className="text-gray-300 text-lg">
                      2-3 personas | desayuno incluido | baño privado
                    </p>
                    <div className="flex flex-wrap gap-3 mt-4">
                      <span className="bg-gold/10 px-4 py-2 rounded-full text-sm text-gold/80">
                        WiFi gratis
                      </span>
                      <span className="bg-gold/10 px-4 py-2 rounded-full text-sm text-gold/80">
                        TV Smart
                      </span>
                      <span className="bg-gold/10 px-4 py-2 rounded-full text-sm text-gold/80">
                        Aire acondicionado
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function EventsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = React.useState(0);
  const [titleVisible, setTitleVisible] = React.useState(true);
  const [cardsVisible, setCardsVisible] = React.useState(false);
  const [cardsOffset, setCardsOffset] = React.useState(0);

  useEffect(() => {
    if (sectionRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=300%', // 3 veces la altura de la pantalla
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
            setProgress(self.progress);

            // Fase 1 (0-0.3): Solo aparece el título
            if (self.progress < 0.3) {
              setTitleVisible(true);
              setCardsVisible(false);
              setCardsOffset(100); // Las tarjetas están fuera de la pantalla a la derecha
            }
            // Fase 2 (0.3-0.6): Título desaparece, tarjetas entran desde la derecha
            else if (self.progress >= 0.3 && self.progress <= 0.6) {
              setTitleVisible(false);
              setCardsVisible(true);
              const slidePhase = (self.progress - 0.3) / 0.3; // Normalizar a 0-1 en menos tiempo
              setCardsOffset(100 - slidePhase * 100); // Las tarjetas se deslizan desde 100% a 0%
            }
            // Fase 3 (0.6-1.0): Tarjetas en posición final + espacio vacío para buffer
            else {
              setTitleVisible(false);
              setCardsVisible(true);
              setCardsOffset(0);
            }
          },
        },
      });

      return () => {
        if (tl.scrollTrigger) {
          tl.scrollTrigger.kill();
        }
      };
    }
  }, []);

  return (
    <section
      id="events-section"
      ref={sectionRef}
      className="relative w-screen h-screen overflow-hidden"
      style={{ minHeight: '100vh', minWidth: '100vw' }}
    >
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        <Image
          src="/images/salon-comedor.jpeg"
          alt="Salón comedor"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Título principal */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-center"
        style={{
          opacity: titleVisible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <h2 className="text-6xl md:text-8xl font-serif font-bold text-gold mb-4 drop-shadow-lg">
          Eventos & Celebraciones
        </h2>
        <div className="w-32 h-1 bg-gold mx-auto mb-6" />
        <p className="text-white text-xl max-w-3xl mx-auto drop-shadow-lg">
          Celebra bodas, comuniones y eventos especiales en un entorno elegante y tradicional
        </p>
      </div>

      {/* Contenedor de tarjetas que entra desde la derecha */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          opacity: cardsVisible ? 1 : 0,
          transform: `translateX(${cardsOffset}%)`,
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        {/* Contenedor de las tres tarjetas juntas */}
        <div className="flex gap-12 px-8 w-full max-w-7xl">
          {/* Tarjeta 1: Bodas y comuniones */}
          <div className="flex-1">
            <div className="event-card bg-gradient-to-br from-black/80 via-gray-900/80 to-black/80 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-gold h-[500px] flex flex-col items-center justify-center p-10 cursor-pointer transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-gold/30 hover:shadow-2xl hover:-rotate-1 hover:border-gold/80 select-none" style={{ transformOrigin: 'center center' }}>
              <div className="bg-gold/20 rounded-full p-6 mb-6 pointer-events-none">
                <svg width="60" height="60" fill="none" viewBox="0 0 48 48" className="pointer-events-none">
                  <circle cx="24" cy="24" r="22" stroke="#C9A86B" strokeWidth="4" />
                  <path
                    d="M16 32l8-8 8 8"
                    stroke="#C9A86B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-4 text-center pointer-events-none">
                Bodas y comuniones
              </h3>
              <p className="text-gray-300 text-center text-lg leading-relaxed pointer-events-none">
                Salones elegantes, menús personalizados y decoración especial para tu gran día.
              </p>
              <div className="mt-6 flex gap-3 pointer-events-none">
                <span className="bg-gold/20 px-4 py-2 rounded-full text-sm text-gold">
                  Salón elegante
                </span>
                <span className="bg-gold/20 px-4 py-2 rounded-full text-sm text-gold">
                  Menú personalizado
                </span>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Eventos de empresa */}
          <div className="flex-1">
            <div className="event-card bg-gradient-to-br from-black/80 via-gray-900/80 to-black/80 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-gold h-[500px] flex flex-col items-center justify-center p-10 cursor-pointer transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-gold/30 hover:shadow-2xl hover:-rotate-1 hover:border-gold/80 select-none" style={{ transformOrigin: 'center center' }}>
              <div className="bg-gold/20 rounded-full p-6 mb-6 pointer-events-none">
                <svg width="60" height="60" fill="none" viewBox="0 0 48 48" className="pointer-events-none">
                  <rect
                    x="8"
                    y="16"
                    width="32"
                    height="20"
                    rx="4"
                    stroke="#C9A86B"
                    strokeWidth="4"
                  />
                  <path
                    d="M16 36V16M32 36V16"
                    stroke="#C9A86B"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-4 text-center pointer-events-none">
                Eventos de empresa
              </h3>
              <p className="text-gray-300 text-center text-lg leading-relaxed pointer-events-none">
                Salas equipadas, coffee breaks y atención profesional para tus reuniones.
              </p>
              <div className="mt-6 flex gap-3 pointer-events-none">
                <span className="bg-gold/20 px-4 py-2 rounded-full text-sm text-gold">
                  Salas equipadas
                </span>
                <span className="bg-gold/20 px-4 py-2 rounded-full text-sm text-gold">
                  Coffee breaks
                </span>
              </div>
            </div>
          </div>

          {/* Tarjeta 3: Restaurante & tienda */}
          <div className="flex-1">
            <div className="event-card bg-gradient-to-br from-black/80 via-gray-900/80 to-black/80 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-gold h-[500px] flex flex-col items-center justify-center p-10 cursor-pointer transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-gold/30 hover:shadow-2xl hover:-rotate-1 hover:border-gold/80 select-none" style={{ transformOrigin: 'center center' }}>
              <div className="bg-gold/20 rounded-full p-6 mb-6 pointer-events-none">
                <svg width="60" height="60" fill="none" viewBox="0 0 48 48" className="pointer-events-none">
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
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-4 text-center pointer-events-none">
                Restaurante & tienda
              </h3>
              <p className="text-gray-300 text-center text-lg leading-relaxed pointer-events-none">
                Cocina tradicional, productos locales y tienda gourmet para tus invitados.
              </p>
              <div className="mt-6 flex gap-3 pointer-events-none">
                <span className="bg-gold/20 px-4 py-2 rounded-full text-sm text-gold">
                  Cocina tradicional
                </span>
                <span className="bg-gold/20 px-4 py-2 rounded-full text-sm text-gold">
                  Productos locales
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GardenSection() {
  const jardinRef = useRef<HTMLDivElement>(null);
  const [puertas, setPuertas] = React.useState(0); // 0=cerradas, 1=abiertas
  const [textProgress, setTextProgress] = React.useState(0);
  const [titleVisible, setTitleVisible] = React.useState(true);
  const [titleOpacity, setTitleOpacity] = React.useState(1);
  const [photosProgress, setPhotosProgress] = React.useState(0);
  const [hoverEnabled, setHoverEnabled] = React.useState(false);

  // Array de fotos del jardín con diferentes propiedades
  const gardenPhotos = [
    {
      src: '/images/jardin.jpeg',
      title: 'tus',
      delay: 0,
      finalX: -350, // Aún más separada hacia la izquierda
      finalY: -120,
      rotation: 345, // 360 - 15
    },
    {
      src: '/images/hotel-vista.jpeg',
      title: 'mejores',
      delay: 0.3,
      finalX: 350, // Aún más separada hacia la derecha
      finalY: -170,
      rotation: 380, // 360 + 20
    },
    {
      src: '/images/jardin.jpeg',
      title: 'recuerdos',
      delay: 0.6,
      finalX: 0, // Centro pero más abajo
      finalY: 200,
      rotation: 352, // 360 - 8
    },
  ];

  useEffect(() => {
    if (jardinRef.current) {
      // ScrollTrigger con pin como las otras secciones
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: jardinRef.current,
          start: 'top top',
          end: '+=400%',
          scrub: 1,
          pin: true,
          id: 'garden-section-main',
          onUpdate: (self) => {
            const {progress} = self;

            // Fase 1 (0-0.4): Puertas y título
            if (progress < 0.4) {
              setPuertas(progress / 0.4);

              // Título aparece desde el inicio y desaparece justo antes de las fotos
              if (progress < 0.08) {
                setTitleVisible(true);
                setTitleOpacity(Math.min(1, progress / 0.08));
              } else if (progress >= 0.08 && progress < 0.35) {
                setTitleVisible(true);
                setTitleOpacity(1);
              } else if (progress >= 0.35 && progress < 0.4) {
                setTitleVisible(true);
                setTitleOpacity(Math.max(0, 1 - (progress - 0.35) / 0.05));
              } else {
                setTitleVisible(false);
                setTitleOpacity(0);
              }

              setPhotosProgress(0);
            }
            // Fase 2 (0.4-0.7): Fotos volando hacia la pantalla
            else if (progress >= 0.4 && progress <= 0.7) {
              setPuertas(1);
              setTitleVisible(false);
              setTitleOpacity(0);
              setPhotosProgress((progress - 0.4) / 0.3);
              setHoverEnabled(false);
            }
            // Fase 3 (0.7-0.8): Pequeño espacio de transición
            else if (progress >= 0.7 && progress <= 0.8) {
              setPuertas(1);
              setTitleVisible(false);
              setTitleOpacity(0);
              setPhotosProgress(1);
              setHoverEnabled(false);
            }
            // Fase 4 (0.8-1.0): Buffer con efectos hover activos
            else {
              setPuertas(1);
              setTitleVisible(false);
              setTitleOpacity(0);
              setPhotosProgress(1);
              setHoverEnabled(true);
            }
          },
        },
      });

      // Zoom al jardín
      gsap.fromTo(
        '.jardin-img',
        { scale: 1, filter: 'brightness(0.7)' },
        {
          scale: 1.28,
          filter: 'brightness(1)',
          scrollTrigger: {
            trigger: jardinRef.current,
            start: 'top top',
            end: '+=300%',
            scrub: 1,
            id: 'garden-section-zoom',
          },
        },
      );

      // Cleanup function
      return () => {
        if (tl.scrollTrigger) {
          tl.scrollTrigger.kill();
        }
        // Limpiar ScrollTriggers específicos de esta sección
        const gardenTriggers = ScrollTrigger.getAll().filter(
          (st) => st.vars.id === 'garden-section-main' || st.vars.id === 'garden-section-zoom',
        );
        gardenTriggers.forEach((st) => st.kill());
      };
    }
  }, []);

  return (
    <section
      id="garden-section"
      ref={jardinRef}
      className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-black"
      style={{ minHeight: '100vh', minWidth: '100vw' }}
    >
      {/* Imagen de fondo a pantalla completa */}
      <Image
        src="/images/jardin.jpeg"
        alt="Jardín del hotel"
        fill
        className="jardin-img object-cover"
        style={{ zIndex: 1 }}
      />
      <div className="absolute inset-0 bg-black/30" style={{ zIndex: 2 }} />
      {/* Título principal que aparece por encima de las puertas */}
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 text-center"
        style={{
          opacity: titleOpacity,
          transition: 'opacity 0.3s ease',
          visibility: titleVisible ? 'visible' : 'hidden',
        }}
      >
        <h2 className="text-6xl md:text-8xl font-serif font-bold text-white mb-4 drop-shadow-lg">
          Jardín & Exteriores
        </h2>
        <div className="w-32 h-1 bg-gold mx-auto mb-6" />
        <p className="text-xl text-white drop-shadow-lg max-w-2xl mx-auto leading-relaxed">
          Disfruta de nuestro jardín, ideal para celebraciones, eventos al aire libre y momentos de
          relax rodeado de naturaleza.
        </p>
      </div>

      {/* Puertas SVG animadas y decoradas */}
      <PuertasSVG progress={puertas} />

      {/* Contenedor de fotos polaroid volando hacia la pantalla */}
      <div className="absolute inset-0 z-40" style={{ perspective: '1000px' }}>
        {gardenPhotos.map((photo, index) => {
          // Calcular el progreso individual de cada foto con delay
          const photoStartProgress = photo.delay;
          const photoEndProgress = photoStartProgress + 0.25; // Cada foto toma 25% del tiempo total
          const photoProgress = Math.max(
            0,
            Math.min(
              1,
              (photosProgress - photoStartProgress) / (photoEndProgress - photoStartProgress),
            ),
          );

          // Nueva animación: empieza grande y borrosa, se reduce y enfoca
          // Posición de la foto (centrada inicialmente, luego se mueve a su posición final)
          const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;
          const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 1080;

          const initialX = screenWidth / 2; // Empieza en el centro
          const initialY = screenHeight / 2; // Empieza en el centro
          const finalX = screenWidth / 2 + photo.finalX; // Posición final relativa al centro
          const finalY = screenHeight / 2 + photo.finalY; // Posición final relativa al centro

          // Interpolación con easing suave
          const easeProgress = 1 - Math.pow(1 - photoProgress, 2);
          const currentX = initialX + (finalX - initialX) * easeProgress;
          const currentY = initialY + (finalY - initialY) * easeProgress;

          // Escala: empieza grande pero no tanto, se reduce al tamaño normal
          const initialScale = 2.5; // Empieza grande pero más controlado
          const finalScale = 1.0; // Termina en tamaño normal
          const currentScale = initialScale + (finalScale - initialScale) * easeProgress;

          // Rotación: gira hasta llegar a su rotación final
          const initialRotation = 0; // Empieza sin rotar
          const finalRotation = photo.rotation; // Rotación final predefinida
          const currentRotation =
            initialRotation + (finalRotation - initialRotation) * easeProgress;

          // Blur: empieza extremadamente borrosa y se va enfocando
          const initialBlur = 25; // Extremadamente borrosa, casi invisible
          const finalBlur = 0; // Completamente nítida
          const currentBlur = initialBlur + (finalBlur - initialBlur) * easeProgress;

          // Opacity: fade in muy gradual al principio, luego más rápido
          const opacity = photoProgress > 0 ? Math.min(1, Math.pow(photoProgress, 0.5) * 2) : 0;

          return (
            <div
              key={index}
              className={`absolute polaroid-photo ${
                hoverEnabled ? 'cursor-pointer' : 'cursor-default'
              }`}
              style={{
                left: `${currentX}px`,
                top: `${currentY}px`,
                transform: `
                  translate(-50%, -50%)
                  rotate(${currentRotation}deg) 
                  scale(${currentScale})
                `,
                opacity,
                filter: `blur(${currentBlur}px)`,
                zIndex: hoverEnabled ? 40 + index : 30 + index,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                if (hoverEnabled) {
                  e.currentTarget.style.transform = `
                    translate(-50%, -50%)
                    rotate(${currentRotation}deg) 
                    scale(${currentScale * 1.1})
                    translateY(-8px)
                  `;
                  e.currentTarget.style.zIndex = '60';
                  e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (hoverEnabled) {
                  e.currentTarget.style.transform = `
                    translate(-50%, -50%)
                    rotate(${currentRotation}deg) 
                    scale(${currentScale})
                  `;
                  e.currentTarget.style.zIndex = `${40 + index}`;
                  e.currentTarget.style.boxShadow =
                    '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                }
              }}
            >
              {/* Polaroid frame - máximo tamaño */}
              <div className="bg-white p-7 pb-16 shadow-2xl transform-gpu rounded-sm">
                <Image
                  src={photo.src}
                  alt={photo.title}
                  width={448}
                  height={320}
                  className="object-cover rounded-sm"
                />
                <p className="text-center text-2xl text-gray-700 mt-6 font-serif italic font-bold">
                  {photo.title}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function HeroHallTransition() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = React.useState(0); // 0: hero, 1: hall
  const [hallText, setHallText] = React.useState(0); // 0: oculto, 1: visible
  const [debug, setDebug] = React.useState(''); // Para debug

  useEffect(() => {
    if (sectionRef.current) {
      // Timeline principal para controlar toda la animación
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=600%', // Animación mucho más rápida y fluida
          scrub: 0.5, // Más fluido, como GTA VI
          pin: true,
          onUpdate: (self) => {
            setProgress(self.progress);
            // El texto del hall aparece en la segunda mitad de la animación
            setHallText(Math.max(0, (self.progress - 0.4) / 0.3));
            const hallY =
              self.progress > 0.4 ? Math.max(0, 500 - ((self.progress - 0.4) / 0.3) * 500) : 500;
            setDebug(
              `Progress: ${self.progress.toFixed(2)}, Hall visible: ${self.progress > 0.4}, Hall Y: ${hallY.toFixed(0)}px, Z-index: 50`,
            );
          },
        },
      });

      // Cleanup function
      return () => {
        if (tl.scrollTrigger) {
          tl.scrollTrigger.kill();
        }
      };
    }
  }, []);

  // Calcula estilos para las imágenes y overlays
  // Fase 1 (0-0.4): Hero sube - 40% del tiempo
  // Fase 2 (0.4-0.7): Hall aparece y se enfoca - 30% del tiempo
  // Fase 3 (0.7-0.9): Hall estático - 20% del tiempo
  // Fase 4 (0.9-1.0): Espacio vacío - 10% del tiempo

  const heroZoom = 1 + progress * 0.4; // Zoom más rápido del hero
  const heroOpacity = progress < 0.4 ? 1 : Math.max(0, 1 - (progress - 0.4) / 0.1); // Fade out en 0.4
  const heroBlur = progress > 0.35 ? (progress - 0.35) * 20 : 0; // Desenfoque gradual del hero
  const hallZoom = progress < 0.4 ? 1 : 1 + (progress - 0.4) * 0.5; // Hall empieza en tamaño normal y hace zoom
  const hallOpacity = progress < 0.4 ? 0 : 1; // Hall aparece en 0.4
  const hallBlur = progress < 0.4 ? 8 : Math.max(0, 8 - (progress - 0.4) * 26.67); // Desenfoque gradual, enfocado en 0.7

  // Calcula la posición del texto hero (sube hacia arriba)
  const heroTextY = progress * -1000; // Se mueve más rápido hacia arriba
  const heroTextOpacity = 1; // No se desvanece, solo se mueve

  // Calcula la posición del texto hall (entra desde abajo)
  const hallTextY = progress > 0.4 ? Math.max(0, 500 - ((progress - 0.4) / 0.3) * 500) : 500; // Se mueve hacia arriba desde abajo, se bloquea en 0
  const hallTextOpacity = 1; // Sin fade, aparece directamente

  return (
    <section
      ref={sectionRef}
      className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-black"
      style={{ minHeight: '100vh', minWidth: '100vw' }}
    >
      {/* Imagen hero (hotel-vista) */}
      <Image
        src="/images/hotel-vista.jpeg"
        alt="Vista general del hotel"
        fill
        className="object-cover"
        style={{
          zIndex: 1,
          transform: `scale(${heroZoom})`,
          filter: `brightness(0.8) blur(${heroBlur}px)`,
          opacity: heroOpacity, // Fade out en 0.5
          transition: 'opacity 0.2s',
        }}
      />
      {/* Overlay hero */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent"
        style={{ zIndex: 2, opacity: heroOpacity > 0 ? heroOpacity : 0 }}
      />
      {/* Imagen hall (fade-in y zoom) */}
      <Image
        src="/images/hotel-hall.jpeg"
        alt="Hall del hotel"
        fill
        className="object-cover"
        style={{
          zIndex: 3,
          transform: `scale(${hallZoom})`,
          filter: `blur(${hallBlur}px)`,
          opacity: hallOpacity,
          transition: 'opacity 0.2s',
        }}
      />
      {/* Overlay para el hall - por debajo del texto */}
      <div
        className="absolute inset-0 bg-black/60"
        style={{
          zIndex: 4,
          opacity: hallOpacity,
          pointerEvents: 'none',
        }}
      />

      {/* Texto hero - se mueve hacia arriba y desaparece */}
      <div
        className="hero-text absolute left-1/2 top-1/2 text-center z-10"
        style={{
          transform: `translate(-50%, calc(-50% + ${heroTextY}px))`,
          opacity: 1, // Siempre visible hasta que salga
          pointerEvents: progress < 0.4 ? 'auto' : 'none',
          visibility: 'visible', // Siempre visible, sigue subiendo
        }}
      >
        <h1 className="text-white text-[3.5rem] md:text-[6rem] font-serif font-bold leading-tight drop-shadow-2xl mb-6">
          UNA <span className="text-gold font-cursive">EXPERIENCIA</span> PARA EL CUERPO Y EL
          PALADAR
        </h1>
        <p className="text-white text-xl md:text-2xl font-light max-w-2xl mx-auto mb-10 drop-shadow-lg">
          Descubre el auténtico sabor de Andalucía en nuestro hotel-restaurante de carretera.
          Descansa, celebra y saborea productos locales de calidad.
        </p>
      </div>
      {/* Texto hall - entra desde abajo hacia arriba */}
      <div
        className="hall-text absolute inset-0 flex flex-col items-center justify-center"
        style={{
          zIndex: 50, // Z-index muy alto para estar por encima de todo
          transform: `translateY(${hallTextY}px)`,
          opacity: progress > 0.4 ? 1 : 0,
          pointerEvents: progress > 0.4 ? 'auto' : 'none',
        }}
      >
        <div className="text-center max-w-4xl mx-auto px-8">
          <h2 className="text-6xl md:text-8xl font-serif font-bold mb-6 tracking-wide">
            <span className="text-white drop-shadow-2xl">Bienvenido a</span>
            <br />
            <span className="text-gold drop-shadow-2xl">Granada Inn</span>
          </h2>

          {/* Línea decorativa */}
          <div className="w-32 h-1 bg-gold mx-auto mb-8" />

          <p className="text-white text-xl md:text-2xl leading-relaxed mb-8 drop-shadow-lg font-light">
            Un hotel-restaurante familiar en la A-92, donde la tradición andaluza se une con la
            comodidad moderna. Tu hogar lejos de casa en el corazón de Granada.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-gold text-4xl mb-3">🍽️</div>
              <h3 className="text-white text-lg font-semibold mb-2 drop-shadow-lg">Restaurante</h3>
              <p className="text-gray-200 text-sm drop-shadow-lg">Cocina andaluza tradicional</p>
            </div>
            <div className="text-center">
              <div className="text-gold text-4xl mb-3">🛏️</div>
              <h3 className="text-white text-lg font-semibold mb-2 drop-shadow-lg">Habitaciones</h3>
              <p className="text-gray-200 text-sm drop-shadow-lg">Confort y tranquilidad</p>
            </div>
            <div className="text-center">
              <div className="text-gold text-4xl mb-3">🎉</div>
              <h3 className="text-white text-lg font-semibold mb-2 drop-shadow-lg">Eventos</h3>
              <p className="text-gray-200 text-sm drop-shadow-lg">Celebraciones especiales</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isBookingVisible, setIsBookingVisible] = useState(true);
  const bookingRef = useRef<HTMLDivElement>(null);
  // Lista de imágenes principales para precargar
  const mainImages = [
    '/images/hotel-hall.jpeg',
    '/images/hotel-vista.jpeg',
    '/images/habitacion.jpeg',
    '/images/jardin.jpeg',
    '/images/pasillo.jpeg',
    '/images/salon-comedor.jpeg',
    '/images/vallametal.png',
  ];

  // Versión simple para testing - usar timer fijo en lugar de carga real de imágenes
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => {
              setIsLoading(false);
            }, 1000);
            return 100;
          }
          return prev + Math.random() * 20;
        });
      }, 200);

      return () => clearInterval(timer);
    }
  }, [isLoading]);

  // Booking form states
  const [rooms, setRooms] = useState<any[]>([]);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState('');
  const { user } = useAuth();



  // Cargar habitaciones al montar el componente
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/rooms');
        if (response.ok) {
          const roomsData = await response.json();
          setRooms(roomsData);
          // Seleccionar la primera habitación por defecto
          if (roomsData.length > 0) {
            setSelectedRoom(roomsData[0]._id);
          }
        }
              } catch (error) {
          // Error loading rooms - handled silently in production
        }
    };

    fetchRooms();
  }, []);

  // Función para manejar la reserva
  const handleBooking = () => {
    if (!user) {
      // Redirigir al login si no está autenticado
      const bookingData = {
        checkIn,
        checkOut,
        guests,
        roomId: selectedRoom,
      };
      localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      window.location.href = '/login';
      return;
    }

    // Si está autenticado, ir directamente a la página de reservas con los datos
    const searchParams = new URLSearchParams({
      checkIn,
      checkOut,
      guests: guests.toString(),
      roomId: selectedRoom,
    });
    window.location.href = `/reserva?${searchParams.toString()}`;
  };

  useEffect(() => {
    // Hero animación fade-in
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
    );

    // Click fuera del formulario para cerrar
    const handleClickOutside = (event: MouseEvent) => {
      if (
        bookingRef.current &&
        !bookingRef.current.contains(event.target as Node) &&
        isBookingVisible
      ) {
        setIsBookingVisible(false);
      }
    };

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

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLoadingComplete = () => {
    // La pantalla de carga se ha completado
  };

  return (
    <main className="bg-gradient-to-br from-black via-gray-900 to-black min-h-screen w-full">
      <LoadingScreen 
        isLoading={isLoading} 
        progress={progress}
        onLoadingComplete={handleLoadingComplete}
      />
      {/* ================= NAVBAR ================= */}
      <SmartHeader />

      {/* ================= HERO + HALL TRANSITION ================= */}
      <HeroHallTransition />

      {/* ================= COMPONENTE DE RESERVAS LATERAL ================= */}
      {/* Tarjeta de reservas lateral */}
      <div
        ref={bookingRef}
        className={`fixed top-32 left-4 z-40 transition-transform duration-500 ease-out ${
          isBookingVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="bg-gradient-to-br from-black/90 via-gray-900/90 to-black/90 backdrop-blur-md border-2 border-gold shadow-2xl rounded-2xl w-80 p-6">
          {/* Header con botón de cerrar */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-serif font-bold text-white">Reserva tu estancia</h3>
            <button
              onClick={() => setIsBookingVisible(false)}
              className="p-2 hover:bg-gold/20 rounded-full transition-colors duration-300"
            >
              <svg
                className="w-5 h-5 text-white hover:text-gold"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Formulario de reservas vertical */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gold mb-2 block uppercase tracking-wide">
                Check In
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-white/90 border-b-2 border-gold/50 focus:border-gold outline-none text-lg font-medium px-3 py-2 transition-colors duration-300 text-black rounded-md"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gold mb-2 block uppercase tracking-wide">
                Check Out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-white/90 border-b-2 border-gold/50 focus:border-gold outline-none text-lg font-medium px-3 py-2 transition-colors duration-300 text-black rounded-md"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gold mb-2 block uppercase tracking-wide">
                Huéspedes
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="w-full bg-white/90 border-b-2 border-gold/50 focus:border-gold outline-none text-lg font-medium px-3 py-2 transition-colors duration-300 text-black rounded-md"
              >
                <option value={1}>1 Adulto</option>
                <option value={2}>2 Adultos</option>
                <option value={3}>3 Adultos</option>
                <option value={4}>4 Adultos</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gold mb-2 block uppercase tracking-wide">
                Habitación
              </label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full bg-white/90 border-b-2 border-gold/50 focus:border-gold outline-none text-lg font-medium px-3 py-2 transition-colors duration-300 text-black rounded-md"
              >
                {rooms.map((room) => (
                  <option key={room._id} value={room._id}>
                    {room.name} - desde {room.price}€/noche
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleBooking}
              disabled={!checkIn || !checkOut || !selectedRoom}
              className="w-full bg-gold hover:bg-yellow-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-black font-bold px-6 py-4 rounded-xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl mt-6 font-serif"
            >
              {user ? 'RESERVAR AHORA' : 'INICIAR SESIÓN PARA RESERVAR'}
            </button>
          </div>

          {/* Decoración dorada */}
          <div className="w-16 h-1 bg-gold mx-auto mt-4" />
        </div>
      </div>

      {/* Pestaña para abrir cuando está oculto */}
      <div
        className={`fixed top-32 left-0 z-40 transition-transform duration-500 ease-out ${
          isBookingVisible ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <button
          onClick={() => setIsBookingVisible(true)}
          className="bg-gold hover:bg-yellow-500 text-black font-bold py-6 px-4 rounded-r-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center group"
        >
          <div className="flex items-center">
            <svg
              className="w-6 h-6 text-black group-hover:animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      {/* ================= ROOMS SECTION (Habitaciones & Suites) ================= */}
      <RoomsSection />

      {/* ================= JARDÍN SECTION ================= */}
      <GardenSection />

      {/* ================= EVENTS & CELEBRACIONES SECTION ================= */}
      <EventsSection />

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
      <footer id="footer" className="bg-black text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Sección principal del footer */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Columna 1: Logo y descripción */}
            <div className="md:col-span-2">
              <div className="text-4xl font-serif font-bold text-gold mb-4 tracking-widest">
                GRANADA INN
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
                Un hotel-restaurante familiar en la A-92, donde la tradición andaluza se une con la
                comodidad moderna. Tu hogar lejos de casa en el corazón de Granada.
              </p>
              <div className="flex gap-4">
                {/* Iconos de redes sociales */}
                <a
                  href="#"
                  className="bg-gold/20 hover:bg-gold text-gold hover:text-black p-3 rounded-full transition-all duration-300"
                >
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-gold/20 hover:bg-gold text-gold hover:text-black p-3 rounded-full transition-all duration-300"
                >
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-gold/20 hover:bg-gold text-gold hover:text-black p-3 rounded-full transition-all duration-300"
                >
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.741-1.378l-.742 2.852c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.986C24.007 5.367 18.641.001 12.017.001z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-gold/20 hover:bg-gold text-gold hover:text-black p-3 rounded-full transition-all duration-300"
                >
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Columna 2: Contacto */}
            <div>
              <h3 className="text-xl font-serif font-bold text-gold mb-6">Contacto</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start gap-3">
                  <svg
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="text-gold mt-1 flex-shrink-0"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  <span>
                    Carretera A-92, km 45
                    <br />
                    18015 Granada, España
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <svg
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="text-gold flex-shrink-0"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                  <span>958 123 456</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="text-gold flex-shrink-0"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  <span>info@granadainn.es</span>
                </li>
              </ul>
            </div>

            {/* Columna 3: Enlaces útiles */}
            <div>
              <h3 className="text-xl font-serif font-bold text-gold mb-6">Enlaces</h3>
              <ul className="space-y-3 text-gray-300">
                <li>
                  <a href="#" className="hover:text-gold transition-colors duration-300">
                    Habitaciones
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gold transition-colors duration-300">
                    Restaurante
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gold transition-colors duration-300">
                    Eventos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gold transition-colors duration-300">
                    Jardín
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gold transition-colors duration-300">
                    Galería
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gold transition-colors duration-300">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Línea divisoria decorativa */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Información principal */}
              <div className="text-center md:text-left">
                <p className="text-gray-300 text-lg">
                  <span className="text-gold font-bold">GRANADA INN</span> |
                  <span className="mx-2">Carretera A-92, Granada</span> |
                  <span className="mx-2">Tel: 958 123 456</span>
                </p>
              </div>

              {/* Enlaces legales */}
              <div className="flex gap-6 text-sm text-gray-400">
                <a href="#" className="hover:text-gold transition-colors duration-300">
                  Aviso legal
                </a>
                <span className="text-gray-600">|</span>
                <a href="#" className="hover:text-gold transition-colors duration-300">
                  Política de privacidad
                </a>
                <span className="text-gray-600">|</span>
                <a href="#" className="hover:text-gold transition-colors duration-300">
                  Cookies
                </a>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center mt-6 pt-6 border-t border-gray-800">
              <p className="text-gray-500 text-sm">
                © 2024 Granada Inn. Todos los derechos reservados. Diseñado con pasión por la
                hospitalidad andaluza.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
