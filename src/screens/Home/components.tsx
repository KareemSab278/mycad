import type { AccountInfo, LinkedMachine } from '../../types';
import { MachineGrid } from '../Machines/Components';
import * as C from './../../components';

interface MachineListProps {
  selectedAccount: AccountInfo;
  machines: LinkedMachine[];
  loading: boolean;
  error: string;
  onMachinePress: (entry: LinkedMachine) => void;
}

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


export const MachineList = ({ selectedAccount, machines, loading, error, onMachinePress }: MachineListProps) => {
  return (
    <>
      <C.Typography text={`Machines for ${selectedAccount.company_name}`} variant="title" />
      {loading ? <C.Loader /> : null}
      {error ? <C.Alert tone="error" title="Machines unavailable" message={error} /> : null}
      {!loading && !error && machines.length === 0 ? (
        <C.Typography text="No installed machines are linked to this account." variant="caption" />
      ) : null}
      <MachineGrid
        key={selectedAccount.account_id}
        machines={machines}
        onMachinePress={onMachinePress}
      />
    </>
  );
};