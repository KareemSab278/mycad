import { ScrollView, View } from 'react-native';
import * as C from '../../components';
import type { SetupProfile } from '../../types';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const accessOptions = ['DBS check required', 'Site induction required', 'Photo ID required', 'Safety footwear required'];
const allergyOptions = ['No nuts', 'May contain traces of nuts'];
const categories = ['Emergency', 'Service', 'Accounting', 'Other'] as const;

type SetupStepModalProps = {
  visible: boolean;
  step: number;
  steps: string[];
  profile: SetupProfile;
  siteNames: string[];
  onProfileChange: (profile: SetupProfile) => void;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
  onEdit: (step: number) => void;
  onSubmit: () => void;
};

const toggleValue = (values: string[], value: string) =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

const Checklist = ({
  options,
  values,
  onChange,
}: {
  options: string[];
  values: string[];
  onChange: (values: string[]) => void;
}) => (
  <View style={{ gap: 8 }}>
    {options.map((option) => (
      <C.CheckBox
        key={option}
        label={option}
        checked={values.includes(option)}
        onValueChange={() => onChange(toggleValue(values, option))}
      />
    ))}
  </View>
);

const ReviewRow = ({ label, value }: { label: string; value: string }) => (
  <View style={{ gap: 4 }}>
    <C.Typography text={label} variant="caption" />
    <C.Typography text={value} />
  </View>
);

export const SetupStepModal = ({
  visible,
  step,
  steps,
  profile,
  siteNames,
  onProfileChange,
  onBack,
  onNext,
  onSkip,
  onEdit,
  onSubmit,
}: SetupStepModalProps) => {
  const updateContact = (
    category: (typeof categories)[number],
    field: keyof SetupProfile['contacts'][typeof categories[number]],
    value: string | string[],
  ) => {
    onProfileChange({
      ...profile,
      contacts: {
        ...profile.contacts,
        [category]: { ...profile.contacts[category], [field]: value },
      },
    });
  };

  const isReview = step === steps.length;
  const title = isReview ? 'Review your setup' : steps[step] ?? 'Setup';

  return (
    <C.Modal visible={visible} canClose={false} onClose={() => undefined}>
      <C.Typography text={title} variant="title" />
      <C.Typography
        text={isReview ? 'Check your answers. Select Edit to make changes.' : `Step ${step + 1} of ${steps.length}`}
        variant="caption"
      />

      <ScrollView
        style={{ flexShrink: 1, maxHeight: '65%' }}
        contentContainerStyle={{ gap: 16, paddingBottom: 4 }}
        keyboardShouldPersistTaps="handled"
      >
        {step === 0 && (
          <>
            <C.Typography text="Which days is your business open?" />
            <Checklist
              options={days}
              values={profile.openingDays}
              onChange={(openingDays) => onProfileChange({ ...profile, openingDays })}
            />
          </>
        )}

        {step === 1 && (
          <>
            <C.Typography text="Add a shift pattern and your usual business hours." />
            <C.TextField
              label="Shift name"
              placeholder="Day shift"
              value={profile.businessHours.shiftName}
              onChangeText={(shiftName) => onProfileChange({
                ...profile,
                businessHours: { ...profile.businessHours, shiftName },
              })}
            />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <C.TextField
                label="Business opens"
                placeholder="09:00"
                value={profile.businessHours.from}
                onChangeText={(from) => onProfileChange({
                  ...profile,
                  businessHours: { ...profile.businessHours, from },
                })}
              />
              <C.TextField
                label="Business closes"
                placeholder="17:00"
                value={profile.businessHours.to}
                onChangeText={(to) => onProfileChange({
                  ...profile,
                  businessHours: { ...profile.businessHours, to },
                })}
              />
            </View>
          </>
        )}

        {step === 2 && (
          <>
            <C.Typography text="Select any access requirements for each site." />
            {siteNames.length === 0 ? (
              <C.Typography text="No sites are linked to this account yet." variant="caption" />
            ) : siteNames.map((siteName) => (
              <C.Box key={siteName} title={siteName}>
                <Checklist
                  options={accessOptions}
                  values={profile.siteRestrictions[siteName] ?? []}
                  onChange={(restrictions) => onProfileChange({
                    ...profile,
                    siteRestrictions: { ...profile.siteRestrictions, [siteName]: restrictions },
                  })}
                />
              </C.Box>
            ))}
          </>
        )}

        {step === 3 && (
          <>
            <C.Typography text="Select any allergy information that applies to your sites." />
            <Checklist
              options={allergyOptions}
              values={profile.allergies}
              onChange={(allergies) => onProfileChange({ ...profile, allergies })}
            />
          </>
        )}

        {step === 4 && (
          <>
            <C.Typography text="Add a contact for each area. Contact details and availability can be updated later." />
            {categories.map((category) => {
              const contact = profile.contacts[category];
              return (
                <C.Box key={category} title={`${category} contact`}>
                  <C.TextField
                    label="Name"
                    placeholder="Contact name"
                    value={contact.name}
                    onChangeText={(name) => updateContact(category, 'name', name)}
                  />
                  <C.TextField
                    label="Phone"
                    placeholder="Phone number"
                    keyboardType="phone-pad"
                    value={contact.phone}
                    onChangeText={(phone) => updateContact(category, 'phone', phone)}
                  />
                  <C.TextField
                    label="Email"
                    placeholder="name@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={contact.email}
                    onChangeText={(email) => updateContact(category, 'email', email)}
                  />
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <C.TextField
                      label="Available from"
                      placeholder="09:00"
                      value={contact.from}
                      onChangeText={(from) => updateContact(category, 'from', from)}
                    />
                    <C.TextField
                      label="Available to"
                      placeholder="17:00"
                      value={contact.to}
                      onChangeText={(to) => updateContact(category, 'to', to)}
                    />
                  </View>
                  <C.Typography text="Available days" variant="caption" />
                  <Checklist
                    options={days}
                    values={contact.days}
                    onChange={(contactDays) => updateContact(category, 'days', contactDays)}
                  />
                </C.Box>
              );
            })}
          </>
        )}

        {isReview && (
          <>
            {steps.map((label, index) => (
              <C.Box key={label} title={label}>
                <C.Buttons.Ghost label="Edit" onPress={() => onEdit(index)} />
                {index === 0 && (
                  <ReviewRow label="Open days" value={profile.openingDays.join(', ') || 'Not selected'} />
                )}
                {index === 1 && (
                  <>
                    <ReviewRow label="Shift" value={profile.businessHours.shiftName || 'Not set'} />
                    <ReviewRow
                      label="Business hours"
                      value={`${profile.businessHours.from} – ${profile.businessHours.to}`}
                    />
                  </>
                )}
                {index === 2 && (
                  siteNames.length ? siteNames.map((site) => (
                    <ReviewRow
                      key={site}
                      label={site}
                      value={profile.siteRestrictions[site]?.join(', ') || 'No restrictions selected'}
                    />
                  )) : <ReviewRow label="Sites" value="No sites linked" />
                )}
                {index === 3 && (
                  <ReviewRow label="Allergies" value={profile.allergies.join(', ') || 'None selected'} />
                )}
                {index === 4 && categories.map((category) => {
                  const contact = profile.contacts[category];
                  const summary = [contact.name, contact.phone, contact.email].filter(Boolean).join(' · ');
                  return <ReviewRow key={category} label={`${category} contact`} value={summary || 'Not provided'} />;
                })}
              </C.Box>
            ))}
          </>
        )}
      </ScrollView>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        {step > 0 && <C.Buttons.Secondary label="Back" onPress={onBack} />}
        {!isReview ? (
          <>
            <C.Buttons.Ghost label="Skip for now" onPress={onSkip} />
            <C.Buttons.Primary label="Next" onPress={onNext} />
          </>
        ) : (
          <C.Buttons.Primary label="Continue to confirmation" onPress={onSubmit} />
        )}
      </View>
    </C.Modal>
  );
};

type SetupConfirmationModalProps = {
  visible: boolean;
  submitting: boolean;
  error: string;
  onClose: () => void;
  onConfirm: () => void;
};

export const SetupConfirmationModal = ({
  visible,
  submitting,
  error,
  onClose,
  onConfirm,
}: SetupConfirmationModalProps) => (
  <C.Modal visible={visible} onClose={onClose} canClose={!submitting}>
    {submitting ? (
      <>
        <C.Loader />
        <C.Typography text="Saving your setup…" />
      </>
    ) : (
      <>
        <C.Typography text="Submit your setup?" variant="title" />
        <C.Typography text="Your details will be saved to this account. You can update them later." />
        {error ? <C.Alert tone="error" title="Unable to save setup" message={error} /> : null}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <C.Buttons.Secondary label="Review answers" onPress={onClose} />
          <C.Buttons.Primary label="Confirm and submit" onPress={onConfirm} />
        </View>
      </>
    )}
  </C.Modal>
);