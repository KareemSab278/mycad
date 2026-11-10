import { Api } from './apiMethods';
import type { InvoiceDetail, InvoiceFilters, InvoicePage, Scalar } from '../types';
import { recordId } from './paths';

const GetAll = (filters: InvoiceFilters = {}, signal?: AbortSignal) => {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== '') query.set(key, String(value));
  }

  const queryString = query.toString();
  return Api.Get<InvoicePage>(`/invoices${queryString ? `?${queryString}` : ''}`, { signal });
};

const GetOne = (invoice: Scalar, signal?: AbortSignal) =>
  Api.Get<InvoiceDetail>(`/invoices/${recordId(invoice)}`, { signal: signal });

const GetPdf = (invoice: Scalar, signal?: AbortSignal) =>
  Api.Get<ArrayBuffer>(`/invoices/${recordId(invoice)}/pdf`, { pdf: true, signal });

export const Invoice = { GetAll, GetOne, GetPdf };
