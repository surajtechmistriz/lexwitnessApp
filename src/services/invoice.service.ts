import api from '../network/client';
import { ENDPOINTS } from '../network/endpoints';
import { normalizeApiError } from '../network/errorHandler';
import { InvoiceResponse } from '../types/invoice.types';

export const getUserInvoices = async () => {
  try {
    const { data } = await api.get<InvoiceResponse>(ENDPOINTS.INVOICE.HISTORY);
    return data;
  } catch (error) {
    throw normalizeApiError(error);
  }
};

/**
 * Deliberately NOT wrapped with normalizeApiError/try-catch — the only
 * caller (utils/invoiceDownload.ts's downloadInvoicePdf) inspects the
 * raw axios error (error.response.data, error.response.status) in its
 * own catch block. Normalizing here would break that.
 */
export const downloadInvoiceApi = async (id: number) => {
  return api.get(ENDPOINTS.INVOICE.DOWNLOAD(id), {
    responseType: 'arraybuffer',
  });
};
