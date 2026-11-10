
import { Api } from './apiMethods';
import type { Profile } from '../types';

const GetInfo = (signal?: AbortSignal) => Api.Get<Profile>('/me', { signal });

export const User = { GetInfo };