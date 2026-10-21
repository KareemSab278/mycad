import { Slider as HeroSlider } from 'heroui-native';
import type { SliderValue } from 'heroui-native';
import { styles } from './style';

type SliderProps = {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  accessibilityLabel?: string;
  isDisabled?: boolean;
};

// Use for selecting a value across a bounded numeric range.
export const Slider = ({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  accessibilityLabel = 'Slider',
  isDisabled = false,
}: SliderProps) => {
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) {
    throw new Error('Slider max must be a finite number greater than min.');
  }
  if (!Number.isFinite(step) || step <= 0) {
    throw new Error('Slider step must be greater than zero.');
  }

  const safeValue = Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min;
  const handleChange = (nextValue: SliderValue) => {
    const next = typeof nextValue === 'number' ? nextValue : nextValue[0];
    if (next !== undefined && Number.isFinite(next)) {
      onValueChange(next);
    }
  };

  return (
    <HeroSlider
      value={safeValue}
      onChange={handleChange}
      minValue={min}
      maxValue={max}
      step={step}
      isDisabled={isDisabled}
      style={styles.root}
    >
      <HeroSlider.Track>
        <HeroSlider.Fill />
        <HeroSlider.Thumb accessibilityLabel={accessibilityLabel} />
      </HeroSlider.Track>
    </HeroSlider>
  );
};
