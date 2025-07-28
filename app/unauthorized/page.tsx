'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/contexts/AuthContext';

export default function UnauthorizedPage() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8">
          <h1 className="text-3xl font-bold text-white mb-4">Acceso Denegado</h1>
          <p className="text-gray-400 mb-6">
            No tienes permisos para acceder al panel de administración. 
            Solo los administradores autorizados pueden acceder a esta sección.
          </p>

          {user && (
            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-400 mb-2">Usuario actual:</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>
          )}

          <div className="space-y-4">
            <Link
              href="/"
              className="block w-full px-6 py-3 bg-gold hover:bg-yellow-500 text-black font-bold rounded-xl transition-all"
            >
              Volver al inicio
            </Link>

            {user && (
              <button
                onClick={handleLogout}
                className="block w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
              >
                Cerrar sesión
              </button>
            )}

            {!user && (
              <Link
                href="/login"
                className="block w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
              >
                Iniciar sesión
              </Link>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-xs text-gray-500">
              Si crees que esto es un error, contacta con el administrador del sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 