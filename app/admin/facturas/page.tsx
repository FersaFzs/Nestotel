'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAdminGuard } from '../../../lib/hooks/useAdminGuard';

interface Invoice {
  _id: string;
  number: string;
  date: string;
  clientName: string;
  clientNIF: string;
  clientAddress?: string;
  reservation: {
    _id: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    vat: number;
  }>;
  total: number;
  vatTotal: number;
  grandTotal: number;
  pdfUrl?: string;
  qrUrl?: string;
  xmlUrl?: string;
  aeatStatus: 'pending' | 'sent' | 'error';
  aeatResponse?: string;
  createdAt: string;
  updatedAt: string;
}

interface InvoiceStats {
  total: number;
  pending: number;
  sent: number;
  error: number;
  totalAmount: number;
  monthlyAmount: number;
}

interface EInvoiceProvider {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  apiKey?: string;
  lastSync?: string;
}

export default function FacturasPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<InvoiceStats>({
    total: 0,
    pending: 0,
    sent: 0,
    error: 0,
    totalAmount: 0,
    monthlyAmount: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'sent' | 'error'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [eInvoiceProviders] = useState<EInvoiceProvider[]>([
    { id: 'verifacti', name: 'Verifacti', status: 'active' },
    { id: 'facturae', name: 'Facturae', status: 'active' },
    { id: 'aeat', name: 'AEAT', status: 'active' },
  ]);

  // Proteger rutas de admin
  const { loading: guardLoading, hasAccess } = useAdminGuard({
    requiredRole: 'admin',
    redirectTo: '/login',
  });

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/facturas');
      if (response.ok) {
        const data = await response.json();
        setInvoices(data.invoices || []);
        calculateStats(data.invoices || []);
      } else {
        // Error fetching invoices - handled silently in production
      }
    } catch (error) {
      // Error fetching invoices - handled silently in production
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateStats = (invoiceList: Invoice[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const stats = {
      total: invoiceList.length,
      pending: invoiceList.filter(i => i.aeatStatus === 'pending').length,
      sent: invoiceList.filter(i => i.aeatStatus === 'sent').length,
      error: invoiceList.filter(i => i.aeatStatus === 'error').length,
      totalAmount: invoiceList.reduce((sum, inv) => sum + inv.grandTotal, 0),
      monthlyAmount: invoiceList
        .filter(inv => {
          const invDate = new Date(inv.date);
          return invDate.getMonth() === currentMonth && invDate.getFullYear() === currentYear;
        })
        .reduce((sum, inv) => sum + inv.grandTotal, 0),
    };
    setStats(stats);
  };

  const filterInvoices = useCallback(() => {
    let filtered = invoices;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        invoice =>
          invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.clientNIF.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.aeatStatus === statusFilter);
    }

    // Filtrar por fecha
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      filtered = filtered.filter(invoice => {
        const invoiceDate = new Date(invoice.date);

        switch (dateFilter) {
          case 'today':
            return invoiceDate >= today;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return invoiceDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return invoiceDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredInvoices(filtered);
  }, [invoices, searchTerm, statusFilter, dateFilter]);

  useEffect(() => {
    if (hasAccess) {
      fetchInvoices();
    }
  }, [hasAccess, fetchInvoices]);

  useEffect(() => {
    filterInvoices();
  }, [filterInvoices]);

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handleSendToAEAT = async (invoiceId: string) => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/facturas/${invoiceId}/send-to-aeat`, {
        method: 'POST',
      });

      if (response.ok) {
        // Actualizar la lista local
        const updatedInvoices = invoices.map(inv =>
          inv._id === invoiceId ? { ...inv, aeatStatus: 'sent' as const } : inv,
        );
        setInvoices(updatedInvoices);
      } else {
        // Error sending invoice to AEAT - handled silently in production
      }
    } catch (error) {
      // Error sending invoice to AEAT - handled silently in production
    } finally {
      setActionLoading(false);
    }
  };

  const handleRegenerateInvoice = async (invoiceId: string) => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/facturas/${invoiceId}/regenerate`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchInvoices(); // Recargar todas las facturas
      } else {
        // Error regenerating invoice - handled silently in production
      }
    } catch (error) {
      // Error regenerating invoice - handled silently in production
    } finally {
      setActionLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'text-green-400 bg-green-400/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'error':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent':
        return 'Enviada a AEAT';
      case 'pending':
        return 'Pendiente';
      case 'error':
        return 'Error';
      default:
        return status;
    }
  };

  if (guardLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center'>
        <div className='text-gold text-xl'>Verificando permisos...</div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-red-400 text-xl mb-4'>Acceso denegado</div>
          <p className='text-gray-400'>No tienes permisos para acceder a esta página</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-gold mb-2'>Gestión de Facturas</h1>
          <p className='text-gray-400'>Facturación electrónica con normativa española</p>
        </div>
        <div className='flex gap-2'>
          <button
            onClick={fetchInvoices}
            disabled={loading}
            className='px-4 py-2 bg-gold text-black rounded-xl hover:bg-yellow-400 transition-all disabled:opacity-50'
          >
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4'>
        <div className='bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10'>
          <div className='text-2xl font-bold text-gold'>{stats.total}</div>
          <div className='text-gray-400 text-sm'>Total Facturas</div>
        </div>
        <div className='bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10'>
          <div className='text-2xl font-bold text-yellow-400'>{stats.pending}</div>
          <div className='text-gray-400 text-sm'>Pendientes</div>
        </div>
        <div className='bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10'>
          <div className='text-2xl font-bold text-green-400'>{stats.sent}</div>
          <div className='text-gray-400 text-sm'>Enviadas</div>
        </div>
        <div className='bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10'>
          <div className='text-2xl font-bold text-red-400'>{stats.error}</div>
          <div className='text-gray-400 text-sm'>Con Error</div>
        </div>
        <div className='bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10'>
          <div className='text-xl font-bold text-emerald-400'>{formatPrice(stats.totalAmount)}</div>
          <div className='text-gray-400 text-sm'>Total Facturado</div>
        </div>
        <div className='bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10'>
          <div className='text-xl font-bold text-blue-400'>{formatPrice(stats.monthlyAmount)}</div>
          <div className='text-gray-400 text-sm'>Este Mes</div>
        </div>
      </div>

      {/* E-Invoice Providers Status */}
      <div className='bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10'>
        <h3 className='text-lg font-bold text-gold mb-4'>Estado de Proveedores E-Facturación</h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {eInvoiceProviders.map(provider => (
            <div
              key={provider.id}
              className='flex items-center justify-between p-4 bg-white/5 rounded-lg'
            >
              <div>
                <div className='font-medium text-white'>{provider.name}</div>
                <div className='text-sm text-gray-400'>
                  {provider.status === 'active' ? 'Conectado' : 'Desconectado'}
                </div>
              </div>
              <div
                className={`w-3 h-3 rounded-full ${
                  provider.status === 'active' ? 'bg-green-400' : 'bg-red-400'
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className='bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-300 mb-2'>Buscar</label>
            <input
              type='text'
              placeholder='Número, cliente o NIF...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-gold'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-300 mb-2'>Estado</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className='w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-gold'
            >
              <option value='all'>Todos los estados</option>
              <option value='pending'>Pendientes</option>
              <option value='sent'>Enviadas</option>
              <option value='error'>Con Error</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-300 mb-2'>Período</label>
            <select
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value as any)}
              className='w-full px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-gold'
            >
              <option value='all'>Todas las fechas</option>
              <option value='today'>Hoy</option>
              <option value='week'>Esta semana</option>
              <option value='month'>Este mes</option>
            </select>
          </div>
          <div className='flex items-end'>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateFilter('all');
              }}
              className='w-full px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all'
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className='bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden'>
        {loading ? (
          <div className='p-8 text-center'>
            <div className='text-gold text-xl'>Cargando facturas...</div>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className='p-8 text-center'>
            <div className='text-gray-400 text-xl'>No se encontraron facturas</div>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-white/10'>
                <tr>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                    Factura
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                    Cliente
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                    Fecha
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                    Importe
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                    Estado AEAT
                  </th>
                  <th className='px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-white/10'>
                {filteredInvoices.map(invoice => (
                  <tr key={invoice._id} className='hover:bg-white/5'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-white font-medium'>#{invoice.number}</div>
                      <div className='text-gray-400 text-sm'>
                        Reserva: {invoice.reservation._id.slice(-8)}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-white font-medium'>{invoice.clientName}</div>
                      <div className='text-gray-400 text-sm'>{invoice.clientNIF}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-gray-300'>
                      {formatDate(invoice.date)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-white font-medium'>
                        {formatPrice(invoice.grandTotal)}
                      </div>
                      <div className='text-gray-400 text-sm'>
                        IVA: {formatPrice(invoice.vatTotal)}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.aeatStatus)}`}
                      >
                        {getStatusText(invoice.aeatStatus)}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex gap-2'>
                        <button
                          onClick={() => handleViewInvoice(invoice)}
                          className='px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-all'
                        >
                          Ver
                        </button>
                        {invoice.aeatStatus === 'pending' && (
                          <button
                            onClick={() => handleSendToAEAT(invoice._id)}
                            disabled={actionLoading}
                            className='px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-all disabled:opacity-50'
                          >
                            Enviar
                          </button>
                        )}
                        {invoice.aeatStatus === 'error' && (
                          <button
                            onClick={() => handleRegenerateInvoice(invoice._id)}
                            disabled={actionLoading}
                            className='px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm transition-all disabled:opacity-50'
                          >
                            Regenerar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Detail Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div className='fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50'>
          <div className='bg-gray-900 rounded-xl p-6 w-full max-w-4xl mx-4 border border-white/10 max-h-[90vh] overflow-y-auto'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-xl font-bold text-gold'>Factura #{selectedInvoice.number}</h3>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className='text-white hover:text-gold'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Información del cliente */}
              <div className='space-y-4'>
                <h4 className='text-lg font-bold text-white'>Información del Cliente</h4>
                <div className='bg-white/5 rounded-lg p-4'>
                  <div className='space-y-2'>
                    <div>
                      <span className='text-gray-400'>Nombre:</span>
                      <span className='text-white ml-2'>{selectedInvoice.clientName}</span>
                    </div>
                    <div>
                      <span className='text-gray-400'>NIF:</span>
                      <span className='text-white ml-2'>{selectedInvoice.clientNIF}</span>
                    </div>
                    {selectedInvoice.clientAddress && (
                      <div>
                        <span className='text-gray-400'>Dirección:</span>
                        <span className='text-white ml-2'>{selectedInvoice.clientAddress}</span>
                      </div>
                    )}
                  </div>
                </div>

                <h4 className='text-lg font-bold text-white'>Reserva Asociada</h4>
                <div className='bg-white/5 rounded-lg p-4'>
                  <div className='space-y-2'>
                    <div>
                      <span className='text-gray-400'>Check-in:</span>
                      <span className='text-white ml-2'>
                        {formatDate(selectedInvoice.reservation.checkIn)}
                      </span>
                    </div>
                    <div>
                      <span className='text-gray-400'>Check-out:</span>
                      <span className='text-white ml-2'>
                        {formatDate(selectedInvoice.reservation.checkOut)}
                      </span>
                    </div>
                    <div>
                      <span className='text-gray-400'>Precio reserva:</span>
                      <span className='text-white ml-2'>
                        {formatPrice(selectedInvoice.reservation.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalles de la factura */}
              <div className='space-y-4'>
                <h4 className='text-lg font-bold text-white'>Detalles de Facturación</h4>
                <div className='bg-white/5 rounded-lg p-4'>
                  <div className='space-y-2'>
                    <div>
                      <span className='text-gray-400'>Fecha:</span>
                      <span className='text-white ml-2'>{formatDate(selectedInvoice.date)}</span>
                    </div>
                    <div>
                      <span className='text-gray-400'>Estado AEAT:</span>
                      <span
                        className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getStatusColor(selectedInvoice.aeatStatus)}`}
                      >
                        {getStatusText(selectedInvoice.aeatStatus)}
                      </span>
                    </div>
                  </div>
                </div>

                <h4 className='text-lg font-bold text-white'>Desglose</h4>
                <div className='bg-white/5 rounded-lg p-4'>
                  <div className='space-y-2'>
                    {selectedInvoice.items.map((item, index) => (
                      <div key={index} className='flex justify-between'>
                        <span className='text-gray-400'>{item.description}</span>
                        <span className='text-white'>
                          {formatPrice(item.quantity * item.unitPrice)}
                        </span>
                      </div>
                    ))}
                    <div className='border-t border-white/20 pt-2 mt-2'>
                      <div className='flex justify-between'>
                        <span className='text-gray-400'>Subtotal:</span>
                        <span className='text-white'>{formatPrice(selectedInvoice.total)}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-400'>IVA:</span>
                        <span className='text-white'>{formatPrice(selectedInvoice.vatTotal)}</span>
                      </div>
                      <div className='flex justify-between font-bold'>
                        <span className='text-gold'>Total:</span>
                        <span className='text-gold'>{formatPrice(selectedInvoice.grandTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enlaces a documentos */}
            {(selectedInvoice.pdfUrl || selectedInvoice.xmlUrl || selectedInvoice.qrUrl) && (
              <div className='mt-6 pt-6 border-t border-white/20'>
                <h4 className='text-lg font-bold text-white mb-4'>Documentos</h4>
                <div className='flex gap-4'>
                  {selectedInvoice.pdfUrl && (
                    <a
                      href={selectedInvoice.pdfUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all'
                    >
                      📄 Ver PDF
                    </a>
                  )}
                  {selectedInvoice.xmlUrl && (
                    <a
                      href={selectedInvoice.xmlUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all'
                    >
                      📋 Ver XML
                    </a>
                  )}
                  {selectedInvoice.qrUrl && (
                    <a
                      href={selectedInvoice.qrUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all'
                    >
                      📱 Ver QR
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
