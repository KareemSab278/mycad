import type { AccountInfo } from './account';


export type MachinePage = {
  machines: Machine[];
  next_after: string | null;
};

export type Machine = {
  name: string;
  account?: string;
  arrangement?: string;
  status?: MachineStatus;
  nextDelivery?: string;
  lastServiced?: string;
  machine_id: string;
  model_code: string;
  location: string;
  root_model: number | string;
};

export type MachineStatus = 'Online' | 'Service pending' | 'Issue reported' | 'Last serviced';

export type MachineMaintenance = {
  machine_id: string;
  location: string;
  date: string;
  time: string;
  site: string;
};

export type MachineMaintenanceResponse = {
  maintenance: MachineMaintenance | null;
};

export type AccountMaintenanceRecord = {
  machine_id: string;
  location: string;
  date: string | null;
  time: string | null;
  site: string | null;
};

export type AccountMaintenanceResponse = {
  maintenance_records: AccountMaintenanceRecord[];
};

export type ServiceHistoryStatus = 'B' | 'C' | 'D';

export type ServiceHistoryFilters = {
  account?: string;
  status?: ServiceHistoryStatus;
};

export type ServiceHistoryRecord = {
  service_call_id: string;
  account_id: string;
  machine_id: string;
  reported_date: string;
  reported_time: string;
  closed_date: string;
  closed_time: string;
  status: string;
  call_type: string;
  summary: string;
};

export type ServiceHistoryResponse = {
  service_requests: ServiceHistoryRecord[];
  next_before: string | null;
};

export type MachineRecord = Machine & Required<Pick<
  Machine,
  'machine_id' | 'account' | 'model_code' | 'arrangement' | 'status' | 'nextDelivery' | 'lastServiced'
>>;

export type ServiceRequest = {
  id: string;
  machineId: string;
  type: 'Maintenance' | 'Support' | 'Refund';
  summary: string;
  status: 'In review' | 'Scheduled' | 'Resolved';
  date: string;
};

// still experiemtnal - do not know what the data key vals look like
export type SiteServiceRequest = ServiceRequest & {
  accountId: string;
  siteId: string;
};

export type MachineServiceRequestInput = {
  summary: string;
};

export type MachineRefundRequestInput = {
  reason: string;
  purchase_date: string;
  transaction_id?: string;
  additional_details?: string;
};

export type LinkedMachine = {
  account: AccountInfo;
  machine: Machine;
};