import { Text, View } from 'react-native';
import { styles } from './style';

export type AlertTone = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  title?: string;
  message: string;
  tone?: AlertTone;
}

export const Alert = ({ title, message, tone = 'info' }: AlertProps) =>
  <View accessibilityRole="alert" style={[styles.container, styles[tone]]}>
    {title ? <Text style={styles.title}>{title}</Text> : null}
    <Text>{message}</Text>
  </View>

