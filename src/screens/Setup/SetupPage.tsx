import { useEffect, useState } from 'react';
import * as C from '../../components';
import { applySiteSetup, getSetupTargets, needsSetup, type SetupTarget } from '../../helpers/setup';
import * as Ls from '../../storage';
import type { SetupProfile, SingleAccountInfo } from '../../types';
import { SetupStepModal } from './Components';

const emptyContact = () => ({
  name: '',
  phone: '',
  email: '',
  from: '',
  to: '',
  days: [] as string[],
});

const emptyProfile = (): SetupProfile => ({
  openingDays: [],
  businessHours: [{ shiftName: '', from: '09:00', to: '17:00' }],
  siteRestrictions: [],
  allergies: [],
  contacts: {
    Emergency: emptyContact(),
    Service: emptyContact(),
    Accounting: emptyContact(),
    Other: emptyContact(),
  },
});

const steps = ['Opening days', 'Shift & hours', 'Site access', 'Allergies', 'Contacts'];

type SetupPageProps = {
  // 'required' lists only sites flagged for setup; 'edit' lists every site.
  mode?: 'required' | 'edit';
  onComplete?: () => void;
  onCancel?: () => void;
  onSkip?: () => void;
};

interface SkipSetupDialogProps {
  confirmSkipDialogVisible: boolean;
  setConfirmSkipDialogVisible: (visible: boolean) => void;
  submitting: boolean;
  error: string;
  onSkip: () => void;
}

const SkipSetupDialog = ({ confirmSkipDialogVisible, setConfirmSkipDialogVisible, submitting, error, onSkip }: SkipSetupDialogProps) => (
  <C.Dialog
    visible={confirmSkipDialogVisible}
    onClose={() => setConfirmSkipDialogVisible(false)}
    canClose={!submitting}
    title="Skip setup?"
    description="Are you sure you want to skip the setup and go to Home? You can always complete it later from your profile."
  >
    {error ? (
      <C.Typography
        text="Unable to skip setup. Please try again."
        style={{ color: '#B42318' }}
      />
    ) : null}
    <C.Buttons.Secondary
      label="Cancel"
      onPress={() => setConfirmSkipDialogVisible(false)}
      isDisabled={submitting}
    />
    <C.Buttons.Danger
      label={submitting ? 'Skipping...' : 'Skip setup'}
      onPress={onSkip}
      isDisabled={submitting}
    />
  </C.Dialog>
)
export const SetupPage = ({ mode = 'required', onComplete, onCancel, onSkip }: SetupPageProps) => {
  const [account, setAccount] = useState<SingleAccountInfo | null>(null);
  const [selectedKey, setSelectedKey] = useState('');
  const [profile, setProfile] = useState<SetupProfile>(emptyProfile);
  const [step, setStep] = useState(-1);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [nextVisible, setNextVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmSkipDialogVisible, setConfirmSkipDialogVisible] = useState(false);
  const targets = getSetupTargets(account, mode === 'required');
  const selected = getSetupTargets(account, false).find((item) => item.key === selectedKey);
  const accountNames = [...new Set(targets.map((item) => item.accountName))];

  useEffect(() => {
    let active = true;
    void Ls.Creds.get().then((saved) => {
      if (active && saved) setAccount(saved);
    });
    return () => {
      active = false;
    };
  }, []);

  const startSetup = (target: SetupTarget) => {
    setSelectedKey(target.key);
    setProfile(target.profile ?? emptyProfile());
    setError('');
    setStep(0);
  };

  const closeSetup = () => {
    setConfirmationVisible(false);
    setSelectedKey('');
    setStep(-1);
  };

  const saveSetup = async () => {
    if (!selected) return;
    setSubmitting(true);
    setError('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const current = await Ls.Creds.get();
      if (!current) throw new Error('No signed-in account was found.');

      await Ls.Creds.save(applySiteSetup(current, selected.accountName, selected.siteName, profile));

      const saved = await Ls.Creds.get();
      const savedSite = saved?.business_accounts
        .find((item) => item.name === selected.accountName)
        ?.sites.find((site) => site.name === selected.siteName);
      if (!saved || !savedSite?.setup_profile || savedSite.setup_required) {
        throw new Error('Your setup could not be saved. Please try again.');
      }

      setAccount(saved);
      setConfirmationVisible(false);
      setStep(-1);
      setSelectedKey('');
      if (mode === 'required' && !needsSetup(saved)) onComplete?.();
      else setNextVisible(true);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save setup details.');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <C.Container contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>

      {confirmSkipDialogVisible && <SkipSetupDialog
          confirmSkipDialogVisible={confirmSkipDialogVisible}
          setConfirmSkipDialogVisible={setConfirmSkipDialogVisible}
          submitting={submitting}
          error={error}
          onSkip={() => onSkip?.()}/>}

      <C.Box
        title={mode === 'required' ? "It seems your profile isn't set up yet" : 'Edit your setup'}
        description={targets.length > 1 ? 'Choose which account and site you want to set up.' : undefined}
      >
        <C.Typography text={`It's only ${steps.length} steps to set up each site.`} />
        {onCancel && <C.Buttons.Secondary label={mode === 'required' ? 'Back' : 'Cancel'} onPress={onCancel} />}
        {onSkip && <C.Buttons.Primary label="Skip setup and go to Home" onPress={() => setConfirmSkipDialogVisible(true)} />}
      </C.Box>

      {accountNames.map((accountName) => (
        <C.Box key={accountName} title={accountName}>
          {targets.filter((item) => item.accountName === accountName).map((item) => (
            <C.Buttons.Primary
              key={item.key}
              label={`${item.profile ? 'Edit' : 'Set up'} ${item.siteName} site`}
              onPress={() => startSetup(item)}
            />
          ))}
        </C.Box>
      ))}

      <C.Dialog
        visible={nextVisible}
        onClose={() => setNextVisible(false)}
        canClose={false}
        title="Setup saved"
        description={
          targets.length
            ? `Your details were saved. ${mode === 'required' ? `${targets.length} more site${targets.length > 1 ? 's' : ''} still need${targets.length > 1 ? '' : 's'} setup.` : ''} Would you like to set up another?`
            : 'Your details were saved.'
        }
      >
        {targets.length > 0 && (
          <C.Buttons.Secondary label="Set up another" onPress={() => setNextVisible(false)} />
        )}
        <C.Buttons.Primary
          label={mode === 'required' ? 'Continue to home' : 'Done'}
          onPress={() => { setNextVisible(false); onComplete?.(); }}
        />
      </C.Dialog>

      <SetupStepModal
        visible={step >= 0}
        step={step}
        steps={steps}
        profile={profile}
        siteLabel={selected?.label ?? ''}
        onProfileChange={setProfile}
        onBack={() => setStep((current) => Math.max(0, current - 1))}
        onNext={() => setStep((current) => current + 1)}
        onEdit={(index) => setStep(index)}
        onSubmit={() => setConfirmationVisible(true)}
        onClose={closeSetup}
        confirmationVisible={confirmationVisible}
        submitting={submitting}
        error={error}
        onCloseConfirmation={() => {
          if (!submitting) setConfirmationVisible(false);
        }}
        onConfirm={saveSetup}
      />
    </C.Container>
  );
};

export default SetupPage;
