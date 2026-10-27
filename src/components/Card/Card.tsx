import type { ReactNode } from 'react';
import type { ImageSourcePropType, PressableProps, StyleProp, ViewStyle } from 'react-native';
import { Image, Pressable, useWindowDimensions, View } from 'react-native';
import { useTheme } from '../../hooks/use-theme';
import { styles } from './style';

type CardProps = {
  imageSource?: ImageSourcePropType;
  children: ReactNode;
  onPress?: NonNullable<PressableProps['onPress']>;
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
    <Pressable accessibilityRole="button" onPress={onPress} style={cardStyle}>
      {content}
    </Pressable>
  ) : (
    <View style={cardStyle}>{content}</View>
  );
};
