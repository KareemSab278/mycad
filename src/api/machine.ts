
import type {
  AccountInfo,
  LinkedMachine,
  MachinePage,
  MachineMaintenanceResponse,
  MachineRefundRequestInput,
  MachineServiceRequestInput,
  Saved,
  Scalar,
  ServiceHistoryFilters,
  ServiceHistoryResponse,
} from '../types';
import { Api, withApiLogging } from './apiMethods';
import { accountPath, machineId, serviceHistoryQuery } from './paths';

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

// Requires a machine ID and returns its maintenance history; see types/machines.ts for the shape.
const GetMaintenance = (machine: Scalar, signal?: AbortSignal) =>
  withApiLogging('Machine.GetMaintenance', () =>
    Api.Get<MachineMaintenanceResponse>(`/machines/${machineId(machine)}/maintenance`, { signal }),
  );

// Requires a machine ID and idempotency key to submit a service request; the response is not modeled yet.
const SubmitServiceRequest = (machine: Scalar, key: string, signal?: AbortSignal) =>
  withApiLogging('Machine.SubmitServiceRequest', () =>
    Api.Post<never>(`/machines/${machineId(machine)}/service-requests`, undefined, { key, signal }),
  );

// Loads one page of a machine's service-call history; see types/machines.ts for filters and response.
const GetServiceRequests = (
  machine: Scalar,
  filters: ServiceHistoryFilters = {},
  signal?: AbortSignal,
) =>
  withApiLogging('Machine.GetServiceRequests', () =>
    Api.Get<ServiceHistoryResponse>(
      `/machines/${machineId(machine)}/service-requests${serviceHistoryQuery(filters)}`,
      { signal },
    ),
  );

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
  GetMaintenance,
  SubmitServiceRequest,
  GetServiceRequests,
  SubmitMaintenanceRequest,
  SubmitSupportRequest,
  SubmitRefundRequest,
};