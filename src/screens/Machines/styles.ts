import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  page: {
    gap: 16,
    paddingBottom: 24,
  },
  header: {
    gap: 8,
  },
  machineGridContainer: {
    gap: 12,
  },
  machineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  machineTile: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    width: '31%',
  },
  machineImage: {
    height: 100,
    width: '100%',
  },
  machineDetailsImage: {
    height: 100,
    width: 140,
  },
  machineDetailsImageCard: {
    height: 140,
    width: 140,
    paddingRight: 30,
  },
  machineTileContent: {
    gap: 4,
    padding: 8,
  },
  cardContent: {
    gap: 12,
  },
  machineHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  headingText: {
    flex: 1,
    gap: 4,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detail: {
    flexGrow: 1,
    minWidth: '40%',
  },
  actionStack: {
    gap: 8,
  },
  sectionHeading: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  requestRow: {
    borderTopWidth: 1,
    gap: 8,
    paddingTop: 12,
  },
  modalContent: {
    gap: 12,
  },
  summaryInput: {
    minHeight: 100,
  },
});
