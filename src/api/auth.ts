import * as LS from '../storage';
import {
  Api,
  createApiError,
  isApiError,
  isValidToken,
  setUnauthorizedHandler,
} from './apiMethods';
import type { UnauthorizedHandler } from './apiMethods';
import type { LoginSession, Profile } from '../types';

const clearCredentials = async () => {
  await LS.Creds.removeToken();
  await LS.Creds.remove();
};

const LogIn = async (email: string, password: string, signal?: AbortSignal): Promise<Profile> => {
  const session = await Api.Post<LoginSession>(
    '/auth/login',
    { email, password },
    { authenticated: false, signal },
  );

  if (
    session === null ||
    typeof session !== 'object' ||
    session.token_type !== 'Bearer' ||
    !isValidToken(session.access_token) ||
    typeof session.user?.email !== 'string'
  ) {
    throw createApiError(502, 'The API did not return a valid session.');
  }

  await LS.Creds.saveToken(session.access_token);
  if (await LS.Creds.getToken() !== session.access_token) {
    throw new Error('Could not save your session. Please try again.');
  }

  return session.user;
};

const CheckToken = async (signal?: AbortSignal): Promise<boolean> => {
  const token = await LS.Creds.getToken();
  if (!isValidToken(token)) {
    await clearCredentials();
    return false;
  }

  try {
    await Api.Get<Profile>('/me', { signal });
    return true;
  } catch (error) {
    if (isApiError(error) && error.status === 401) {
      await clearCredentials();
      return false;
    }
    throw error;
  }
};

const LogOut = async () => clearCredentials();

const SetUnauthorizedHandler = (handler: UnauthorizedHandler | null) => setUnauthorizedHandler(handler);

export const Auth = { LogIn, CheckToken, LogOut, SetUnauthorizedHandler };