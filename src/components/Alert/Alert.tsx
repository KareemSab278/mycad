import { Text, View } from 'react-native';
import { styles } from './style';

export type AlertTone = 'info' | 'success' | 'warning' | 'error';

export const Alert = ({
  title,
  message,
  tone = 'info',
}: {
  title?: string;
  message: string;
  tone?: AlertTone;
}) => {
  const toneStyle = {
    info: styles.info,
    success: styles.success,
    warning: styles.warning,
    error: styles.error,
  }[tone];

  return (
    <View accessibilityRole="alert" style={[styles.container, toneStyle]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <Text>{message}</Text>
    </View>
  );
};
