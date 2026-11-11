
import type { Saved, Scalar, SiteServiceRequest } from '../types';
import { Api } from './apiMethods';
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

const GetAllSiteServiceRequests: (
  signal?: AbortSignal,
) => Promise<SiteServiceRequest[]> = async () => {
  throw new Error('Site service requests are not implemented yet.');
};

export const Support = { SubmitInvoiceQuery, GetAllSiteServiceRequests };