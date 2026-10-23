import { ChartRenderer } from './ChartRenderer';
import type { ChartProps } from './types';

export const HorizontalBar = (props: ChartProps) => (
  <ChartRenderer kind="horizontal-bar" {...props} />
);