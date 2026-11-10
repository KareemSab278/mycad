import type { Scalar } from '../types';

export const accountPath = (account: string) => {
  if (!/^[A-Z][0-9]{3}$/.test(account)) throw new Error('Invalid account code.');
  return `/accounts/${account}`;
};

export const recordId = (value: Scalar) => {
  const digits = String(value);
  if (!/^[1-9][0-9]{0,9}$/.test(digits)) throw new Error('Invalid record ID.');
  return digits;
};
