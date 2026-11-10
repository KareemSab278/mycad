export type InvoiceRecord = {
  invoice_id: string;
  account_id: string;
  company_name: string;
  period_start: string;
  period_end: string;
  ex_vat_total: string | null;
  vat_total: string | null;
  total: string | null;
  order_no: string;
  vat_rate: string | null;
  split_credit: string | null;
};

export type InvoiceDetail = Pick<
  InvoiceRecord,
  | 'invoice_id'
  | 'account_id'
  | 'company_name'
  | 'period_start'
  | 'period_end'
  | 'ex_vat_total'
  | 'vat_total'
  | 'total'
  | 'order_no'
  | 'vat_rate'
  | 'split_credit'
> & {
  address1: string;
  address2: string;
  address3: string;
  address4: string;
  postcode: string;
  lines: {
    item_type: string;
    quantity: string;
    description: string | null;
    value: string | null;
    machine_id: string;
  }[];
};

export type InvoiceSort =
  | 'invoice_desc'
  | 'invoice_asc'
  | 'date_desc'
  | 'date_asc'
  | 'account_asc'
  | 'account_desc';

export type InvoicePageSize = 25 | 50 | 100;

export type InvoiceFilters = {
  account?: string;
  from?: string;
  to?: string;
  number?: string;
  page?: number;
  page_size?: InvoicePageSize;
  sort?: InvoiceSort;
};

export type InvoicePage = {
  invoices: InvoiceRecord[];
  next_before: string | null;
  page: number;
  next_page: number | null;
};
