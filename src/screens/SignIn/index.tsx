import { useState } from 'react';
import { View } from 'react-native';
import * as C from './../../components';
import { useNav } from './../../helpers/navigation';
import * as T from './../../types';
import { goToPage, signInCall } from './helpers';
import { styles } from './styles';


export const SignIn = () => {
  const [credentials, setCredentials] = useState<T.Login>({ email: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [alertBatch, setAlertBatch] = useState(0);
  const [loading, setLoading] = useState(false);
  const nav = useNav();

  const handleSignIn = async () => {
    setLoading(true)
    try {
      const email = await signInCall(credentials.email, credentials.password);
      if (email) {
        setError('');
        setMessage('Sign in successful (not really)');
        nav.to('/', { params: { email } });
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
