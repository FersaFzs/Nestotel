'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../lib/contexts/AuthContext';
import { useAdminGuard } from '../../lib/hooks/useAdminGuard';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Proteger rutas de admin con verificación de roles
  const {
    user: adminUser,
    loading,
    hasAccess,
  } = useAdminGuard({
    requiredRole: 'admin',
    redirectTo: '/login',
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-gold text-xl">Verificando permisos...</div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Acceso denegado</div>
          <p className="text-gray-400 mb-4">
            No tienes permisos para acceder al panel de administración
          </p>
          <Link href="/" className="text-gold hover:text-yellow-400">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: '📊', description: 'Vista general' },
    {
      name: 'Reservas Activas',
      href: '/admin/reservas-activas',
      icon: '🛏️',
      description: 'Huéspedes actuales',
    },
    {
      name: 'Todas las Reservas',
      href: '/admin/reservas',
      icon: '📅',
      description: 'Gestión completa',
    },
    {
      name: 'Habitaciones',
      href: '/admin/habitaciones',
      icon: '🏨',
      description: 'Estado en tiempo real',
    },
    { name: 'Usuarios', href: '/admin/usuarios', icon: '👥', description: 'Gestión de usuarios' },
    { name: 'Facturas', href: '/admin/facturas', icon: '💰', description: 'Gestión financiera' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-80 lg:bg-black/95 lg:backdrop-blur-md lg:border-r lg:border-white/10">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <h1 className="text-xl font-bold text-gold">Panel Admin</h1>
          </div>

          <nav className="flex-1 p-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-start gap-3 px-4 py-3 rounded-xl transition-all ${
                  pathname === item.href
                    ? 'bg-gold text-black font-bold'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <span className="text-xl mt-1">{item.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div
                    className={`text-xs ${pathname === item.href ? 'text-black/70' : 'text-gray-400'}`}
                  >
                    {item.description}
                  </div>
                </div>
              </Link>
            ))}
          </nav>

          <div className="p-6 border-t border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">
                  {adminUser?.firstName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">
                  {adminUser?.firstName
                    ? `${adminUser.firstName} ${adminUser.lastName || ''}`
                    : user?.email}
                </p>
                <p className="text-gray-400 text-xs capitalize">{adminUser?.role || 'Usuario'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all text-sm"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/80" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-80 bg-black/95 backdrop-blur-md border-r border-white/10">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h1 className="text-xl font-bold text-gold">Panel Admin</h1>
            <button onClick={() => setSidebarOpen(false)} className="text-white hover:text-gold">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav className="p-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-start gap-3 px-4 py-3 rounded-xl transition-all ${
                  pathname === item.href
                    ? 'bg-gold text-black font-bold'
                    : 'text-white hover:bg-white/10'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="text-xl mt-1">{item.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div
                    className={`text-xs ${pathname === item.href ? 'text-black/70' : 'text-gray-400'}`}
                  >
                    {item.description}
                  </div>
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-black/80 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center justify-between p-4">
            <button onClick={() => setSidebarOpen(true)} className="text-white hover:text-gold">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-lg font-bold text-gold">Panel Admin</h1>
            <div className="w-6" />
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
