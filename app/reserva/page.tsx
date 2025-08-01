'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useAuthGuard } from '../../lib/hooks/useAuthGuard';
import ReservationForm from '../../components/ReservationForm';
import { useSearchParams } from 'next/navigation';

function ReservaContent() {
  const { user, isLoading } = useAuthGuard();
  const searchParams = useSearchParams();
  const [prefilledData, setPrefilledData] = useState({
    roomId: '',
    roomName: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  // Extraer datos de la URL al cargar la página
  useEffect(() => {
    const roomId = searchParams.get('roomId');
    const roomName = searchParams.get('roomName');
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');

    if (roomId || roomName || checkIn || checkOut || guests) {
      setPrefilledData({
        roomId: roomId || '',
        roomName: roomName || '',
        checkIn: checkIn || '',
        checkOut: checkOut || '',
        guests: guests ? parseInt(guests) : 1,
      });
    }
  }, [searchParams]);

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
        <div className='flex-1 flex items-center justify-center px-4'>
          <div className='w-full max-w-4xl text-center'>
            <h1 className='text-4xl font-serif font-bold text-white mb-4'>Nueva Reserva</h1>
            <div className='w-24 h-1 bg-gold mx-auto mb-8' />

            {user && <ReservationForm user={user} prefilledData={prefilledData} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReservaPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ReservaContent />
    </Suspense>
  );
}
