import { Api } from './apiMethods';
import type { AccountInfo } from '../types';
import { accountPath } from './paths';

const GetAll = (signal?: AbortSignal) => Api.Get<AccountInfo[]>('/accounts', { signal });

const GetInfo = (account: string, signal?: AbortSignal) =>
  Api.Get<AccountInfo>(accountPath(account), { signal });

export const Account = { GetAll, GetInfo };
