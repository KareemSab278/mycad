import type { Machine, ServiceRequest } from '../../../types';

export type RequestType = ServiceRequest['type'];

export type AccountMachine = {
  machine: Machine;
  accountName: string;
  siteName: string;
};

export const getMachineKey = ({ machine, accountName, siteName }: AccountMachine) =>
  machine.id ?? `${accountName}:${siteName}:${machine.name}`;
