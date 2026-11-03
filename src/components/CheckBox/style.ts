import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  box: {
    alignItems: 'center',
    borderColor: '#98A2B3',
    borderRadius: 50,
    borderWidth: 1,
    height: 22,
    marginTop: 10,
    justifyContent: 'center',
    width: 22,
  },
  boxChecked: {
    backgroundColor: '#008cff',
    borderColor: '#0084ff',
  }
});
