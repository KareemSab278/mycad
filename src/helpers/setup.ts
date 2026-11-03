import type { BusinessAccount, SetupProfile, SingleAccountInfo, Site } from '../types';

export type SetupTarget = {
  key: string;
  accountName: string;
  siteName: string;
  label: string;
  required: boolean;
  profile?: SetupProfile;
};

const isSet = (value: boolean | 0 | 1 | undefined) => value === true || value === 1;

// A site needs setup when flagged itself, or when it has no flag and its account is flagged.
export const siteNeedsSetup = (account: BusinessAccount, site: Site) =>
  site.setup_required === undefined ? isSet(account.setup_required) : isSet(site.setup_required);

export const getSetupTargets = (info: SingleAccountInfo | null, onlyRequired = true): SetupTarget[] =>
  (info?.business_accounts ?? []).flatMap((account) =>
    account.sites
      .map((site) => ({
        key: `${account.name}::${site.name}`,
        accountName: account.name,
        siteName: site.name,
        label: `${account.name} – ${site.name}`,
        required: siteNeedsSetup(account, site),
        profile: site.setup_profile,
      }))
      .filter((target) => !onlyRequired || target.required),
  );

export const needsSetup = (info: SingleAccountInfo | null) => getSetupTargets(info).length > 0;

export const applySiteSetup = (
  info: SingleAccountInfo,
  accountName: string,
  siteName: string,
  profile: SetupProfile,
): SingleAccountInfo => ({
  ...info,
  business_accounts: info.business_accounts.map((account) => {
    if (account.name !== accountName) return account;
    const sites = account.sites.map((site) => ({
      ...site,
      setup_required: site.name === siteName ? false : siteNeedsSetup(account, site),
      ...(site.name === siteName ? { setup_profile: profile } : {}),
    }));
    return { ...account, sites, setup_required: sites.some((site) => site.setup_required === true) };
  }),
});
