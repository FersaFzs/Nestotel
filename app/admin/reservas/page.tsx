'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Reservation {
  _id: string;
  guestInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  guests: number;
  createdAt: string;
  room: {
    name: string;
    type: string;
  };
  paymentMethod: string;
  paymentStatus: string;
}

export default function AdminReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchReservations();
  }, [filter, searchTerm, sortBy, sortOrder]);

  const fetchReservations = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter);
      if (searchTerm) params.append('search', searchTerm);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const response = await fetch(`/api/reservations?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (reservationId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Actualizar la lista local
        setReservations((prev) =>
          prev.map((reservation) =>
            reservation._id === reservationId
              ? { ...reservation, status: newStatus as any }
              : reservation,
          ),
        );
      }
    } catch (error) {
      console.error('Error updating reservation status:', error);
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

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'credit_card':
        return 'Tarjeta Crédito';
      case 'debit_card':
        return 'Tarjeta Débito';
      case 'cash':
        return 'Efectivo';
      case 'transfer':
        return 'Transferencia';
      default:
        return method;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gold text-xl">Cargando reservas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestión de Reservas</h1>
          <p className="text-gray-400 mt-2">Administra todas las reservas del hotel</p>
        </div>
        <Link
          href="/admin/reservas/nueva"
          className="px-6 py-3 bg-gold hover:bg-yellow-500 text-black font-bold rounded-xl transition-all"
        >
          Nueva Reserva
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="confirmed">Confirmadas</option>
              <option value="completed">Completadas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Ordenar por</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
            >
              <option value="createdAt">Fecha de creación</option>
              <option value="checkIn">Fecha de entrada</option>
              <option value="checkOut">Fecha de salida</option>
              <option value="totalPrice">Precio</option>
              <option value="guests">Huéspedes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Orden</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
            >
              <option value="desc">Descendente</option>
              <option value="asc">Ascendente</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Buscar</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nombre, teléfono, email..."
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
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
                  Pago
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {reservations.length > 0 ? (
                reservations.map((reservation) => (
                  <tr key={reservation._id} className="hover:bg-white/5">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">
                          {reservation.guestInfo.firstName} {reservation.guestInfo.lastName}
                        </div>
                        <div className="text-sm text-gray-400">{reservation.guestInfo.phone}</div>
                        <div className="text-xs text-gray-500">{reservation.guestInfo.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-white">{reservation.room.name}</div>
                        <div className="text-xs text-gray-400">{reservation.room.type}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        <div>Entrada: {formatDate(reservation.checkIn)}</div>
                        <div>Salida: {formatDate(reservation.checkOut)}</div>
                        <div className="text-xs text-gray-400">
                          {reservation.guests} {reservation.guests === 1 ? 'huésped' : 'huéspedes'}
                        </div>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {getPaymentMethodText(reservation.paymentMethod)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {reservation.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/reservas/${reservation._id}`}
                          className="text-gold hover:text-yellow-400"
                        >
                          Ver
                        </Link>
                        <select
                          value={reservation.status}
                          onChange={(e) => updateReservationStatus(reservation._id, e.target.value)}
                          className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs focus:border-gold outline-none"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="confirmed">Confirmada</option>
                          <option value="completed">Completada</option>
                          <option value="cancelled">Cancelada</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-400">
                    No se encontraron reservas con los filtros aplicados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      {reservations.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{reservations.length}</div>
              <div className="text-sm text-gray-400">Total reservas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gold">
                {formatPrice(reservations.reduce((sum, r) => sum + r.totalPrice, 0))}
              </div>
              <div className="text-sm text-gray-400">Valor total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {reservations.filter((r) => r.status === 'confirmed').length}
              </div>
              <div className="text-sm text-gray-400">Confirmadas</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {reservations.filter((r) => r.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-400">Pendientes</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
