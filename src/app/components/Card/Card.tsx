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
  const content = imageSource ? (
    <>
      <View style={styles.imageContainer}>
        <Image source={imageSource} resizeMode="cover" style={styles.image} />
      </View>
      <View style={styles.imageContent}>{children}</View>
    </>
  ) : children;
  const cardStyle = [styles.card, imageSource ? styles.imageCard : undefined, style];

  return onPress ? (
    <PressableFeedback onPress={onPress} style={cardStyle}>
      {content}
    </PressableFeedback>
  ) : (
    <View style={cardStyle}>{content}</View>
  );
};
