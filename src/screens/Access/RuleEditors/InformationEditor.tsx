import { OperatorInformation } from './OperatorInformation';
import type { InformationProps } from './types';

export const InformationEditor = (props: InformationProps) => (
  <OperatorInformation {...props} isInformationRule />
);
