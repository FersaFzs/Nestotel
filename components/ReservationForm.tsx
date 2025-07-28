'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { User } from 'firebase/auth';

interface Room {
  _id: string;
  name: string;
  type: string;
  price: number;
  description: string;
  amenities: string[];
  maxGuests: number;
  images: string[];
}

interface ReservationFormProps {
  user: User;
}

interface GuestInfo {
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

interface FormData {
  checkIn: string;
  checkOut: string;
  guests: number;
  roomId: string;
  specialRequests: string;
  guestInfo: GuestInfo;
  paymentMethod: 'credit_card' | 'debit_card' | 'cash' | 'transfer';
  estimatedArrivalTime: string;
  flightNumber: string;
  carRental: boolean;
}

export default function ReservationForm({ user }: ReservationFormProps) {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1); // 1: Dates, 2: Rooms, 3: Guest Info, 4: Payment & Confirmation
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [formData, setFormData] = useState<FormData>({
    checkIn: '',
    checkOut: '',
    guests: 1,
    roomId: '',
    specialRequests: '',
    guestInfo: {
      firstName: '',
      lastName: '',
      dni: '',
      phone: '',
      address: '',
      city: '',
      country: 'España',
      postalCode: '',
    },
    paymentMethod: 'credit_card',
    estimatedArrivalTime: '',
    flightNumber: '',
    carRental: false,
  });
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [error, setError] = useState('');

  // Prellenar formulario con parámetros de URL
  useEffect(() => {
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const guests = searchParams.get('guests');
    const roomId = searchParams.get('roomId');

    if (checkIn || checkOut || guests || roomId) {
      setFormData((prev) => ({
        ...prev,
        checkIn: checkIn || prev.checkIn,
        checkOut: checkOut || prev.checkOut,
        guests: guests ? parseInt(guests) : prev.guests,
        roomId: roomId || prev.roomId,
      }));

      // Si todos los campos están llenos, ir directamente al paso 2
      if (checkIn && checkOut && guests && roomId) {
        setStep(2);
      }
    }
  }, [searchParams]);

  // Cargar habitaciones disponibles
  useEffect(() => {
    fetchRooms();
  }, []);

  // Actualizar selectedRoom cuando rooms y roomId estén disponibles
  useEffect(() => {
    if (rooms.length > 0 && formData.roomId) {
      const room = rooms.find((r) => r._id === formData.roomId);
      setSelectedRoom(room || null);
    }
  }, [rooms, formData.roomId]);

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms');
      if (response.ok) {
        const roomsData = await response.json();
        setRooms(roomsData);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setError('Error al cargar las habitaciones');
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleGuestInfoChange = (field: keyof GuestInfo, value: string) => {
    setFormData((prev) => ({
      ...prev,
      guestInfo: { ...prev.guestInfo, [field]: value },
    }));
    setError('');
  };

  const validateDates = () => {
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      setError('La fecha de entrada no puede ser anterior a hoy');
      return false;
    }

    if (checkOutDate <= checkInDate) {
      setError('La fecha de salida debe ser posterior a la fecha de entrada');
      return false;
    }

    return true;
  };

  const validateGuestInfo = () => {
    const { guestInfo } = formData;

    if (!guestInfo.firstName.trim()) {
      setError('El nombre es obligatorio');
      return false;
    }

    if (!guestInfo.lastName.trim()) {
      setError('El apellido es obligatorio');
      return false;
    }

    if (!guestInfo.dni.trim()) {
      setError('El DNI es obligatorio');
      return false;
    }

    if (!guestInfo.phone.trim()) {
      setError('El teléfono es obligatorio');
      return false;
    }

    if (!guestInfo.address.trim()) {
      setError('La dirección es obligatoria');
      return false;
    }

    if (!guestInfo.city.trim()) {
      setError('La ciudad es obligatoria');
      return false;
    }

    if (!guestInfo.postalCode.trim()) {
      setError('El código postal es obligatorio');
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.checkIn || !formData.checkOut) {
        setError('Por favor, selecciona las fechas de entrada y salida');
        return;
      }
      if (!validateDates()) return;
    }

    if (step === 2) {
      if (!formData.roomId) {
        setError('Por favor, selecciona una habitación');
        return;
      }
    }

    if (step === 3) {
      if (!validateGuestInfo()) return;
    }

    setStep(step + 1);
    setError('');
  };

  const prevStep = () => {
    setStep(step - 1);
    setError('');
  };

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    const diffTime = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    if (!selectedRoom) return 0;
    return selectedRoom.price * calculateNights();
  };

  const submitReservation = async () => {
    setLoading(true);
    setError('');

    try {
      const reservationData = {
        userId: user.uid,
        userEmail: user.email,
        roomId: formData.roomId,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: formData.guests,
        totalPrice: calculateTotal(),
        guestInfo: formData.guestInfo,
        specialRequests: formData.specialRequests,
        paymentMethod: formData.paymentMethod,
        estimatedArrivalTime: formData.estimatedArrivalTime,
        flightNumber: formData.flightNumber,
        carRental: formData.carRental,
      };

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      });

      if (response.ok) {
        // Redirigir a página de confirmación o perfil
        window.location.href = '/reservas';
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al crear la reserva');
      }
    } catch (error) {
      setError('Error de conexión. Por favor, intenta de nuevo.');
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

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMinCheckOutDate = () => {
    if (!formData.checkIn) return getTomorrowDate();
    const checkIn = new Date(formData.checkIn);
    checkIn.setDate(checkIn.getDate() + 1);
    return checkIn.toISOString().split('T')[0];
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-black/20 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= num ? 'bg-gold text-black' : 'bg-white/20 text-gray-400'
                  }`}
                >
                  {num}
                </div>
                {num < 4 && (
                  <div className={`w-12 h-1 mx-2 ${step > num ? 'bg-gold' : 'bg-white/20'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-white text-sm">Paso {step} de 4</div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>Fechas</span>
          <span>Habitación</span>
          <span>Datos</span>
          <span>Confirmación</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border-l-4 border-red-500 px-6 py-4 mx-8 mt-6">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      <div className="p-8">
        {/* Step 1: Dates and Guests */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Selecciona las fechas</h3>
              <p className="text-gray-400">¿Cuándo te gustaría hospedarte con nosotros?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fecha de entrada
                </label>
                <input
                  type="date"
                  value={formData.checkIn}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => handleInputChange('checkIn', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fecha de salida
                </label>
                <input
                  type="date"
                  value={formData.checkOut}
                  min={getMinCheckOutDate()}
                  onChange={(e) => handleInputChange('checkOut', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Huéspedes</label>
                <select
                  value={formData.guests}
                  onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                >
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num} className="bg-black">
                      {num} {num === 1 ? 'Huésped' : 'Huéspedes'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {formData.checkIn && formData.checkOut && (
              <div className="bg-white/5 rounded-xl p-6">
                <h4 className="text-lg font-bold text-white mb-4">Resumen de fechas</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Entrada:</span>
                    <span className="text-white ml-2">
                      {new Date(formData.checkIn).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Salida:</span>
                    <span className="text-white ml-2">
                      {new Date(formData.checkOut).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Noches:</span>
                    <span className="text-white ml-2">{calculateNights()}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Huéspedes:</span>
                    <span className="text-white ml-2">{formData.guests}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Room Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Selecciona tu habitación</h3>
              <p className="text-gray-400">Elige la habitación perfecta para tu estancia</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  onClick={() => {
                    handleInputChange('roomId', room._id);
                    setSelectedRoom(room);
                  }}
                  className={`relative cursor-pointer rounded-xl border-2 transition-all ${
                    formData.roomId === room._id
                      ? 'border-gold bg-gold/10'
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-white">{room.name}</h4>
                        <p className="text-gray-400 text-sm">{room.type}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gold">
                          {formatPrice(room.price)}
                        </div>
                        <div className="text-xs text-gray-400">por noche</div>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4">{room.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Máximo {room.maxGuests} huéspedes
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.slice(0, 3).map((amenity, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300"
                          >
                            {amenity}
                          </span>
                        ))}
                        {room.amenities.length > 3 && (
                          <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-gray-300">
                            +{room.amenities.length - 3} más
                          </span>
                        )}
                      </div>
                    </div>

                    {formData.roomId === room._id && (
                      <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-black"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {selectedRoom && (
              <div className="bg-white/5 rounded-xl p-6">
                <h4 className="text-lg font-bold text-white mb-4">Resumen de la reserva</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fechas:</span>
                    <span className="text-white">
                      {new Date(formData.checkIn).toLocaleDateString('es-ES')} -{' '}
                      {new Date(formData.checkOut).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Noches:</span>
                    <span className="text-white">{calculateNights()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Huéspedes:</span>
                    <span className="text-white">{formData.guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Habitación:</span>
                    <span className="text-white">{selectedRoom.name}</span>
                  </div>
                  <div className="border-t border-white/20 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-white">Total:</span>
                      <span className="text-gold">{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Guest Information */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Información personal</h3>
              <p className="text-gray-400">Necesitamos algunos datos para completar tu reserva</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nombre *</label>
                <input
                  type="text"
                  value={formData.guestInfo.firstName}
                  onChange={(e) => handleGuestInfoChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Apellidos *</label>
                <input
                  type="text"
                  value={formData.guestInfo.lastName}
                  onChange={(e) => handleGuestInfoChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                  placeholder="Tus apellidos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">DNI/NIE *</label>
                <input
                  type="text"
                  value={formData.guestInfo.dni}
                  onChange={(e) => handleGuestInfoChange('dni', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                  placeholder="12345678A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Teléfono *</label>
                <input
                  type="tel"
                  value={formData.guestInfo.phone}
                  onChange={(e) => handleGuestInfoChange('phone', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                  placeholder="+34 600 000 000"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Dirección completa *
                </label>
                <input
                  type="text"
                  value={formData.guestInfo.address}
                  onChange={(e) => handleGuestInfoChange('address', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                  placeholder="Calle, número, piso..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ciudad *</label>
                <input
                  type="text"
                  value={formData.guestInfo.city}
                  onChange={(e) => handleGuestInfoChange('city', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                  placeholder="Tu ciudad"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Código Postal *
                </label>
                <input
                  type="text"
                  value={formData.guestInfo.postalCode}
                  onChange={(e) => handleGuestInfoChange('postalCode', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                  placeholder="28001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">País</label>
                <input
                  type="text"
                  value={formData.guestInfo.country}
                  onChange={(e) => handleGuestInfoChange('country', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                  placeholder="España"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white">Información adicional</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hora estimada de llegada
                  </label>
                  <select
                    value={formData.estimatedArrivalTime}
                    onChange={(e) => handleInputChange('estimatedArrivalTime', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                  >
                    <option value="" className="bg-black">
                      Seleccionar hora
                    </option>
                    <option value="morning" className="bg-black">
                      Mañana (8:00 - 12:00)
                    </option>
                    <option value="afternoon" className="bg-black">
                      Tarde (12:00 - 18:00)
                    </option>
                    <option value="evening" className="bg-black">
                      Noche (18:00 - 22:00)
                    </option>
                    <option value="late" className="bg-black">
                      Tarde noche (22:00+)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Número de vuelo (si aplica)
                  </label>
                  <input
                    type="text"
                    value={formData.flightNumber}
                    onChange={(e) => handleInputChange('flightNumber', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                    placeholder="IB1234"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="carRental"
                  checked={formData.carRental}
                  onChange={(e) => handleInputChange('carRental', e.target.checked)}
                  className="w-5 h-5 text-gold bg-white/10 border-white/20 rounded focus:ring-gold/20 focus:ring-2"
                />
                <label htmlFor="carRental" className="text-gray-300">
                  Necesito alquiler de coche
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Payment and Confirmation */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Método de pago</h3>
              <p className="text-gray-400">Selecciona cómo quieres pagar tu reserva</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Método de pago *
                </label>
                <div className="space-y-3">
                  {[
                    { value: 'credit_card', label: 'Tarjeta de crédito', icon: '💳' },
                    { value: 'debit_card', label: 'Tarjeta de débito', icon: '💳' },
                    { value: 'cash', label: 'Efectivo', icon: '💵' },
                    { value: 'transfer', label: 'Transferencia bancaria', icon: '🏦' },
                  ].map((method) => (
                    <div
                      key={method.value}
                      onClick={() => handleInputChange('paymentMethod', method.value)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.paymentMethod === method.value
                          ? 'border-gold bg-gold/10'
                          : 'border-white/20 bg-white/5 hover:border-white/40'
                      }`}
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <span className="text-white font-medium">{method.label}</span>
                      {formData.paymentMethod === method.value && (
                        <div className="ml-auto">
                          <div className="w-5 h-5 bg-gold rounded-full flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-black"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Solicitudes especiales (opcional)
                </label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                  placeholder="Ej: Cama extra, vista específica, ocasión especial, necesidades especiales..."
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all resize-none"
                />
              </div>
            </div>

            {/* Final Summary */}
            <div className="bg-white/5 rounded-xl p-6">
              <h4 className="text-lg font-bold text-white mb-4">Resumen final de la reserva</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fechas:</span>
                    <span className="text-white">
                      {new Date(formData.checkIn).toLocaleDateString('es-ES')} -{' '}
                      {new Date(formData.checkOut).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Noches:</span>
                    <span className="text-white">{calculateNights()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Huéspedes:</span>
                    <span className="text-white">{formData.guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Habitación:</span>
                    <span className="text-white">{selectedRoom?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Huésped principal:</span>
                    <span className="text-white">
                      {formData.guestInfo.firstName} {formData.guestInfo.lastName}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Precio por noche:</span>
                    <span className="text-white">{formatPrice(selectedRoom?.price || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total ({calculateNights()} noches):</span>
                    <span className="text-white">{formatPrice(calculateTotal())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Método de pago:</span>
                    <span className="text-white capitalize">
                      {formData.paymentMethod.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="border-t border-white/20 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-white">Total a pagar:</span>
                      <span className="text-gold">{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
              <p className="text-gold text-sm text-center">
                <strong>Política de cancelación:</strong> Cancelación gratuita hasta 24h antes de la
                llegada. Los datos personales se tratarán conforme a la normativa vigente.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="px-6 py-3 bg-white/10 text-white rounded-xl border border-white/20 hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          {step < 4 ? (
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-gold hover:bg-yellow-500 text-black font-bold rounded-xl transition-all"
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={submitReservation}
              disabled={loading}
              className="px-8 py-3 bg-gold hover:bg-yellow-500 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Reservando...' : 'Confirmar Reserva'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
