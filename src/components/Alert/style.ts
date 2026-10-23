import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 12,
    width: '100%',
  },
  info: {
    backgroundColor: '#addcff',
    borderLeftColor: '#2085f1',
  },
  success: {
    backgroundColor: '#bbfcd6',
    borderLeftColor: '#0cb547',
  },
  warning: {
    backgroundColor: '#feeebe',
    borderLeftColor: '#F79009',
  },
  error: {
    backgroundColor: '#ffd2ce',
    borderLeftColor: '#eb3629',
  },
  title: {
    color: '#344054',
    fontSize: 14,
    fontWeight: '500',
  },
});
