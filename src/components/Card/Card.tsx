import type { ComponentProps, ReactNode } from 'react';
import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import { Image, View } from 'react-native';
import { PressableFeedback } from '../PressableFeedback/PressableFeedback';
import { styles } from './style';

type CardProps = {
  imageSource?: ImageSourcePropType;
  children: ReactNode;
  onPress?: NonNullable<ComponentProps<typeof PressableFeedback>['onPress']>;
  style?: StyleProp<ViewStyle>;
};

export const Card = ({ imageSource, children, onPress, style }: CardProps) => {
  const content = (
    <>
      {imageSource ? (
        <Image source={imageSource} resizeMode="cover" style={styles.image} />
      ) : null}
      {children}
    </>
  );

  return onPress ? (
    <PressableFeedback onPress={onPress} style={[styles.card, style]}>
      {content}
    </PressableFeedback>
  ) : (
    <View style={[styles.card, style]}>{content}</View>
  );
};
