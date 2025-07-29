'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface ActiveReservation {
  _id: string;
  guestName: string;
  guestEmail: string;
  roomNumber: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: 'active' | 'checkout-today' | 'extended';
  nights: number;
  totalPrice: number;
  specialRequests?: string;
}

export default function ReservasActivasPage() {
  const [activeReservations, setActiveReservations] = useState<ActiveReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'checkout-today' | 'extended'>('all');

  useEffect(() => {
    fetchActiveReservations();
  }, []);

  const fetchActiveReservations = async () => {
    try {
      setLoading(true);
      // Simular datos de reservas activas
      const mockData: ActiveReservation[] = [
        {
          _id: '1',
          guestName: 'María García López',
          guestEmail: 'maria.garcia@email.com',
          roomNumber: '101',
          roomType: 'Suite Premium',
          checkIn: '2024-07-25',
          checkOut: '2024-07-28',
          status: 'active',
          nights: 3,
          totalPrice: 360,
          specialRequests: 'Cama extra para niño',
        },
        {
          _id: '2',
          guestName: 'Carlos Rodríguez',
          guestEmail: 'carlos.rodriguez@email.com',
          roomNumber: '203',
          roomType: 'Habitación Deluxe',
          checkIn: '2024-07-26',
          checkOut: '2024-07-28',
          status: 'checkout-today',
          nights: 2,
          totalPrice: 160,
        },
        {
          _id: '3',
          guestName: 'Ana Martínez',
          guestEmail: 'ana.martinez@email.com',
          roomNumber: '305',
          roomType: 'Suite Premium',
          checkIn: '2024-07-20',
          checkOut: '2024-07-30',
          status: 'extended',
          nights: 10,
          totalPrice: 1200,
          specialRequests: 'Servicio de limpieza diario',
        },
      ];

      setActiveReservations(mockData);
    } catch (error) {
      // Error fetching active reservations - handled silently in production
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checkout-today':
        return 'bg-orange-500 text-white';
      case 'extended':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-green-500 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'checkout-today':
        return 'Check-out hoy';
      case 'extended':
        return 'Extendida';
      default:
        return 'Activa';
    }
  };

  const filteredReservations = activeReservations.filter((reservation) => {
    if (filter === 'all') return true;
    return reservation.status === filter;
  });

  const checkoutToday = activeReservations.filter((r) => r.status === 'checkout-today').length;
  const totalActive = activeReservations.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-gold text-xl">Cargando reservas activas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Reservas Activas</h1>
          <p className="text-gray-400">Huéspedes actualmente en el hotel</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-black/50 backdrop-blur-md rounded-xl p-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'all' ? 'bg-gold text-black' : 'text-white hover:bg-white/10'
              }`}
            >
              Todas ({totalActive})
            </button>
            <button
              onClick={() => setFilter('checkout-today')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'checkout-today'
                  ? 'bg-orange-500 text-white'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Check-out hoy ({checkoutToday})
            </button>
            <button
              onClick={() => setFilter('extended')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'extended' ? 'bg-blue-500 text-white' : 'text-white hover:bg-white/10'
              }`}
            >
              Extendidas
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black/50 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Activas</p>
              <p className="text-2xl font-bold text-white">{totalActive}</p>
            </div>
            <div className="text-3xl">🛏️</div>
          </div>
        </div>
        <div className="bg-black/50 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Check-out Hoy</p>
              <p className="text-2xl font-bold text-orange-400">{checkoutToday}</p>
            </div>
            <div className="text-3xl">⏰</div>
          </div>
        </div>
        <div className="bg-black/50 backdrop-blur-md rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Ocupación</p>
              <p className="text-2xl font-bold text-green-400">85%</p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>
      </div>

      {/* Reservations List */}
      <div className="bg-black/50 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Huéspedes Activos</h2>
        </div>
        <div className="divide-y divide-white/10">
          {filteredReservations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🛏️</div>
              <p className="text-gray-400 text-lg">No hay reservas activas</p>
            </div>
          ) : (
            filteredReservations.map((reservation) => (
              <div key={reservation._id} className="p-6 hover:bg-white/5 transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {reservation.guestName}
                        </h3>
                        <p className="text-gray-400">{reservation.guestEmail}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}
                      >
                        {getStatusText(reservation.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">Habitación</p>
                        <p className="text-white font-medium">
                          {reservation.roomNumber} - {reservation.roomType}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Check-in</p>
                        <p className="text-white font-medium">
                          {new Date(reservation.checkIn).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Check-out</p>
                        <p className="text-white font-medium">
                          {new Date(reservation.checkOut).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Noches</p>
                        <p className="text-white font-medium">{reservation.nights} noches</p>
                      </div>
                    </div>

                    {reservation.specialRequests && (
                      <div className="mt-3">
                        <p className="text-gray-400 text-sm">Solicitudes especiales</p>
                        <p className="text-white text-sm italic">
                          &quot;{reservation.specialRequests}&quot;
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button className="px-4 py-2 bg-gold hover:bg-yellow-500 text-black font-medium rounded-lg transition-all text-sm">
                      Ver detalles
                    </button>
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all text-sm">
                      Check-out
                    </button>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all text-sm">
                      Extender
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
