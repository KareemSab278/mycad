import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Auth } from '../api';

type AuthStatus = 'loading' | 'signedIn' | 'signedOut';

type AuthContextValue = {
  status: AuthStatus;
  setStatus: (status: AuthStatus) => void;
  reauthenticationRequired: boolean;
  setReauthenticationRequired: (required: boolean) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [reauthenticationRequired, setReauthenticationRequired] = useState(false);

  const handleUnauthorized = useCallback(async (signOut: boolean) => {
    if (signOut) {
      try {
        await Auth.LogOut();
      } catch (error) {
        console.error('Unable to clear credentials after unauthorized response:', error);
      }
      setReauthenticationRequired(false);
      setStatus('signedOut');
    } else if (status === 'signedIn') {
      setReauthenticationRequired(true);
    }
  }, [status]);

  useEffect(() => {
    let active = true;

    void Auth.CheckToken()
      .then((valid) => {
        if (active) setStatus(valid ? 'signedIn' : 'signedOut');
      })
      .catch((error: unknown) => {
        console.error('Unable to validate the saved API session:', error);
        if (active) setStatus('signedOut');
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    Auth.SetUnauthorizedHandler(handleUnauthorized);
    return () => Auth.SetUnauthorizedHandler(null);
  }, [handleUnauthorized]);

  return (
    <AuthContext.Provider
      value={{
        status,
        setStatus,
        reauthenticationRequired,
        setReauthenticationRequired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider.');
  return context;
};
