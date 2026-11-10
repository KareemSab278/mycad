
import { Api } from './apiMethods';
import type { MachinePage } from '../types';
import { accountPath } from './paths';

const GetAll = (account: string, after?: string, signal?: AbortSignal) => {
  const query = after ? `?after=${encodeURIComponent(after)}` : '';
  return Api.Get<MachinePage>(`${accountPath(account)}/machines${query}`, { signal });
};

export const Machine = { GetAll };