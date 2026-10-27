export type Invoice = {
  number: string;
  date: string;
  period: string;
  account: string;
  order: string;
  vatRate: string;
  exVat: string;
  vat: string;
  total: string;
  url: string;
};

// Sample history only; replace each URL with the corresponding invoice link.
export const fakeInvoices: Invoice[] = [
  {
    number: '439104',
    date: '24/09/2026',
    period: '28/08/2026',
    account: 'S354',
    order: 'PO123059',
    vatRate: '20%',
    exVat: '£362.76',
    vat: '£72.55',
    total: '£435.31',
    url: 'https://info.coin-a-drink.co.uk/api/?action=invoices/display_invoice&invoice_id=439104',
  },
  {
    number: '439001',
    date: '27/08/2026',
    period: '31/07/2026',
    account: 'S354',
    order: 'PO123059',
    vatRate: '20%',
    exVat: '£191.54',
    vat: '£38.31',
    total: '£229.85',
    url: 'https://info.coin-a-drink.co.uk/api/?action=invoices/display_invoice&invoice_id=439001',
  },
  {
    number: '439105',
    date: '24/09/2026',
    period: '28/08/2026',
    account: 'S354',
    order: 'PO123059',
    vatRate: '20%',
    exVat: '£362.76',
    vat: '£72.55',
    total: '£435.31',
    url: 'https://info.coin-a-drink.co.uk/api/?action=invoices/display_invoice&invoice_id=439105',
  },
  {
    number: '439002',
    date: '27/08/2026',
    period: '31/07/2026',
    account: 'S354',
    order: 'PO123059',
    vatRate: '20%',
    exVat: '£191.54',
    vat: '£38.31',
    total: '£229.85',
    url: 'https://info.coin-a-drink.co.uk/api/?action=invoices/display_invoice&invoice_id=439002',
  },
  {
    number: '439106',
    date: '24/09/2026',
    period: '28/08/2026',
    account: 'S354',
    order: 'PO123059',
    vatRate: '20%',
    exVat: '£362.76',
    vat: '£72.55',
    total: '£435.31',
    url: 'https://info.coin-a-drink.co.uk/api/?action=invoices/display_invoice&invoice_id=439106',
  },
  {
    number: '439003',
    date: '27/08/2026',
    period: '31/07/2026',
    account: 'S354',
    order: 'PO123059',
    vatRate: '20%',
    exVat: '£191.54',
    vat: '£38.31',
    total: '£229.85',
    url: 'https://info.coin-a-drink.co.uk/api/?action=invoices/display_invoice&invoice_id=439003',
  },
];
