import { Typography } from '@/components';
import { useState } from 'react';
import { View } from 'react-native';
import { Tabs } from '../../../components/Tabs/Tabs';
import { styles } from './styles';

const authTabs = [
  { label: 'Sign in', value: 'signIn' },
  { label: 'Sign up', value: 'signUp' },
] as const;

type AuthTab = (typeof authTabs)[number]['value'];

export const SignIn = () => {
  const [activeTab, setActiveTab] = useState<AuthTab>('signIn');
  const isSignIn = activeTab === 'signIn';

  return (
    <View style={styles.container}>
      <Tabs items={authTabs} value={activeTab} onValueChange={setActiveTab} />
      <View style={styles.panel}>
        <Typography text={isSignIn ? 'Sign in' : 'Sign up'} variant="title" />
        <Typography text="This is a simple placeholder screen." variant="body" />
      </View>
    </View>
  );
};