import type {
  AccountInfo,
  AccountMaintenanceResponse,
  DeliveryScheduleResponse,
  ServiceHistoryFilters,
  ServiceHistoryResponse,
} from '../types';
import { Api, withApiLogging } from './apiMethods';
import { accountPath, serviceHistoryQuery } from './paths';

const GetAll = (signal?: AbortSignal) => Api.Get<AccountInfo[]>('/accounts', { signal });

// Loads one page of an account's service-call history; the client does not follow next_before.
const GetAllServiceRequests = (
  account: string,
  filters: Omit<ServiceHistoryFilters, 'account'> = {},
  signal?: AbortSignal,
) => withApiLogging('Account.GetAllServiceRequests', () =>
  Api.Get<ServiceHistoryResponse>(
    `/service-requests${serviceHistoryQuery({
      account,
      status: filters.status,
    })}`,
    { signal },
  ),
);

const GetInfo = (account: string, signal?: AbortSignal) =>
  Api.Get<AccountInfo>(accountPath(account), { signal });

// Returns up to 100 recent order documents for an account; see types/orders.ts for the shape.
const GetDeliverySchedule = async (account: string, signal?: AbortSignal) => {
    return await Api.Get<DeliveryScheduleResponse>(`${accountPath(account)}/delivery-schedule`, { signal });
  };

// Requires an account code and returns its latest maintenance row per machine; see types/machines.ts.
const GetMaintenance = (account: string, signal?: AbortSignal) =>
  withApiLogging('Account.GetMaintenance', () =>
    Api.Get<AccountMaintenanceResponse>(`${accountPath(account)}/maintenance`, { signal }),
  );

export const Account = {
  GetAll,
  GetInfo,
  GetAllServiceRequests,
  GetDeliverySchedule,
  GetMaintenance,
};
