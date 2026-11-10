import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../hooks/use-theme';
import { Buttons } from '../Buttons/Buttons';
import { Modal } from '../Modal/Modal';
import { Typography } from '../Typography/Typography';

type UserModalProps = {
  email: string;
  accountNames?: string[];
  signingOut: boolean;
  signOutError: boolean;
  onSignOut: () => void;
};

export const UserModal = ({
  email,
  accountNames,
  signingOut,
  signOutError,
  onSignOut,
}: UserModalProps) => {
  const [visible, setVisible] = useState(false);
  const [confirmingSignOut, setConfirmingSignOut] = useState(false);
  const theme = useTheme();
  const initial = email.trim().charAt(0).toUpperCase() || '?';

  const closeModal = () => {
    if (signingOut) return;
    setVisible(false);
    setConfirmingSignOut(false);
  };

  return (
    <>
      <Buttons.Circle
        accessibilityRole="button"
        accessibilityLabel="Open signed-in account details"
        accessibilityHint="Shows account details and sign-out options"
        onPress={() => setVisible(true)}
        label={initial}
      />

      <Modal visible={visible} onClose={closeModal} canClose={!signingOut}>
        {confirmingSignOut ? (
          <View style={styles.content}>
            <Typography text="Sign out?" variant="title" />
            <Typography text="Are you sure you want to sign out?" variant="body" />
            {signOutError ? (
              <Typography
                text="Unable to sign out. Please try again."
                style={{ color: theme.buttonDanger }}
              />
            ) : null}
            <Buttons.Danger
              label={signingOut ? 'Signing out...' : 'Sign Out'}
              onPress={onSignOut}
              isDisabled={signingOut}
            />
            <Buttons.Secondary
              label="Cancel"
              onPress={() => setConfirmingSignOut(false)}
              isDisabled={signingOut}
            />
          </View>
        ) : (
          <View style={styles.content}>
            <View style={[styles.avatarLarge, { backgroundColor: theme.button }]}>
              <Typography
                text={initial}
                style={{ color: theme.buttonText, fontSize: 28, fontWeight: '700' }}
              />
            </View>
            <Typography text="Signed-in account" variant="title" />
            <Typography text={email} variant="body" />
            {accountNames?.length ? (
              <>
                <Typography text={`Business Account${accountNames.length > 1 ? 's' : ''}:`} variant="caption" />
                <Typography text={`${accountNames.map(name => name.trim()).join(', ')}`} variant="caption" />
              </>
            ) : null}
            <Buttons.Danger
              label="Sign Out"
              onPress={() => {
                setConfirmingSignOut(true);
              }}
            />
            <Buttons.Secondary label="Close" onPress={closeModal} />
          </View>
        )}
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  avatarLarge: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 40,
    height: 80,
    justifyContent: 'center',
    marginBottom: 4,
    width: 80,
  },
  content: {
    alignItems: 'center',
    gap: 12,
  },
});
