import type { DeliverySchedulePatch, Saved, Scalar, SiteOrderItem } from '../types';

const GetSiteDeliverySchedule: (
  account: string,
  site: Scalar,
  signal?: AbortSignal,
) => Promise<SiteOrderItem[]> = async () => {
  throw new Error('Site delivery schedules are not implemented yet.');
};

const UpdateSiteDeliverySchedule: (
  account: string,
  site: Scalar,
  body: DeliverySchedulePatch,
  key: string,
  signal?: AbortSignal,
) => Promise<Saved> = async () => {
  throw new Error('Site delivery schedule updates are not implemented yet.');
};

export const Orders = { GetSiteDeliverySchedule, UpdateSiteDeliverySchedule };