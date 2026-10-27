import { useState } from 'react';
import { View } from 'react-native';
import * as C from './../../components';
import { goToPage, signIn } from './helpers';

import { styles } from './styles';

export const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
        <C.Container>
          <C.Box title="Sign in">
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

              <C.Buttons.Primary label="Sign in" onPress={() => { signIn() }} />

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
          </C.Box>
        </C.Container>
  );
};
