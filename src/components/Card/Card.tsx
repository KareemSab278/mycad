import type { ComponentProps, ReactNode } from 'react';
import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import { Image, useWindowDimensions, View } from 'react-native';
import { useTheme } from '../../hooks/use-theme';
import { PressableFeedback } from '../PressableFeedback/PressableFeedback';
import { styles } from './style';

type CardProps = {
  imageSource?: ImageSourcePropType;
  children: ReactNode;
  onPress?: NonNullable<ComponentProps<typeof PressableFeedback>['onPress']>;
  style?: StyleProp<ViewStyle>;
};

export const Card = ({ imageSource, children, onPress, style }: CardProps) => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isCompact = width < 600;
  const content = imageSource ? (
    <>
      <View style={isCompact ? styles.compactImageContainer : styles.imageContainer}>
        <Image source={imageSource} resizeMode="cover" style={styles.image} />
      </View>
      <View style={styles.imageContent}>{children}</View>
    </>
  ) : children;
  const cardStyle = [
    styles.card,
    { backgroundColor: theme.backgroundElement, borderColor: theme.border },
    imageSource ? (isCompact ? styles.compactImageCard : styles.imageCard) : undefined,
    style,
  ];

  return onPress ? (
    <PressableFeedback onPress={onPress} style={cardStyle}>
      {content}
    </PressableFeedback>
  ) : (
    <View style={cardStyle}>{content}</View>
  );
};
