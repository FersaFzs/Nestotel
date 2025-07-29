'use client';

import React, { useState, useEffect } from 'react';

interface Room {
  _id: string;
  number: string;
  type: string;
  floor: number;
  status: 'available' | 'occupied' | 'cleaning' | 'maintenance';
  currentGuest?: string;
  checkOutDate?: string;
  price: number;
  capacity: number;
}

export default function HabitacionesPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [filter, setFilter] = useState<
    'all' | 'available' | 'occupied' | 'cleaning' | 'maintenance'
  >('all');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      // Simular datos de habitaciones
      const mockRooms: Room[] = [
        // Planta 1
        {
          _id: '1',
          number: '101',
          type: 'Suite Premium',
          floor: 1,
          status: 'occupied',
          currentGuest: 'María García',
          checkOutDate: '2024-07-28',
          price: 120,
          capacity: 4,
        },
        {
          _id: '2',
          number: '102',
          type: 'Habitación Deluxe',
          floor: 1,
          status: 'available',
          price: 80,
          capacity: 2,
        },
        {
          _id: '3',
          number: '103',
          type: 'Habitación Deluxe',
          floor: 1,
          status: 'cleaning',
          price: 80,
          capacity: 2,
        },
        {
          _id: '4',
          number: '104',
          type: 'Suite Premium',
          floor: 1,
          status: 'occupied',
          currentGuest: 'Carlos Rodríguez',
          checkOutDate: '2024-07-28',
          price: 120,
          capacity: 4,
        },
        {
          _id: '5',
          number: '105',
          type: 'Habitación Standard',
          floor: 1,
          status: 'available',
          price: 60,
          capacity: 2,
        },
        {
          _id: '6',
          number: '106',
          type: 'Habitación Standard',
          floor: 1,
          status: 'maintenance',
          price: 60,
          capacity: 2,
        },
        {
          _id: '7',
          number: '107',
          type: 'Habitación Deluxe',
          floor: 1,
          status: 'available',
          price: 80,
          capacity: 2,
        },
        {
          _id: '8',
          number: '108',
          type: 'Suite Premium',
          floor: 1,
          status: 'occupied',
          currentGuest: 'Ana Martínez',
          checkOutDate: '2024-07-30',
          price: 120,
          capacity: 4,
        },

        // Planta 2
        {
          _id: '9',
          number: '201',
          type: 'Suite Premium',
          floor: 2,
          status: 'available',
          price: 120,
          capacity: 4,
        },
        {
          _id: '10',
          number: '202',
          type: 'Habitación Deluxe',
          floor: 2,
          status: 'occupied',
          currentGuest: 'Luis Pérez',
          checkOutDate: '2024-07-29',
          price: 80,
          capacity: 2,
        },
        {
          _id: '11',
          number: '203',
          type: 'Habitación Deluxe',
          floor: 2,
          status: 'cleaning',
          price: 80,
          capacity: 2,
        },
        {
          _id: '12',
          number: '204',
          type: 'Suite Premium',
          floor: 2,
          status: 'available',
          price: 120,
          capacity: 4,
        },
        {
          _id: '13',
          number: '205',
          type: 'Habitación Standard',
          floor: 2,
          status: 'available',
          price: 60,
          capacity: 2,
        },
        {
          _id: '14',
          number: '206',
          type: 'Habitación Standard',
          floor: 2,
          status: 'occupied',
          currentGuest: 'Sofia López',
          checkOutDate: '2024-07-27',
          price: 60,
          capacity: 2,
        },
        {
          _id: '15',
          number: '207',
          type: 'Habitación Deluxe',
          floor: 2,
          status: 'available',
          price: 80,
          capacity: 2,
        },
        {
          _id: '16',
          number: '208',
          type: 'Suite Premium',
          floor: 2,
          status: 'maintenance',
          price: 120,
          capacity: 4,
        },
      ];

      setRooms(mockRooms);
    } catch (error) {
      // Error fetching rooms - handled silently in production
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied':
        return 'bg-red-500';
      case 'cleaning':
        return 'bg-orange-500';
      case 'maintenance':
        return 'bg-gray-500';
      default:
        return 'bg-green-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'occupied':
        return 'Ocupada';
      case 'cleaning':
        return 'Limpieza';
      case 'maintenance':
        return 'Mantenimiento';
      default:
        return 'Disponible';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'occupied':
        return '🛏️';
      case 'cleaning':
        return '🧹';
      case 'maintenance':
        return '🔧';
      default:
        return '✅';
    }
  };

  const filteredRooms = rooms.filter(room => {
    const floorMatch = selectedFloor === 'all' || room.floor === selectedFloor;
    const statusMatch = filter === 'all' || room.status === filter;
    return floorMatch && statusMatch;
  });

  const floors = [...new Set(rooms.map(room => room.floor))].sort();
  const stats = {
    total: rooms.length,
    available: rooms.filter(r => r.status === 'available').length,
    occupied: rooms.filter(r => r.status === 'occupied').length,
    cleaning: rooms.filter(r => r.status === 'cleaning').length,
    maintenance: rooms.filter(r => r.status === 'maintenance').length,
  };

  const occupancyRate = Math.round((stats.occupied / stats.total) * 100);

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center'>
        <div className='text-gold text-xl'>Cargando habitaciones...</div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-white mb-2'>Gestión de Habitaciones</h1>
          <p className='text-gray-400'>Estado en tiempo real de todas las habitaciones</p>
        </div>
        <div className='flex items-center gap-4'>
          {/* Floor Filter */}
          <div className='flex bg-black/50 backdrop-blur-md rounded-xl p-2'>
            <button
              onClick={() => setSelectedFloor('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedFloor === 'all' ? 'bg-gold text-black' : 'text-white hover:bg-white/10'
              }`}
            >
              Todas las plantas
            </button>
            {floors.map(floor => (
              <button
                key={floor}
                onClick={() => setSelectedFloor(floor)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedFloor === floor ? 'bg-gold text-black' : 'text-white hover:bg-white/10'
                }`}
              >
                Planta {floor}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className='flex bg-black/50 backdrop-blur-md rounded-xl p-2'>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'all' ? 'bg-gold text-black' : 'text-white hover:bg-white/10'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('available')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'available' ? 'bg-green-500 text-white' : 'text-white hover:bg-white/10'
              }`}
            >
              Disponibles
            </button>
            <button
              onClick={() => setFilter('occupied')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'occupied' ? 'bg-red-500 text-white' : 'text-white hover:bg-white/10'
              }`}
            >
              Ocupadas
            </button>
            <button
              onClick={() => setFilter('cleaning')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === 'cleaning' ? 'bg-orange-500 text-white' : 'text-white hover:bg-white/10'
              }`}
            >
              Limpieza
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
        <div className='bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/10'>
          <div className='text-center'>
            <p className='text-gray-400 text-sm'>Total</p>
            <p className='text-2xl font-bold text-white'>{stats.total}</p>
          </div>
        </div>
        <div className='bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/10'>
          <div className='text-center'>
            <p className='text-gray-400 text-sm'>Disponibles</p>
            <p className='text-2xl font-bold text-green-400'>{stats.available}</p>
          </div>
        </div>
        <div className='bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/10'>
          <div className='text-center'>
            <p className='text-gray-400 text-sm'>Ocupadas</p>
            <p className='text-2xl font-bold text-red-400'>{stats.occupied}</p>
          </div>
        </div>
        <div className='bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/10'>
          <div className='text-center'>
            <p className='text-gray-400 text-sm'>Limpieza</p>
            <p className='text-2xl font-bold text-orange-400'>{stats.cleaning}</p>
          </div>
        </div>
        <div className='bg-black/50 backdrop-blur-md rounded-xl p-4 border border-white/10'>
          <div className='text-center'>
            <p className='text-gray-400 text-sm'>Ocupación</p>
            <p className='text-2xl font-bold text-blue-400'>{occupancyRate}%</p>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className='bg-black/50 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden'>
        <div className='p-6 border-b border-white/10'>
          <h2 className='text-xl font-bold text-white'>
            Habitaciones {selectedFloor !== 'all' ? `- Planta ${selectedFloor}` : ''}
          </h2>
          <p className='text-gray-400 text-sm mt-1'>
            {filteredRooms.length} habitaciones mostradas
          </p>
        </div>

        {filteredRooms.length === 0 ? (
          <div className='p-8 text-center'>
            <div className='text-6xl mb-4'>🏨</div>
            <p className='text-gray-400 text-lg'>
              No hay habitaciones que coincidan con los filtros
            </p>
          </div>
        ) : (
          <div className='p-6'>
            <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4'>
              {filteredRooms.map(room => (
                <div
                  key={room._id}
                  className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer hover:scale-105 ${
                    room.status === 'occupied'
                      ? 'border-red-500 bg-red-500/10'
                      : room.status === 'cleaning'
                        ? 'border-orange-500 bg-orange-500/10'
                        : room.status === 'maintenance'
                          ? 'border-gray-500 bg-gray-500/10'
                          : 'border-green-500 bg-green-500/10'
                  }`}
                >
                  {/* Status Badge */}
                  <div
                    className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${getStatusColor(room.status)} flex items-center justify-center text-xs`}
                  >
                    {getStatusIcon(room.status)}
                  </div>

                  {/* Room Info */}
                  <div className='text-center'>
                    <h3 className='text-lg font-bold text-white mb-1'>{room.number}</h3>
                    <p className='text-xs text-gray-400 mb-2'>{room.type}</p>

                    <div className='space-y-1 text-xs'>
                      <p className='text-gray-300'>€{room.price}/noche</p>
                      <p className='text-gray-300'>{room.capacity} personas</p>
                    </div>

                    {room.currentGuest && (
                      <div className='mt-2 p-2 bg-black/30 rounded text-xs'>
                        <p className='text-white font-medium truncate'>{room.currentGuest}</p>
                        {room.checkOutDate && (
                          <p className='text-gray-400'>
                            Salida: {new Date(room.checkOutDate).toLocaleDateString('es-ES')}
                          </p>
                        )}
                      </div>
                    )}

                    <div
                      className={`mt-2 px-2 py-1 rounded text-xs font-medium ${getStatusColor(room.status)} text-white`}
                    >
                      {getStatusText(room.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
