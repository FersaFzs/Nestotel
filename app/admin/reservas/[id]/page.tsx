'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Reservation {
  _id: string;
  userId: string;
  userEmail: string;
  guestInfo: {
    firstName: string;
    lastName: string;
    dni: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentMethod: string;
  paymentStatus: string;
  specialRequests?: string;
  estimatedArrivalTime?: string;
  flightNumber?: string;
  carRental: boolean;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  room: {
    name: string;
    type: string;
    price: number;
    description: string;
    amenities: string[];
    maxGuests: number;
    images: string[];
  };
}

export default function ReservationDetail() {
  const params = useParams();
  const router = useRouter();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    fetchReservation();
  }, [params.id]);

  const fetchReservation = async () => {
    try {
      const response = await fetch(`/api/reservations/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setReservation(data);
        setAdminNotes(data.adminNotes || '');
      } else {
        // Error fetching reservation - handled silently in production
      }
    } catch (error) {
      // Error fetching reservation - handled silently in production
    } finally {
      setLoading(false);
    }
  };

  const updateReservation = async (field: string, value: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/reservations/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value }),
      });

      if (response.ok) {
        const updatedReservation = await response.json();
        setReservation(updatedReservation);
      }
    } catch (error) {
      // Error updating reservation - handled silently in production
    } finally {
      setUpdating(false);
    }
  };

  const deleteReservation = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
      return;
    }

    try {
      const response = await fetch(`/api/reservations/${params.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/reservas');
      }
    } catch (error) {
      // Error deleting reservation - handled silently in production
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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES');
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
        return 'Tarjeta de Crédito';
      case 'debit_card':
        return 'Tarjeta de Débito';
      case 'cash':
        return 'Efectivo';
      case 'transfer':
        return 'Transferencia Bancaria';
      default:
        return method;
    }
  };

  const getArrivalTimeText = (time: string) => {
    switch (time) {
      case 'morning':
        return 'Mañana (8:00 - 12:00)';
      case 'afternoon':
        return 'Tarde (12:00 - 18:00)';
      case 'evening':
        return 'Noche (18:00 - 22:00)';
      case 'late':
        return 'Tarde noche (22:00+)';
      default:
        return time;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gold text-xl">Cargando reserva...</div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-xl mb-4">Reserva no encontrada</div>
        <Link href="/admin/reservas" className="text-gold hover:text-yellow-400">
          Volver a la lista
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4">
            <Link href="/admin/reservas" className="text-gold hover:text-yellow-400">
              ← Volver
            </Link>
            <h1 className="text-3xl font-bold text-white">Detalle de Reserva</h1>
          </div>
          <p className="text-gray-400 mt-2">Reserva #{reservation._id.slice(-8).toUpperCase()}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={deleteReservation}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all"
          >
            Eliminar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Guest Information */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Información del Huésped</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
                <p className="text-white">
                  {reservation.guestInfo.firstName} {reservation.guestInfo.lastName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">DNI/NIE</label>
                <p className="text-white">{reservation.guestInfo.dni}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Teléfono</label>
                <p className="text-white">{reservation.guestInfo.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <p className="text-white">{reservation.userEmail}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Dirección</label>
                <p className="text-white">
                  {reservation.guestInfo.address}, {reservation.guestInfo.city}{' '}
                  {reservation.guestInfo.postalCode}, {reservation.guestInfo.country}
                </p>
              </div>
            </div>
          </div>

          {/* Reservation Details */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Detalles de la Reserva</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Habitación</label>
                <p className="text-white">{reservation.room.name}</p>
                <p className="text-gray-400 text-sm">{reservation.room.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Huéspedes</label>
                <p className="text-white">{reservation.guests}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Entrada</label>
                <p className="text-white">{formatDate(reservation.checkIn)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Salida</label>
                <p className="text-white">{formatDate(reservation.checkOut)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Precio por noche
                </label>
                <p className="text-white">{formatPrice(reservation.room.price)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Total</label>
                <p className="text-gold font-bold">{formatPrice(reservation.totalPrice)}</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Información Adicional</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Método de pago
                </label>
                <p className="text-white">{getPaymentMethodText(reservation.paymentMethod)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Estado de pago
                </label>
                <p className="text-white capitalize">{reservation.paymentStatus}</p>
              </div>
              {reservation.estimatedArrivalTime && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Hora de llegada
                  </label>
                  <p className="text-white">
                    {getArrivalTimeText(reservation.estimatedArrivalTime)}
                  </p>
                </div>
              )}
              {reservation.flightNumber && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Número de vuelo
                  </label>
                  <p className="text-white">{reservation.flightNumber}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Alquiler de coche
                </label>
                <p className="text-white">{reservation.carRental ? 'Sí' : 'No'}</p>
              </div>
            </div>
            {reservation.specialRequests && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Solicitudes especiales
                </label>
                <p className="text-white">{reservation.specialRequests}</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status and Actions */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Estado y Acciones</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
                <select
                  value={reservation.status}
                  onChange={(e) => updateReservation('status', e.target.value)}
                  disabled={updating}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                >
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="completed">Completada</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Estado de pago
                </label>
                <select
                  value={reservation.paymentStatus}
                  onChange={(e) => updateReservation('paymentStatus', e.target.value)}
                  disabled={updating}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                >
                  <option value="pending">Pendiente</option>
                  <option value="paid">Pagado</option>
                  <option value="failed">Fallido</option>
                </select>
              </div>

              <div>
                <span
                  className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
                    reservation.status,
                  )}`}
                >
                  {getStatusText(reservation.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Notas Administrativas</h3>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              onBlur={() => updateReservation('adminNotes', adminNotes)}
              placeholder="Añadir notas administrativas..."
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all resize-none"
            />
          </div>

          {/* Reservation Info */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Información de la Reserva</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-400">Creada:</span>
                <p className="text-white">{formatDateTime(reservation.createdAt)}</p>
              </div>
              <div>
                <span className="text-gray-400">Actualizada:</span>
                <p className="text-white">{formatDateTime(reservation.updatedAt)}</p>
              </div>
              <div>
                <span className="text-gray-400">ID de usuario:</span>
                <p className="text-white font-mono text-xs">{reservation.userId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
