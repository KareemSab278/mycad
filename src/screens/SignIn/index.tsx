import { useState } from 'react';
import { View } from 'react-native';
import * as A from '../../api';
import { useNav } from '../../hooks/use-nav';
import type { LoginCredentials } from '../../types';
import * as C from './../../components';
import { useAuth } from './../../hooks/auth-context';
import { goToPage } from './helpers';
import { styles } from './styles';

type SignInProps = {
  reauthentication?: boolean;
  onSignedIn?: (email: string) => void;
};

export const SignIn = ({ reauthentication = false, onSignedIn }: SignInProps) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({ email: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [alertBatch, setAlertBatch] = useState(0);
  const [loading, setLoading] = useState(false);
  const nav = useNav();
  const { setStatus } = useAuth();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const user = await A.Auth.LogIn(credentials.email, credentials.password);
      setError('');
      setMessage('Signed in successfully.');
      if (onSignedIn) {
        onSignedIn(user.email);
      } else {
        setStatus('signedIn');
        nav.replace('/', { params: { email: user.email } });
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
      setAlertBatch((batch) => batch + 1);
    }
  };

  return (
    <C.Container>
      {loading ?
        <C.Box
          title="Signing in..."
        >
          <C.Loader />
        </C.Box>
        :
        <C.Box>
          {reauthentication ? (
            <C.Typography
              text="Your session expired. Sign in again to continue; your current page and unsaved work will stay open."
              variant="caption"
            />
          ) : null}
          <C.Typography text="Sign in" variant="heading" />
          <C.InputField
            label="Email"
            placeholder="Enter your email"
            value={credentials.email}
            onChangeText={(text) => setCredentials((current) => Object.assign({}, current, { email: text }))}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
          />
          <C.InputField
            label="Password"
            placeholder="Enter your password"
            value={credentials.password}
            onChangeText={(text) => setCredentials((current) => Object.assign({}, current, { password: text }))}
            secureTextEntry
            autoComplete="current-password"
            textContentType="password"
          />

          {!reauthentication ? (
            <C.LinkButton
              style={styles.forgotPassword}
              text="Forgot password?"
              onPress={() => { goToPage('forgot'); }}
            />
          ) : null}

          <C.Buttons.Primary label="Sign in" onPress={handleSignIn} />

          {!reauthentication ? (
            <View style={styles.joinUs}>
              <C.Typography text="New here?" variant="caption" />
              <C.LinkButton text="Join us" onPress={() => { goToPage('join'); }} />
            </View>
          ) : null}
        </C.Box>
      }
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
