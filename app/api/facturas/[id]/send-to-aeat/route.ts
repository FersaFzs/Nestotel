import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/db/mongoose';
import Invoice from '../../../../../lib/db/models/Invoice';

// Configuración de APIs de facturación electrónica
const E_INVOICE_CONFIG = {
  verifacti: {
    apiUrl: process.env.VERIFACTI_API_URL || 'https://api.verifacti.com/v1',
    apiKey: process.env.VERIFACTI_API_KEY,
  },
  facturae: {
    apiUrl: process.env.FACTURAE_API_URL || 'https://api.facturae.com/v1',
    apiKey: process.env.FACTURAE_API_KEY,
  },
  aeat: {
    apiUrl: process.env.AEAT_API_URL || 'https://www.agenciatributaria.es/ws/facturae',
    apiKey: process.env.AEAT_API_KEY,
  },
};

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const invoice = await Invoice.findById(params.id);
    if (!invoice) {
      return NextResponse.json(
        { success: false, message: 'Factura no encontrada' },
        { status: 404 },
      );
    }

    // Verificar que la factura esté pendiente
    if (invoice.aeatStatus !== 'pending') {
      return NextResponse.json(
        { success: false, message: 'La factura ya ha sido procesada' },
        { status: 400 },
      );
    }

    // Preparar datos para la facturación electrónica
    const invoiceData = {
      number: invoice.number,
      date: invoice.date.toISOString().split('T')[0],
      client: {
        name: invoice.clientName,
        nif: invoice.clientNIF,
        address: invoice.clientAddress,
      },
      items: invoice.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        vat: item.vat,
        total: item.quantity * item.unitPrice,
      })),
      totals: {
        subtotal: invoice.total,
        vat: invoice.vatTotal,
        total: invoice.grandTotal,
      },
    };

    let success = false;
    let response = '';
    let pdfUrl = '';
    let xmlUrl = '';
    let qrUrl = '';

    // Intentar enviar a Verifacti primero
    if (E_INVOICE_CONFIG.verifacti.apiKey) {
      try {
        const verifactiResponse = await sendToVerifacti(invoiceData);
        if (verifactiResponse.success) {
          success = true;
          response = 'Enviado a Verifacti correctamente';
          pdfUrl = verifactiResponse.pdfUrl;
          xmlUrl = verifactiResponse.xmlUrl;
          qrUrl = verifactiResponse.qrUrl;
        }
      } catch (error) {
        console.error('Error sending to Verifacti:', error);
      }
    }

    // Si Verifacti falla, intentar con Facturae
    if (!success && E_INVOICE_CONFIG.facturae.apiKey) {
      try {
        const facturaeResponse = await sendToFacturae(invoiceData);
        if (facturaeResponse.success) {
          success = true;
          response = 'Enviado a Facturae correctamente';
          pdfUrl = facturaeResponse.pdfUrl;
          xmlUrl = facturaeResponse.xmlUrl;
          qrUrl = facturaeResponse.qrUrl;
        }
      } catch (error) {
        console.error('Error sending to Facturae:', error);
      }
    }

    // Si ambos fallan, intentar con AEAT directamente
    if (!success && E_INVOICE_CONFIG.aeat.apiKey) {
      try {
        const aeatResponse = await sendToAEAT(invoiceData);
        if (aeatResponse.success) {
          success = true;
          response = 'Enviado a AEAT correctamente';
          pdfUrl = aeatResponse.pdfUrl;
          xmlUrl = aeatResponse.xmlUrl;
          qrUrl = aeatResponse.qrUrl;
        }
      } catch (error) {
        console.error('Error sending to AEAT:', error);
      }
    }

    // Actualizar estado de la factura
    invoice.aeatStatus = success ? 'sent' : 'error';
    invoice.aeatResponse = response;
    if (pdfUrl) invoice.pdfUrl = pdfUrl;
    if (xmlUrl) invoice.xmlUrl = xmlUrl;
    if (qrUrl) invoice.qrUrl = qrUrl;

    await invoice.save();

    return NextResponse.json({
      success: true,
      message: success ? 'Factura enviada correctamente' : 'Error al enviar factura',
      status: invoice.aeatStatus,
      response,
    });
  } catch (error) {
    console.error('Error sending invoice to AEAT:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}

// Función para enviar a Verifacti
async function sendToVerifacti(invoiceData: any) {
  const response = await fetch(`${E_INVOICE_CONFIG.verifacti.apiUrl}/invoices`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${E_INVOICE_CONFIG.verifacti.apiKey}`,
    },
    body: JSON.stringify({
      invoice: invoiceData,
      format: 'facturae',
      generatePdf: true,
      generateQr: true,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    return {
      success: true,
      pdfUrl: data.pdfUrl,
      xmlUrl: data.xmlUrl,
      qrUrl: data.qrUrl,
    };
  }

  throw new Error('Verifacti API error');
}

// Función para enviar a Facturae
async function sendToFacturae(invoiceData: any) {
  const response = await fetch(`${E_INVOICE_CONFIG.facturae.apiUrl}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': E_INVOICE_CONFIG.facturae.apiKey!,
    },
    body: JSON.stringify({
      invoice: invoiceData,
      options: {
        includePdf: true,
        includeQr: true,
        sendToAeat: true,
      },
    }),
  });

  if (response.ok) {
    const data = await response.json();
    return {
      success: true,
      pdfUrl: data.pdfUrl,
      xmlUrl: data.xmlUrl,
      qrUrl: data.qrUrl,
    };
  }

  throw new Error('Facturae API error');
}

// Función para enviar a AEAT directamente
async function sendToAEAT(invoiceData: any) {
  // Simulación de envío a AEAT (en producción usarías la API real)
  const response = await fetch(`${E_INVOICE_CONFIG.aeat.apiUrl}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/xml',
      Authorization: `Bearer ${E_INVOICE_CONFIG.aeat.apiKey}`,
    },
    body: generateFacturaeXML(invoiceData),
  });

  if (response.ok) {
    const data = await response.json();
    return {
      success: true,
      pdfUrl: data.pdfUrl,
      xmlUrl: data.xmlUrl,
      qrUrl: data.qrUrl,
    };
  }

  throw new Error('AEAT API error');
}

// Función para generar XML Facturae (simplificado)
function generateFacturaeXML(invoiceData: any) {
  // En producción, generarías un XML válido según la especificación Facturae
  return `<?xml version="1.0" encoding="UTF-8"?>
<Facturae xmlns="http://www.facturae.es/Facturae/2014/v3.2.2/Facturae">
  <FileHeader>
    <SchemaVersion>3.2.2</SchemaVersion>
    <Modality>I</Modality>
    <InvoiceIssuerType>EM</InvoiceIssuerType>
  </FileHeader>
  <Parties>
    <SellerParty>
      <Individual>
        <Name>Granada Inn</Name>
        <FirstSurname>Hotel</FirstSurname>
        <TaxIdentification>
          <PersonTypeCode>J</PersonTypeCode>
          <ResidenceTypeCode>R</ResidenceTypeCode>
          <TaxIdentificationNumber>B12345678</TaxIdentificationNumber>
        </TaxIdentification>
      </Individual>
    </SellerParty>
    <BuyerParty>
      <Individual>
        <Name>${invoiceData.client.name}</Name>
        <TaxIdentification>
          <PersonTypeCode>J</PersonTypeCode>
          <ResidenceTypeCode>R</ResidenceTypeCode>
          <TaxIdentificationNumber>${invoiceData.client.nif}</TaxIdentificationNumber>
        </TaxIdentification>
      </Individual>
    </BuyerParty>
  </Parties>
  <Invoices>
    <Invoice>
      <InvoiceHeader>
        <InvoiceNumber>${invoiceData.number}</InvoiceNumber>
        <InvoiceDocumentType>FC</InvoiceDocumentType>
        <InvoiceClass>OO</InvoiceClass>
      </InvoiceHeader>
      <InvoiceIssueData>
        <IssueDate>${invoiceData.date}</IssueDate>
        <OperationDate>${invoiceData.date}</OperationDate>
        <PlaceOfIssue>
          <PostCode>18015</PostCode>
          <Address>Carretera A-92, km 45</Address>
          <Town>Granada</Town>
          <Province>Granada</Province>
          <CountryCode>ESP</CountryCode>
        </PlaceOfIssue>
      </InvoiceIssueData>
      <TaxesOutputs>
        <TaxesOutput>
          <TaxTypeCode>01</TaxTypeCode>
          <TaxRate>10.00</TaxRate>
          <TaxableBase>
            <TotalAmount>${invoiceData.totals.subtotal}</TotalAmount>
            <EquivalentInEuros>${invoiceData.totals.subtotal}</EquivalentInEuros>
          </TaxableBase>
          <TaxAmount>${invoiceData.totals.vat}</TaxAmount>
        </TaxesOutput>
      </TaxesOutputs>
      <InvoiceTotals>
        <TotalGrossAmount>${invoiceData.totals.subtotal}</TotalGrossAmount>
        <TotalGeneralDiscounts>0.00</TotalGeneralDiscounts>
        <TotalGeneralSurcharges>0.00</TotalGeneralSurcharges>
        <TotalGrossAmountBeforeTaxes>${invoiceData.totals.subtotal}</TotalGrossAmountBeforeTaxes>
        <TotalTaxOutputs>${invoiceData.totals.vat}</TotalTaxOutputs>
        <TotalTaxesWithheld>0.00</TotalTaxesWithheld>
        <InvoiceTotal>${invoiceData.totals.total}</InvoiceTotal>
        <TotalOutstandingAmount>${invoiceData.totals.total}</TotalOutstandingAmount>
        <TotalExecutableAmount>${invoiceData.totals.total}</TotalExecutableAmount>
      </InvoiceTotals>
    </Invoice>
  </Invoices>
</Facturae>`;
}
