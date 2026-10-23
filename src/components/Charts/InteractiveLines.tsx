import { ChartRenderer } from './ChartRenderer';
import type { ChartProps } from './types';

export const InteractiveLines = (props: ChartProps) => (
  <ChartRenderer kind="line" {...props} />
);