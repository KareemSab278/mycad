import type { BusinessAccount } from '@/types';
import { View } from 'react-native';
import { useNav } from '../../helpers/navigation';
import * as C from './../../components';

interface MachineListProps {
  selectedBusinessAccount: BusinessAccount;
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


export const MachineList = ({ selectedBusinessAccount }: MachineListProps) => {
  const nav = useNav();
  return (
    <>
      <C.Typography text={`Machines On ${selectedBusinessAccount.name}`} variant="title" />
      {selectedBusinessAccount.sites.length ? (
        selectedBusinessAccount.sites.map((site) => (
          <View key={site.name}>
            {site.machines.length ? (
              site.machines.map((machine) => (
                <C.Box key={machine.id ?? machine.name} title={machine.name}>
                  {machine.id ? (
                    <C.Typography text={`Machine ID: ${machine.id}`} variant="caption" />
                  ) : null}
                  {machine.model ? (
                    <C.Typography text={`Model: ${machine.model}`} variant="body" />
                  ) : null}
                  {machine.status ? (
                    <C.Typography text={`Status: ${machine.status}`} variant="body" />
                  ) : null}
                  {machine.arrangement ? (
                    <C.Typography text={`Arrangement: ${machine.arrangement}`} variant="body" />
                  ) : null}
                  {machine.nextDelivery ? (
                    <C.Typography text={`Next delivery: ${machine.nextDelivery}`} variant="caption" />
                  ) : null}
                  {machine.lastServiced ? (
                    <C.Typography text={`Last serviced: ${machine.lastServiced}`} variant="caption" />
                  ) : null}
                  <C.Buttons.Secondary
                    label="View machine"
                    onPress={() => nav.to('/Machines', {
                      params: { machine_id: machine.id ?? machine.name },
                    })}
                  />
                </C.Box>
              ))
            ) : (
              <C.Typography text="No machines are available at this site." variant="caption" />
            )}
          </View>
        ))
      ) : (
        <C.Box title="Sites">
          <C.Typography text="No sites are available for this account." variant="caption" />
        </C.Box>
      )}
    </>
  );
};