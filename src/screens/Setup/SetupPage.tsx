import { useEffect, useState } from 'react';
import * as C from '../../components';
import * as Ls from '../../storage';
import type { SetupProfile } from '../../types';
import { SetupConfirmationModal, SetupStepModal } from './Components';

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
  siteRestrictions: {},
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
  onComplete?: () => void;
};

export const SetupPage = ({ onComplete }: SetupPageProps) => {
  const [profile, setProfile] = useState<SetupProfile>(emptyProfile);
  const [siteNames, setSiteNames] = useState<string[]>([]);
  const [step, setStep] = useState(-1);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    void Ls.Creds.get().then((account) => {
      if (!active || !account) return;
      if (account.setup_profile) setProfile(account.setup_profile);
      setSiteNames([...new Set(account.business_accounts.flatMap((business) =>
        business.sites.map((site) => site.name),
      ))]);
    });

    return () => {
      active = false;
    };
  }, []);

  const saveSetup = async () => {
    setSubmitting(true);
    setError('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const account = await Ls.Creds.get();
      if (!account) throw new Error('No signed-in account was found.');

      await Ls.Creds.save({
        ...account,
        setup_required: false,
        setup_profile: profile,
      });

      const savedAccount = await Ls.Creds.get();
      if (
        savedAccount?.setup_required !== false ||
        !savedAccount.setup_profile
      ) {
        throw new Error('Your setup could not be saved. Please try again.');
      }

      setComplete(true);
      setConfirmationVisible(false);
      onComplete?.();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save setup details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <C.Container contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
      <C.Box title="It seems your profile isn't set up yet" >
        {complete ? (
          <>
            <C.Alert tone="success" title="Setup complete" message="Your setup details have been saved." />
            <C.Typography text="You can now continue to your account." />
          </>
        ) : (
          <>
            <C.Typography  text={`It's only ${steps.length} steps to set up your business profile.`} />
            <C.Buttons.Primary label="Let's Begin" onPress={() => setStep(0)} />
          </>
        )}
      </C.Box>

      {!complete && (
        <>
          <SetupStepModal
            visible={step >= 0}
            step={step}
            steps={steps}
            profile={profile}
            siteNames={siteNames}
            onProfileChange={setProfile}
            onBack={() => setStep((current) => Math.max(0, current - 1))}
            onNext={() => setStep((current) => current + 1)}
            onEdit={(index) => setStep(index)}
            onSubmit={() => setConfirmationVisible(true)}
          />
          <SetupConfirmationModal
            visible={confirmationVisible}
            submitting={submitting}
            error={error}
            onClose={() => {
              if (!submitting) setConfirmationVisible(false);
            }}
            onConfirm={saveSetup}
          />
        </>
      )}
    </C.Container>
  );
};

export default SetupPage;
