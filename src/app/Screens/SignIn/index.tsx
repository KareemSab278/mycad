import { useState } from 'react';
import { KeyboardAvoidingView, Linking, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as C from './../../components';
import { styles } from './styles';

const keyboardAvoidingBehavior =
  Platform.OS === 'ios' ? 'padding' : Platform.OS === 'android' ? 'height' : undefined;

const goToPage = (page: 'forgot' | 'join') => {
  const url = page === 'forgot'
    ? 'https://my.coin-a-drink.co.uk/forgotten_password.php'
    : 'https://coin-a-drink.co.uk/contact-us/';

  return Linking.openURL(url);
};

export const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView behavior={keyboardAvoidingBehavior} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <C.Container>
          <C.Box title="Sign in">
            <View style={styles.form}>
              <C.InputField
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
              />
              <C.InputField
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="current-password"
                textContentType="password"
              />

              <C.LinkButton
                style={styles.forgotPassword}
                text="Forgot password?"
                onPress={() => { goToPage('forgot') }}
              />

              <C.Buttons.Primary label="Sign in" />

              <View style={styles.joinUs}>
                <C.Typography
                  text="New here?"
                  variant="caption"
                />
                <C.LinkButton
                  text="Join us"
                  onPress={() => { goToPage('join') }}
                />
              </View>
            </View>
          </C.Box>
        </C.Container>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};
