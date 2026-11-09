import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  page: {
    gap: 16,
    paddingBottom: 24,
  },
  header: {
    gap: 8,
  },
  cardContent: {
    gap: 12,
  },
  orderRow: {
    alignItems: 'center',
    borderTopWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 12,
  },
  productRow: {
    alignItems: 'center',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
  },
  catalogModal: {
    maxHeight: '85%',
  },
  catalogList: {
    flexShrink: 1,
  },
  itemDetails: {
    flex: 1,
    gap: 4,
    minWidth: 140,
  },
  quantityControls: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
});
