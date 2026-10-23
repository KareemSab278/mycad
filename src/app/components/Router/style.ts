import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  navigation: {
    borderTopWidth: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 4,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  navigationButton: {
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
    paddingHorizontal: 4,
  },
  content: {
    alignItems: 'stretch',
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
    paddingHorizontal: 5,
    paddingVertical: 0,
    width: '100%',
  },
});