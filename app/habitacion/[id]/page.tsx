'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { gsap } from 'gsap';

interface Room {
  _id: string;
  name: string;
  number: string;
  type: string;
  description: string;
  price: number;
  maxGuests: number;
  amenities: string[];
  images: string[];
  status: 'free' | 'dirty' | 'occupied';
  floor?: number;
  isActive: boolean;
}

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`/api/rooms/${params['id']}`);
        if (response.ok) {
          const roomData = await response.json();
          setRoom(roomData);
        } else {
          // Room not found - redirect to home
          router.push('/');
        }
      } catch (error) {
        // Error loading room - handled silently in production
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    if (params['id']) {
      fetchRoom();
    }
  }, [params, router]);

  const handleBooking = () => {
    if (!room) return;

    const queryParams = new URLSearchParams({
      roomId: room._id,
      roomName: room.name,
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: bookingData.guests.toString(),
    });

    router.push(`/reserva?${queryParams.toString()}`);
  };

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-gold mx-auto'></div>
          <p className='mt-4 text-gold'>Cargando habitación...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-serif text-white mb-4'>Habitación no encontrada</h1>
          <button
            onClick={() => router.push('/')}
            className='bg-gold text-white px-6 py-3 rounded-lg hover:bg-gold/90 transition-colors'
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-black'>
      {/* Background decoration */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-gold/10 rounded-full blur-3xl' />
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-gold/10 rounded-full blur-3xl' />
      </div>

      <div className='relative min-h-screen'>
        {/* Header */}
        <div className='bg-black/20 backdrop-blur-sm border-b border-gold/20'>
          <div className='max-w-7xl mx-auto px-4 py-6'>
            <button
              onClick={() => router.push('/')}
              className='flex items-center text-gold hover:text-yellow-400 transition-colors mb-4'
            >
              <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
              Volver al inicio
            </button>
            <h1 className='text-4xl font-serif font-bold text-white'>{room.name}</h1>
            <p className='text-gold text-xl font-semibold'>Habitación {room.number}</p>
          </div>
        </div>

        <div className='max-w-7xl mx-auto px-4 py-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            {/* Galería de imágenes */}
            <div className='space-y-4'>
              <div className='relative h-96 rounded-2xl overflow-hidden border border-gold/20'>
                <Image
                  src={room.images[selectedImage] || '/images/habitacion.jpeg'}
                  alt={room.name}
                  fill
                  className='object-cover'
                />
              </div>
              {room.images.length > 1 && (
                <div className='flex gap-2 overflow-x-auto'>
                  {room.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageClick(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 ${
                        selectedImage === index ? 'ring-2 ring-gold' : ''
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${room.name} - Imagen ${index + 1}`}
                        fill
                        className='object-cover'
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Información de la habitación */}
            <div className='space-y-6'>
              <div>
                <h2 className='text-3xl font-serif font-bold text-white mb-4'>{room.name}</h2>
                <p className='text-2xl font-semibold text-gold mb-4'>desde {room.price}€/noche</p>
                <p className='text-gray-300 text-lg leading-relaxed'>{room.description}</p>
              </div>

              {/* Detalles */}
              <div className='bg-black/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gold/20'>
                <h3 className='text-xl font-serif font-bold text-white mb-4'>Detalles</h3>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-gray-400 text-sm'>Tipo</p>
                    <p className='font-semibold text-white'>{room.type}</p>
                  </div>
                  <div>
                    <p className='text-gray-400 text-sm'>Huéspedes máximos</p>
                    <p className='font-semibold text-white'>{room.maxGuests} personas</p>
                  </div>
                  {room.floor && (
                    <div>
                      <p className='text-gray-400 text-sm'>Piso</p>
                      <p className='font-semibold text-white'>{room.floor}</p>
                    </div>
                  )}
                  <div>
                    <p className='text-gray-400 text-sm'>Estado</p>
                    <p className='font-semibold capitalize text-white'>{room.status}</p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className='bg-black/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gold/20'>
                <h3 className='text-xl font-serif font-bold text-white mb-4'>
                  Servicios incluidos
                </h3>
                <div className='flex flex-wrap gap-3'>
                  {room.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className='bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-medium'
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Botón de reserva */}
              <div className='bg-black/30 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gold/20'>
                <h3 className='text-xl font-serif font-bold text-white mb-4'>
                  Reservar esta habitación
                </h3>

                {!showBookingForm ? (
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className='w-full bg-gold text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-gold/90 transition-colors'
                  >
                    Seleccionar fechas
                  </button>
                ) : (
                  <div className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-300 mb-2'>
                          Fecha de entrada
                        </label>
                        <input
                          type='date'
                          value={bookingData.checkIn}
                          onChange={e =>
                            setBookingData({ ...bookingData, checkIn: e.target.value })
                          }
                          className='w-full px-4 py-3 bg-black/40 border border-gold/30 rounded-lg text-white focus:ring-2 focus:ring-gold focus:border-gold'
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-300 mb-2'>
                          Fecha de salida
                        </label>
                        <input
                          type='date'
                          value={bookingData.checkOut}
                          onChange={e =>
                            setBookingData({ ...bookingData, checkOut: e.target.value })
                          }
                          className='w-full px-4 py-3 bg-black/40 border border-gold/30 rounded-lg text-white focus:ring-2 focus:ring-gold focus:border-gold'
                          min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-300 mb-2'>
                        Número de huéspedes
                      </label>
                      <select
                        value={bookingData.guests}
                        onChange={e =>
                          setBookingData({ ...bookingData, guests: parseInt(e.target.value) })
                        }
                        className='w-full px-4 py-3 bg-black/40 border border-gold/30 rounded-lg text-white focus:ring-2 focus:ring-gold focus:border-gold'
                      >
                        {Array.from({ length: room.maxGuests }, (_, i) => i + 1).map(num => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'huésped' : 'huéspedes'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className='flex gap-3'>
                      <button
                        onClick={handleBooking}
                        disabled={!bookingData.checkIn || !bookingData.checkOut}
                        className='flex-1 bg-gold text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        Continuar con la reserva
                      </button>
                      <button
                        onClick={() => setShowBookingForm(false)}
                        className='px-6 py-4 border border-gold/30 text-gray-300 rounded-xl font-semibold hover:bg-black/20 transition-colors'
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
