
import { Api } from './apiMethods';
import type { Scalar, Saved } from '../types';
import { recordId } from './paths';

const SubmitInvoiceQuery = (
  invoice: Scalar,
  message: string,
  key: string,
  signal?: AbortSignal,
) => Api.Post<Saved & { query_id: Scalar }>(
  `/invoices/${recordId(invoice)}/queries`,
  { message },
  { key, signal },
);

export const Support = { SubmitInvoiceQuery };