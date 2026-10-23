import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  backdropPressable: {
    ...StyleSheet.absoluteFill,
  },
  content: {
    borderColor: '#EAECF0',
    borderWidth: 1,
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
