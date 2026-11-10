export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type ApiProblem = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  request_id?: string;
};

export type RequestOptions = {
  authenticated?: boolean;
  body?: object;
  key?: string;
  pdf?: boolean;
  signal?: AbortSignal;
};

export type ReadOptions = Pick<RequestOptions, 'pdf' | 'signal'>;
export type WriteOptions = Pick<RequestOptions, 'authenticated' | 'key' | 'signal'>;

export type ApiError = Error & { status: number; requestId?: string };

export type Scalar = string | number;

export type Profile = {
  user_id: Scalar;
  firstname: string;
  lastname: string;
  email: string;
};

export type AccountInfo = {
  account_id: string;
  company_name: string;
  address1: string;
  address2: string;
  town: string;
  county: string;
  postcode: string;
};

export type MachineInfo = {
  machine_id: string;
  model_code: string;
  location: string;
};

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

export const days = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export const times = [
  'opening_time',
  'closing_time',
  'break_1_start',
  'break_1_end',
  'break_2_start',
  'break_2_end',
  'break_3_start',
  'break_3_end',
] as const;

type Day = typeof days[number];
type Time = typeof times[number];

export type RuleInput = {
  rule_type: 0 | 1 | 2 | 3;
  notes: string;
  staff_levels?: number;
  on_from_date?: string | null;
  until_date?: string | null;
  ufn?: boolean;
} & Partial<Record<Day, boolean>> & Partial<Record<Time, string | null>>;

export type Rule = {
  restriction_id: Scalar;
  account_id: string;
  version: string;
  approved: boolean;
  rule_type: Scalar;
  notes: string | null;
  staff_levels: Scalar | null;
  created: string;
  modified: string | null;
  on_from_date: string | null;
  until_date: string | null;
  ufn: Scalar | boolean | null;
} & Partial<Record<Day, Scalar | boolean | null>> & Partial<Record<Time, string | null>>;

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

export type MachinePage = {
  machines: MachineInfo[];
  next_after: string | null;
};

export type Saved = { saved: true };

export type LoginSession = {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  user: Profile;
};
