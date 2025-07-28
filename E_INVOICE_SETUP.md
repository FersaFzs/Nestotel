# 🧾 Configuración de Facturación Electrónica Española

## 📋 Normativa Aplicable

- **Real Decreto 1619/2012**: Reglamento de facturación
- **Orden EHA/962/2007**: Formato electrónico de factura
- **Resolución de 29 de septiembre de 2016**: Facturae 3.2.2

## 🔧 Configuración de APIs

### 1. Verifacti (Recomendado)

**Ventajas:**
- ✅ API más fácil de integrar
- ✅ Generación automática de PDF con QR
- ✅ Validación de NIF/CIF automática
- ✅ Cumplimiento normativa español

**Configuración:**
```bash
# .env.local
VERIFACTI_API_URL=https://api.verifacti.com/v1
VERIFACTI_API_KEY=tu_api_key_aqui
```

**Registro:**
1. Ve a [Verifacti](https://verifacti.com)
2. Crea una cuenta empresarial
3. Solicita acceso a la API
4. Obtén tu API key

### 2. Facturae Oficial

**Ventajas:**
- ✅ Formato oficial del gobierno
- ✅ Firma electrónica XAdES
- ✅ Envío directo a AEAT

**Configuración:**
```bash
# .env.local
FACTURAE_API_URL=https://api.facturae.com/v1
FACTURAE_API_KEY=tu_api_key_aqui
```

**Registro:**
1. Ve a [Facturae](https://www.facturae.es)
2. Solicita certificado digital
3. Configura firma electrónica
4. Obtén credenciales API

### 3. AEAT Directo

**Ventajas:**
- ✅ Envío directo sin intermediarios
- ✅ Respuesta inmediata
- ✅ Sin costes adicionales

**Configuración:**
```bash
# .env.local
AEAT_API_URL=https://www.agenciatributaria.es/ws/facturae
AEAT_API_KEY=tu_api_key_aqui
```

**Registro:**
1. Ve a [AEAT](https://www.agenciatributaria.es)
2. Solicita certificado digital
3. Configura acceso a servicios web
4. Obtén credenciales

## 🏢 Configuración de la Empresa

### Datos Fiscales Granada Inn

```javascript
// lib/config/e-invoice.ts
export const COMPANY_CONFIG = {
  name: 'Granada Inn',
  nif: 'B12345678', // Cambiar por tu NIF real
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
```

### Tipos de IVA Aplicables

```javascript
export const VAT_RATES = {
  general: 21,    // IVA general
  reduced: 10,    // IVA reducido (hoteles, restaurantes)
  super_reduced: 4, // IVA súper reducido
  zero: 0         // IVA cero
};
```

## 📊 Funcionalidades Implementadas

### ✅ Gestión de Facturas
- Creación automática desde reservas
- Numeración correlativa
- Cálculo automático de IVA
- Generación de PDF con QR

### ✅ Envío a AEAT
- Envío automático a la AEAT
- Respuesta inmediata
- Códigos de error detallados
- Trazabilidad completa

### ✅ Cumplimiento Legal
- Formato Facturae 3.2.2
- Firma electrónica XAdES
- Validación de NIF/CIF
- Archivo digital obligatorio

## 🔍 Códigos de Error AEAT

| Código | Descripción |
|--------|-------------|
| 001 | NIF del destinatario incorrecto |
| 002 | Formato de factura incorrecto |
| 003 | Fecha de factura inválida |
| 004 | Importe incorrecto |
| 005 | IVA incorrecto |
| 006 | Error en la firma electrónica |
| 007 | Servicio temporalmente no disponible |
| 999 | Error interno del sistema |

## 🚀 Proceso de Facturación

### 1. Creación de Factura
```javascript
// Se crea automáticamente al confirmar reserva
const invoice = {
  number: '000001',
  date: '2024-01-15',
  client: {
    name: 'Juan Pérez',
    nif: '12345678A',
    address: 'Calle Mayor, 1, Madrid'
  },
  items: [{
    description: 'Estancia en habitación doble',
    quantity: 2,
    unitPrice: 150,
    vat: 10
  }],
  totals: {
    subtotal: 300,
    vat: 30,
    total: 330
  }
};
```

### 2. Envío a AEAT
```javascript
// Se envía automáticamente al crear la factura
const response = await sendToAEAT(invoice);
// Retorna: { success: true, pdfUrl, xmlUrl, qrUrl }
```

### 3. Almacenamiento
```javascript
// Se guarda en MongoDB con todos los enlaces
const savedInvoice = {
  ...invoice,
  pdfUrl: 'https://...',
  xmlUrl: 'https://...',
  qrUrl: 'https://...',
  aeatStatus: 'sent',
  aeatResponse: 'Enviado correctamente'
};
```

## 📱 QR Code

El QR code generado contiene:
- Número de factura
- NIF del emisor y receptor
- Importe total
- Fecha de emisión
- URL de verificación AEAT

## 🔐 Seguridad

### Certificados Digitales
- Certificado de persona jurídica
- Firma electrónica cualificada
- Sellado de tiempo

### Validaciones
- NIF/CIF válido
- Importes correctos
- Fechas coherentes
- Formato XML válido

## 💰 Costes

### Verifacti
- Plan Básico: 29€/mes
- Plan Profesional: 59€/mes
- Plan Empresarial: 99€/mes

### Facturae Oficial
- Certificado digital: ~60€/año
- Sin costes adicionales

### AEAT Directo
- Certificado digital: ~60€/año
- Sin costes adicionales

## 🆘 Soporte

### Verifacti
- 📧 support@verifacti.com
- 📞 +34 900 123 456
- 💬 Chat en vivo

### Facturae
- 📧 soporte@facturae.es
- 📞 901 200 345
- 📚 [Documentación oficial](https://www.facturae.es)

### AEAT
- 📧 facturae@correo.aeat.es
- 📞 901 200 345
- 🌐 [Portal AEAT](https://www.agenciatributaria.es) 