import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 16,
  },
  imageCard: {
    flexDirection: 'row',
    padding: 0,
  },
  imageContainer: {
    minHeight: 140,
    position: 'relative',
    width: '40%',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  imageContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});
