import * as C from '../../../components';
import type { AccountMachine } from './types';


type MachineFilterProps = {
    showFilters: boolean;
    machines: AccountMachine[];
    selectedAccount: string;
    setSelectedAccount: (accountId: string) => void;
    modelFilters: string[];
    selectedModel: string;
    setSelectedModel: (model: string) => void;
};

export const MachineFilters = ({ showFilters, machines, selectedAccount, setSelectedAccount, modelFilters, selectedModel, setSelectedModel }: MachineFilterProps) => {
    return (
        <>
            {showFilters ? (<C.Box title="Filters" >
                {machines.length > 1 && (
                    <C.Selector
                        label="Filter by account"
                        placeholder="All accounts"
                        options={[
                            { label: 'All accounts', value: '' },
                            ...[...new Set(machines.map(({ account }) => account.account_id))].map((accountId) => {
                                const account = machines.find(({ account }) => account.account_id === accountId)!.account;
                                return { label: `Account: ${account.company_name}`, value: account.account_id };
                            }),
                        ]}
                        value={selectedAccount}
                        onValueChange={setSelectedAccount}
                    />
                )}

                {modelFilters.length > 1 && (
                    <C.Selector
                        label="Filter by model"
                        placeholder="All models"
                        options={[
                            { label: 'All models', value: '' },
                            ...modelFilters.map((model) => ({ label: `Model: ${model}`, value: model })),
                        ]}
                        value={selectedModel}
                        onValueChange={setSelectedModel}
                    />
                )}
            </C.Box >
            ) : null}
        </>

    )
}