'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function PerfilPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      // Error logging out - handled silently in production
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center'>
        <div className='text-gold text-xl'>Cargando perfil...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect will happen in useEffect
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
          <div className='w-full max-w-2xl'>
            {/* Profile Header */}
            <div className='text-center mb-8'>
              <h1 className='text-4xl font-serif font-bold text-white mb-2'>Mi Perfil</h1>
              <div className='w-24 h-1 bg-gold mx-auto' />
            </div>

            {/* Profile Card */}
            <div className='bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 shadow-2xl'>
              {/* Avatar Section */}
              <div className='text-center mb-8'>
                <div className='w-24 h-24 bg-gold rounded-full flex items-center justify-center text-black font-bold text-3xl mx-auto mb-4'>
                  {user.displayName && user.displayName.length > 0
                    ? user.displayName[0]?.toUpperCase() ?? 'U'
                    : user.email?.[0]?.toUpperCase() ?? 'U'}
                </div>
                <h2 className='text-2xl font-bold text-white mb-1'>
                  {user.displayName || 'Usuario'}
                </h2>
                <p className='text-gray-400'>{user.email}</p>
              </div>

              {/* User Info */}
              <div className='space-y-6 mb-8'>
                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-2'>
                    Nombre completo
                  </label>
                  <div className='bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white'>
                    {user.displayName || 'No especificado'}
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-2'>Email</label>
                  <div className='bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white'>
                    {user.email}
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-2'>Verificado</label>
                  <div className='bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white'>
                    {user.emailVerified ? (
                      <span className='text-green-400'>✓ Email verificado</span>
                    ) : (
                      <span className='text-yellow-400'>⚠ Email no verificado</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-300 mb-2'>
                    Miembro desde
                  </label>
                  <div className='bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white'>
                    {user.metadata.creationTime
                      ? new Date(user.metadata.creationTime).toLocaleDateString('es-ES')
                      : 'No disponible'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-4'>
                <Link
                  href='/reservas'
                  className='flex-1 bg-gold hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-xl transition-all duration-300 text-center'
                >
                  Ver mis reservas
                </Link>

                <Link
                  href='/reserva'
                  className='flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-xl border border-white/20 transition-all duration-300 text-center'
                >
                  Nueva reserva
                </Link>

                <button
                  onClick={handleLogout}
                  className='flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium py-3 px-6 rounded-xl border border-red-500/30 transition-all duration-300'
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
