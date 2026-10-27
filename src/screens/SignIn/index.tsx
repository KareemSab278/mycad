import { useState } from 'react';
import { View } from 'react-native';
import * as C from './../../components';
import * as T from './../../types';
import { goToPage } from './helpers';

import { styles } from './styles';

const signInCall = (email: string, password: string): boolean => {
  if (!email.trim() || !password.trim()) throw new Error('Email and password are required.');
  if (!email.includes('@')) throw new Error('Invalid email address.');
  if (password.length < 6) throw new Error('Password must be at least 6 characters long.');

  else return true;
};

export const SignIn = () => {
  const [credentials, setCredentials] = useState<T.Login>({ email: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [alertBatch, setAlertBatch] = useState(0);

  const handleSignIn = () => {
    try {
      if (signInCall(credentials.email, credentials.password)) { setError(''); setMessage('Sign in successful (not really)'); }
      
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setAlertBatch((batch) => batch + 1);
    }
  };

  return (
    <C.Container>
      <C.Box>
        <C.Typography text="Sign in" variant="heading" />
        <C.InputField
          label="Email"
          placeholder="Enter your email"
          value={credentials.email}
          onChangeText={(text) => setCredentials({ ...credentials, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
        />
        <C.InputField
          label="Password"
          placeholder="Enter your password"
          value={credentials.password}
          onChangeText={(text) => setCredentials({ ...credentials, password: text })}
          secureTextEntry
          autoComplete="current-password"
          textContentType="password"
        />

        <C.LinkButton
          style={styles.forgotPassword}
          text="Forgot password?"
          onPress={() => { goToPage('forgot') }}
        />

        <C.Buttons.Primary label="Sign in" onPress={handleSignIn} />

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

      {
        (error || message) &&
        <C.Alert
          key={alertBatch}
          tone={error ? 'error' : 'info'}
          title={error ? 'Sign in failed' : 'Info'}
          message={error ? error : message}
        />
      }
    </C.Container>
  );
};
