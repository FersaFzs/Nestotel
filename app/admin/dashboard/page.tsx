'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalReservations: number;
  pendingReservations: number;
  confirmedReservations: number;
  completedReservations: number;
  totalRevenue: number;
  averageStay: number;
}

interface RecentReservation {
  _id: string;
  guestInfo: {
    firstName: string;
    lastName: string;
    phone: string;
  };
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  room: {
    name: string;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalReservations: 0,
    pendingReservations: 0,
    confirmedReservations: 0,
    completedReservations: 0,
    totalRevenue: 0,
    averageStay: 0,
  });
  const [recentReservations, setRecentReservations] = useState<RecentReservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Obtener estadísticas
      const statsResponse = await fetch('/api/admin/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Obtener reservas recientes
      const reservationsResponse = await fetch('/api/reservations?limit=5');
      if (reservationsResponse.ok) {
        const reservationsData = await reservationsResponse.json();
        setRecentReservations(reservationsData);
      }
    } catch (error) {
      // Error fetching dashboard data - handled silently in production
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
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'confirmed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmada';
      case 'completed':
        return 'Completada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gold text-xl">Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-2">Resumen general del hotel</p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/admin/reservas"
            className="px-6 py-3 bg-gold hover:bg-yellow-500 text-black font-bold rounded-xl transition-all"
          >
            Ver todas las reservas
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Reservas</p>
              <p className="text-2xl font-bold text-white">{stats.totalReservations}</p>
            </div>
            <div className="text-3xl">📅</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-400">{stats.pendingReservations}</p>
            </div>
            <div className="text-3xl">⏳</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Confirmadas</p>
              <p className="text-2xl font-bold text-green-400">{stats.confirmedReservations}</p>
            </div>
            <div className="text-3xl">✅</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ingresos</p>
              <p className="text-2xl font-bold text-gold">{formatPrice(stats.totalRevenue)}</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>
      </div>

      {/* Recent Reservations */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Reservas Recientes</h2>
            <Link
              href="/admin/reservas"
              className="text-gold hover:text-yellow-400 text-sm font-medium"
            >
              Ver todas →
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Huésped
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Habitación
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Fechas
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {recentReservations.length > 0 ? (
                recentReservations.map((reservation) => (
                  <tr key={reservation._id} className="hover:bg-white/5">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {reservation.guestInfo.firstName} {reservation.guestInfo.lastName}
                        </div>
                        <div className="text-sm text-gray-400">{reservation.guestInfo.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{reservation.room.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {formatDate(reservation.checkIn)} - {formatDate(reservation.checkOut)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gold">
                        {formatPrice(reservation.totalPrice)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                          reservation.status,
                        )}`}
                      >
                        {getStatusText(reservation.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        href={`/admin/reservas/${reservation._id}`}
                        className="text-gold hover:text-yellow-400"
                      >
                        Ver detalles
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No hay reservas recientes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/reservas/nueva"
          className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 hover:bg-white/20 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center group-hover:bg-yellow-500 transition-all">
              <span className="text-2xl">➕</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Nueva Reserva</h3>
              <p className="text-gray-400 text-sm">Crear reserva manualmente</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/habitaciones"
          className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 hover:bg-white/20 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center group-hover:bg-yellow-500 transition-all">
              <span className="text-2xl">🏨</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Gestionar Habitaciones</h3>
              <p className="text-gray-400 text-sm">Ver y editar habitaciones</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/facturas"
          className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 hover:bg-white/20 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center group-hover:bg-yellow-500 transition-all">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Facturas</h3>
              <p className="text-gray-400 text-sm">Gestionar facturación</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
