import * as C from './../../components';

interface SignOutDialogProps {
  showSignOutAlert: boolean;
  closeSignOutDialog: () => void;
  signingOut: boolean;
  signOutError: boolean;
  handleSignOutConfirm: () => void;
}

export const SignOutDialog = ({ showSignOutAlert, closeSignOutDialog, signingOut, signOutError, handleSignOutConfirm }: SignOutDialogProps) => (
  <C.Dialog
    visible={showSignOutAlert}
    onClose={closeSignOutDialog}
    canClose={!signingOut}
    title="Sign out?"
    description="Are you sure you want to sign out?"
  >
    {signOutError && (
      <C.Typography
        text="Unable to sign out. Please try again."
        style={{ color: '#B42318' }}
      />
    )}
    <C.Buttons.Secondary
      label="Cancel"
      onPress={closeSignOutDialog}
      isDisabled={signingOut}
    />
    <C.Buttons.Danger
      label={signingOut ? 'Signing out...' : 'Sign Out'}
      onPress={handleSignOutConfirm}
      isDisabled={signingOut}
    />
  </C.Dialog>
);
