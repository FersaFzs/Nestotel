'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuthGuard } from '../../lib/hooks/useAuthGuard';

interface Reservation {
  _id: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: string;
  specialRequests?: string;
  createdAt: string;
  room?: {
    name: string;
    type: string;
  };
}

export default function ReservasPage() {
  const { user, isLoading } = useAuthGuard();
  const searchParams = useSearchParams();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      fetchReservations();
    }
  }, [user]);

  const fetchReservations = async () => {
    try {
      const response = await fetch(`/api/reservations?userId=${user?.uid}`);
      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      }
    } catch (error) {
      // Error fetching reservations - handled silently in production
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400 bg-green-400/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'cancelled':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center'>
        <div className='text-gold text-xl'>Cargando...</div>
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

      <div className='relative min-h-screen flex flex-col'>
        {/* Header */}
        <div className='p-6'>
          <Link
            href='/'
            className='inline-flex items-center gap-2 text-gold hover:text-yellow-400 transition-colors'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 19l-7-7m0 0l7-7m-7 7h18'
              />
            </svg>
            Volver al inicio
          </Link>
        </div>

        {/* Main Content */}
        <div className='flex-1 px-4 py-8'>
          <div className='w-full max-w-6xl mx-auto'>
            <div className='text-center mb-8'>
              <h1 className='text-4xl font-serif font-bold text-white mb-4'>Mis Reservas</h1>
              <div className='w-24 h-1 bg-gold mx-auto' />
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className='bg-green-500/20 border border-green-500/50 text-green-200 px-6 py-4 rounded-xl mb-6 text-center'>
                <p className='font-medium'>¡Reserva creada exitosamente!</p>
                <p className='text-sm mt-1'>Te enviaremos un email de confirmación pronto.</p>
              </div>
            )}

            {loading ? (
              <div className='text-center py-12'>
                <div className='text-gold text-xl'>Cargando reservas...</div>
              </div>
            ) : reservations.length === 0 ? (
              <div className='bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-12 shadow-2xl text-center'>
                <svg
                  className='w-16 h-16 text-gold mx-auto mb-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                  />
                </svg>
                <h2 className='text-2xl font-bold text-white mb-2'>No tienes reservas todavía</h2>
                <p className='text-gray-400 mb-6'>
                  Bienvenido {user?.displayName || user?.email}. Aquí aparecerán todas tus reservas
                  cuando hagas una.
                </p>
                <Link
                  href='/reserva'
                  className='inline-block bg-gold hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-xl transition-all duration-300'
                >
                  Hacer mi primera reserva
                </Link>
              </div>
            ) : (
              <div className='space-y-6'>
                {/* Add New Reservation Button */}
                <div className='text-center'>
                  <Link
                    href='/reserva'
                    className='inline-flex items-center gap-2 bg-gold hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-xl transition-all duration-300'
                  >
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                      />
                    </svg>
                    Nueva Reserva
                  </Link>
                </div>

                {/* Reservations List */}
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                  {reservations.map(reservation => (
                    <div
                      key={reservation._id}
                      className='bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 shadow-2xl'
                    >
                      {/* Header */}
                      <div className='flex justify-between items-start mb-4'>
                        <div>
                          <h3 className='text-xl font-bold text-white'>
                            {reservation.room?.name || 'Habitación'}
                          </h3>
                          <p className='text-gray-400 text-sm'>
                            {reservation.room?.type || 'Tipo no disponible'}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}
                        >
                          {getStatusText(reservation.status)}
                        </span>
                      </div>

                      {/* Details */}
                      <div className='space-y-3 mb-4'>
                        <div className='flex justify-between'>
                          <span className='text-gray-400'>Check-in:</span>
                          <span className='text-white'>{formatDate(reservation.checkIn)}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-400'>Check-out:</span>
                          <span className='text-white'>{formatDate(reservation.checkOut)}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-400'>Huéspedes:</span>
                          <span className='text-white'>{reservation.guests}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='text-gray-400'>Total:</span>
                          <span className='text-gold font-bold'>
                            {formatPrice(reservation.totalPrice)}
                          </span>
                        </div>
                        {reservation.specialRequests && (
                          <div>
                            <span className='text-gray-400 block'>Solicitudes especiales:</span>
                            <span className='text-white text-sm'>
                              {reservation.specialRequests}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className='border-t border-white/20 pt-4'>
                        <p className='text-gray-400 text-xs'>
                          Reserva creada: {formatDate(reservation.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
