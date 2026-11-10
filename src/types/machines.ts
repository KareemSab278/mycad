export type Machine = {
  id?: string;
  name: string;
  account?: string;
  model?: string;
  arrangement?: string;
  status?: MachineStatus;
  nextDelivery?: string;
  lastServiced?: string;
};

export type MachineStatus = 'Online' | 'Service pending' | 'Issue reported' | 'Last serviced';

export type MachineRecord = Machine & Required<Pick<
  Machine,
  'id' | 'account' | 'model' | 'arrangement' | 'status' | 'nextDelivery' | 'lastServiced'
>>;

export type ServiceRequest = {
  id: string;
  machineId: string;
  type: 'Maintenance' | 'Support' | 'Refund';
  summary: string;
  status: 'In review' | 'Scheduled' | 'Resolved';
  date: string;
};