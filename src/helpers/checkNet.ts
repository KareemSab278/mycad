import * as Network from 'expo-network';

export const checkInternetConnection = async (): Promise<boolean> => {
  const state = await Network.getNetworkStateAsync();
  return (
    state.isConnected === true &&
    state.isInternetReachable === true
  );
}