// Configuración para APIs de facturación electrónica española
// Normativa: Real Decreto 1619/2012 y Orden EHA/962/2007

export interface EInvoiceProvider {
  id: string;
  name: string;
  apiUrl: string;
  apiKey?: string;
  status: 'active' | 'inactive';
  features: string[];
  documentation: string;
}

export const E_INVOICE_PROVIDERS: EInvoiceProvider[] = [
  {
    id: 'verifacti',
    name: 'Verifacti',
    apiUrl: process.env.VERIFACTI_API_URL || 'https://api.verifacti.com/v1',
    apiKey: process.env.VERIFACTI_API_KEY,
    status: 'active',
    features: [
      'Generación automática de Facturae XML',
      'Envío directo a AEAT',
      'Generación de PDF con QR',
      'Validación de NIF/CIF',
      'Cumplimiento normativa española'
    ],
    documentation: 'https://docs.verifacti.com'
  },
  {
    id: 'facturae',
    name: 'Facturae',
    apiUrl: process.env.FACTURAE_API_URL || 'https://api.facturae.com/v1',
    apiKey: process.env.FACTURAE_API_KEY,
    status: 'active',
    features: [
      'Formato Facturae 3.2.2',
      'Firma electrónica XAdES',
      'Envío a AEAT',
      'Generación de QR',
      'Validación automática'
    ],
    documentation: 'https://www.facturae.es'
  },
  {
    id: 'aeat',
    name: 'AEAT Directo',
    apiUrl: process.env.AEAT_API_URL || 'https://www.agenciatributaria.es/ws/facturae',
    apiKey: process.env.AEAT_API_KEY,
    status: 'active',
    features: [
      'Envío directo a AEAT',
      'Respuesta inmediata',
      'Códigos de error detallados',
      'Trazabilidad completa'
    ],
    documentation: 'https://www.agenciatributaria.es'
  }
];

export interface InvoiceData {
  number: string;
  date: string;
  client: {
    name: string;
    nif: string;
    address?: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    vat: number;
    total: number;
  }>;
  totals: {
    subtotal: number;
    vat: number;
    total: number;
  };
}

export interface EInvoiceResponse {
  success: boolean;
  message: string;
  pdfUrl?: string;
  xmlUrl?: string;
  qrUrl?: string;
  aeatResponse?: string;
  errorCode?: string;
}

// Configuración de la empresa para facturación
export const COMPANY_CONFIG = {
  name: 'Granada Inn',
  nif: 'B12345678',
  address: {
    street: 'Carretera A-92, km 45',
    city: 'Granada',
    province: 'Granada',
    postalCode: '18015',
    country: 'ESP'
  },
  contact: {
    phone: '958 123 456',
    email: 'info@granadainn.com'
  },
  taxInfo: {
    ivaType: 'reduced', // IVA reducido para hoteles (10%)
    ivaRate: 10,
    taxOffice: '1801' // Delegación de Granada
  }
};

// Tipos de IVA según normativa española
export const VAT_RATES = {
  general: 21, // IVA general
  reduced: 10, // IVA reducido (hoteles, restaurantes)
  super_reduced: 4, // IVA súper reducido
  zero: 0 // IVA cero
};

// Códigos de error comunes de la AEAT
export const AEAT_ERROR_CODES = {
  '001': 'NIF del destinatario incorrecto',
  '002': 'Formato de factura incorrecto',
  '003': 'Fecha de factura inválida',
  '004': 'Importe incorrecto',
  '005': 'IVA incorrecto',
  '006': 'Error en la firma electrónica',
  '007': 'Servicio temporalmente no disponible',
  '999': 'Error interno del sistema'
}; 