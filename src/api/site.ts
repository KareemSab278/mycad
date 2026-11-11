import type { CareScheduleItem, Rule, RuleInput, Saved, Scalar } from '../types';
import { Api } from './apiMethods';
import { accountPath, recordId } from './paths';

const siteAccessPath = (account: string) => `${accountPath(account)}/site-access`;

const GetAll = (account: string, signal?: AbortSignal) =>
  Api.Get<Rule[]>(siteAccessPath(account), { signal });

const GetOne = (account: string, rule: string | number, signal?: AbortSignal) =>
  Api.Get<Rule>(`${siteAccessPath(account)}/${recordId(rule)}`, { signal });

const Create = (
  account: string,
  body: RuleInput,
  key: string,
  signal?: AbortSignal,
) => Api.Post<Saved & { restriction_id: string | number }>(
  siteAccessPath(account),
  body,
  { key, signal },
);

const Update = (
  account: string,
  rule: string | number,
  version: string,
  body: RuleInput,
  key: string,
  signal?: AbortSignal,
) => {
  const updateBody = Object.assign({}, body, { version });
  return Api.Patch<Saved & { restriction_id: string | number }>(
    `${siteAccessPath(account)}/${recordId(rule)}`,
    updateBody,
    { key, signal },
  );
};

const Delete = (
  account: string,
  rule: string | number,
  version: string,
  key: string,
  signal?: AbortSignal,
) => Api.Delete<Saved & { restriction_id: string | number }>(
  `${siteAccessPath(account)}/${recordId(rule)}`,
  { version },
  { key, signal },
);

const GetCareSchedule: (
  account: string,
  site: Scalar,
  signal?: AbortSignal,
) => Promise<CareScheduleItem[]> = async () => {
  throw new Error('Site care schedules are not implemented yet.');
};

export const Site = {
  GetAll,
  GetOne,
  Create,
  Update,
  Delete,
  GetCareSchedule,
};