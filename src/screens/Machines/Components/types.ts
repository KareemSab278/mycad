import type { LinkedMachine, ServiceRequest } from '../../../types';

export type RequestType = ServiceRequest['type'];
export type AccountMachine = LinkedMachine;

export const getMachineKey = ({ account, machine }: AccountMachine) =>
  `${account.account_id}:${machine.machine_id}`;
