
import type { Scalar } from './api';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type Profile = {
  user_id: Scalar;
  firstname: string;
  lastname: string;
  email: string;
};

export type LoginSession = {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  user: Profile;
};