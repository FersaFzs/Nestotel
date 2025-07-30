'use client';

import React from 'react';

interface OrientationMessageProps {
  isVisible: boolean;
}

export default function OrientationMessage({ isVisible }: OrientationMessageProps) {
  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6'>
      <div className='bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 max-w-md text-center'>
        {/* Icono de rotación */}
        <div className='mb-6 flex justify-center'>
          <div className='relative'>
            <svg
              className='w-16 h-16 text-gold animate-pulse'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
              />
            </svg>
            {/* Flecha de rotación */}
            <svg
              className='absolute -top-2 -right-2 w-8 h-8 text-gold animate-spin'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4'
              />
            </svg>
          </div>
        </div>

        {/* Título */}
        <h2 className='text-2xl font-bold text-white mb-4'>
          Panel de Administración
        </h2>

        {/* Mensaje */}
        <p className='text-gray-300 mb-6 leading-relaxed'>
          Para una mejor experiencia en el panel de administración, por favor gira tu dispositivo a modo horizontal.
        </p>

        {/* Instrucciones */}
        <div className='bg-gold/20 border border-gold/30 rounded-xl p-4 mb-6'>
          <h3 className='text-gold font-semibold mb-2'>Instrucciones:</h3>
          <ul className='text-sm text-gray-300 space-y-1 text-left'>
            <li>• Gira tu dispositivo 90° hacia la derecha</li>
            <li>• O activa la rotación automática</li>
            <li>• El panel se adaptará automáticamente</li>
          </ul>
        </div>

        {/* Nota */}
        <p className='text-xs text-gray-400'>
          El panel de administración está optimizado para orientación horizontal en dispositivos móviles.
        </p>
      </div>
    </div>
  );
} 