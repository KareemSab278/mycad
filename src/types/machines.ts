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