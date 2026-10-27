import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    gap: 8,
    left: 12,
    position: 'absolute',
    right: 12,
  },
  container: {
    borderLeftWidth: 4,
    borderRadius: 8,
    maxWidth: 480,
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
