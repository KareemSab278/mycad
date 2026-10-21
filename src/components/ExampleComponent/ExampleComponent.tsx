import { Button as HeroButton } from 'heroui-native';
import type { ButtonRootProps } from 'heroui-native';
import { styles } from './style';

type ExampleComponentProps = {
  label?: string;
  onPress: NonNullable<ButtonRootProps['onPress']>;
  isDisabled?: boolean;
};

// Example: <ExampleComponent label="Save" onPress={saveDraft} />.
export const ExampleComponent = ({
  label = 'Press me',
  onPress,
  isDisabled = false,
}: ExampleComponentProps) => {
  return (
    <HeroButton
      style={styles.button}
      onPress={onPress}
      isDisabled={isDisabled}
      feedbackVariant="scale-ripple"
      animation={{ scale: { value: 0.9, ignoreScaleCoefficient: true } }}
    >
      <HeroButton.Label>{label}</HeroButton.Label>
    </HeroButton>
  );
};
