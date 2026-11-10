
import { Api } from './apiMethods';
import type { AccountInfo, LinkedMachine, MachinePage } from '../types';
import { accountPath } from './paths';

const GetAll = (account: string, after?: string, signal?: AbortSignal) => {
  const query = after ? `?after=${encodeURIComponent(after)}` : '';
  return Api.Get<MachinePage>(`${accountPath(account)}/machines${query}`, { signal });
};

const GetAllForAccounts = async (accounts: AccountInfo[], signal?: AbortSignal): Promise<LinkedMachine[]> => {
  const linkedMachines: LinkedMachine[] = [];

  for (const account of accounts) {
    let after: string | undefined;
    const seenCursors = new Set<string>();

    do {
      const page = await GetAll(account.account_id, after, signal);
      linkedMachines.push(...page.machines.map((machine) => ({ account, machine })));

      after = page.next_after ?? undefined;
      if (after && seenCursors.has(after)) {
        throw new Error('The API returned a repeated machine pagination cursor.');
      }
      if (after) seenCursors.add(after);
    } while (after);
  }

  return linkedMachines;
};

export const Machine = { GetAll, GetAllForAccounts };