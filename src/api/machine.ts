
import type {
  AccountInfo,
  LinkedMachine,
  MachinePage,
  MachineRefundRequestInput,
  MachineServiceRequestInput,
  Saved,
  Scalar,
  ServiceRequest,
} from '../types';
import { Api } from './apiMethods';
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

const GetServiceRequests: (
  account: string,
  machine: Scalar,
  signal?: AbortSignal,
) => Promise<ServiceRequest[]> = async () => {
  throw new Error('Machine service requests are not implemented yet.');
};

const SubmitMaintenanceRequest: (
  account: string,
  machine: Scalar,
  body: MachineServiceRequestInput,
  key: string,
  signal?: AbortSignal,
) => Promise<Saved> = async () => {
  throw new Error('Machine maintenance requests are not implemented yet.');
};

const SubmitSupportRequest: (
  account: string,
  machine: Scalar,
  body: MachineServiceRequestInput,
  key: string,
  signal?: AbortSignal,
) => Promise<Saved> = async () => {
  throw new Error('Machine support requests are not implemented yet.');
};

const SubmitRefundRequest: (
  account: string,
  machine: Scalar,
  body: MachineRefundRequestInput,
  key: string,
  signal?: AbortSignal,
) => Promise<Saved> = async () => {
  throw new Error('Machine refund requests are not implemented yet.');
};

export const Machine = {
  GetAll,
  GetAllForAccounts,
  GetServiceRequests,
  SubmitMaintenanceRequest,
  SubmitSupportRequest,
  SubmitRefundRequest,
};