import type { Scalar, ServiceHistoryFilters } from '../types';

export const accountCode = (account: string) => {
  if (!/^[A-Z][0-9]{3}$/.test(account)) throw new Error('Invalid account code.');
  return account;
};

export const accountPath = (account: string) => `/accounts/${accountCode(account)}`;

export const recordId = (value: Scalar) => {
  const digits = String(value);
  if (!/^[1-9][0-9]{0,9}$/.test(digits)) throw new Error('Invalid record ID.');
  return digits;
};

// Returns a validated machine ID string for use in machine API paths; callers are in machine.ts.
export const machineId = (value: Scalar) => {
  const digits = String(value);
  if (!/^[1-9][0-9]{0,8}$/.test(digits)) throw new Error('Invalid machine ID.');
  return digits;
};

export const serviceHistoryQuery = (filters: ServiceHistoryFilters = {}) => {
  const query = new URLSearchParams();
  if (filters.account) query.set('account', accountCode(filters.account));
  if (filters.status) query.set('status', filters.status);
  const params = query.toString();
  return params ? `?${params}` : '';
};
