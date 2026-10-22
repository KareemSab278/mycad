import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(16, 24, 40, 0.45)',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  backdropPressable: {
    ...StyleSheet.absoluteFill,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    gap: 12,
    maxHeight: '85%',
    maxWidth: 480,
    minHeight: '10%',
    padding: 20,
    width: '100%',
    zIndex: 1,
  },
});
