import type { ComponentProps, ReactNode } from 'react';
import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import { Image, View } from 'react-native';
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
  const content = imageSource ? (
    <>
      <View style={styles.imageContainer}>
        <Image source={imageSource} resizeMode="cover" style={styles.image} />
      </View>
      <View style={styles.imageContent}>{children}</View>
    </>
  ) : children;
  const cardStyle = [
    styles.card,
    { backgroundColor: theme.backgroundElement, borderColor: theme.border },
    imageSource ? styles.imageCard : undefined,
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
