import * as LS from '../storage';
import type {
  ApiError,
  ApiProblem,
  HttpMethod,
  ReadOptions,
  RequestOptions,
  WriteOptions,
} from '../types';

const apiConfig = {
  base: process.env.EXPO_PUBLIC_BASE_URL,
  path: process.env.EXPO_PUBLIC_ENDPOINT_PATH,
  fullUrl: `${process.env.EXPO_PUBLIC_BASE_URL}${process.env.EXPO_PUBLIC_ENDPOINT_PATH}`
}

const TOKEN_PATTERN = /^mca1\.[A-Za-z0-9_-]{180,300}$/;

export type UnauthorizedHandler = (signOut: boolean) => void | Promise<void>;

let unauthorizedHandler: UnauthorizedHandler | null = null;

export const isValidToken = (token: unknown): token is string =>
  typeof token === 'string' && TOKEN_PATTERN.test(token);

export const setUnauthorizedHandler = (handler: UnauthorizedHandler | null) => {
  unauthorizedHandler = handler;
};

export const createApiError = (status: number, message: string, requestId?: string): ApiError => {
  const error = new Error(message) as ApiError;
  error.name = 'ApiError';
  error.status = status;
  if (requestId) error.requestId = requestId;
  return error;
};


export const isApiError = (error: unknown): error is ApiError =>
  error instanceof Error && 'status' in error && typeof error.status === 'number';

const getApiBase = () => {
  if (!apiConfig.fullUrl) {
    throw new Error(
      'Possible missing API env variables.',
    );
  }

  let base: URL;
  try {
    base = new URL(apiConfig.fullUrl);
  } catch {
    throw new Error(
      'Possible missing API env variables.',
    );
  }

  const path = base.pathname.replace(/\/$/, '');
  if (
    base.protocol !== 'https:' ||
    base.username ||
    base.password ||
    base.search ||
    base.hash ||
    path !== apiConfig.path
  ) {
    throw new Error(
      'Possible missing API env variables.',
    );
  }

  return { origin: base.origin, path };
};

const readProblem = async (response: Response, contentType: string): Promise<ApiProblem | null> => {
  if (!contentType.includes('json')) return null;

  try {
    const body: unknown = await response.json();
    return body !== null && typeof body === 'object' ? body as ApiProblem : null;
  } catch (error) {
    console.warn('Could not read the API error response.', error);
    return null;
  }
};

const readResponse = async <T>(
  response: Response,
  contentType: string,
  options: RequestOptions,
): Promise<T> => {
  if (options.pdf) {
    if (!contentType.startsWith('application/pdf')) {
      throw createApiError(502, 'The API did not return a PDF.');
    }
    return await response.arrayBuffer() as T;
  }

  if (!contentType.includes('application/json')) {
    throw createApiError(502, 'The API did not return JSON.');
  }

  const envelope: unknown = await response.json();
  if (
    envelope === null ||
    typeof envelope !== 'object' ||
    !Object.prototype.hasOwnProperty.call(envelope, 'data')
  ) {
    throw createApiError(502, 'The API response is missing its data field.');
  }

  return (envelope as { data: T }).data;
}

const request = async <T>(
  path: string,
  method: HttpMethod,
  options: RequestOptions = {},
): Promise<T> => {
  const authenticated = options.authenticated !== false;
  const base = getApiBase();
  const target = new URL(`${base.path}${path}`, base.origin);

  if (target.origin !== base.origin || !target.pathname.startsWith(`${base.path}/`)) {
    throw new Error('Invalid MyCoinadrink API path.');
  }

  let token: string | null = null;
  if (authenticated) {
    // Get the authentication token from local storage every single time
    //   - this is inefficient but ensures the token is always up-to-date.
    // could i make this more fast? doubt it rn.
    token = await LS.Creds.getToken();
    if (!isValidToken(token)) {
      await unauthorizedHandler?.(false);
      throw createApiError(401, 'Please sign in again.');
    }
  }

  if (authenticated && method !== 'GET' && !/^[0-9a-f]{32}$/.test(options.key ?? '')) {
    throw new Error('The write needs a valid idempotency key.');
  }

  const controller = new AbortController();
  const abortRequest = () => controller.abort();
  if (options.signal?.aborted) abortRequest();
  else options.signal?.addEventListener('abort', abortRequest, { once: true });

  const timeout = setTimeout(abortRequest, options.pdf ? 30_000 : 15_000);

  try {
    const headers: Record<string, string> = {
      Accept: options.pdf ? 'application/pdf' : 'application/json',
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    if (options.body !== undefined) headers['Content-Type'] = 'application/json';
    if (options.key) headers['Idempotency-Key'] = options.key;

    const init: RequestInit = {
      method,
      headers,
      signal: controller.signal,
      redirect: 'error',
      credentials: 'omit',
    };
    if (options.body !== undefined) init.body = JSON.stringify(options.body);

    const response = await fetch(target.href, init);
    const contentType = (response.headers.get('content-type') ?? '').toLowerCase();

    if (!response.ok) {
      const problem = await readProblem(response, contentType);

      if (authenticated && response.status === 401) {
        await unauthorizedHandler?.(problem?.detail === 'Please sign in again.');
      }
      const message = typeof problem?.detail === 'string' && problem.detail
        ? problem.detail
        : 'The API request failed.';
      const requestId = response.headers.get('x-request-id') ?? problem?.request_id;
      throw createApiError(response.status, message, requestId);
    }

    return await readResponse<T>(response, contentType, options);
  } catch (error) {
    if (isApiError(error)) throw error;
    const message = controller.signal.aborted
      ? 'The request was cancelled or timed out.'
      : 'Could not read the API response.';
    throw createApiError(0, message);
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener('abort', abortRequest);
  }
};



export const Api = {
  Get: <T>(path: string, options: ReadOptions = {}) =>
    request<T>(path, 'GET', options),

  Post: <T>(path: string, body: object, options: WriteOptions = {}) =>
    request<T>(path, 'POST', {
      body,
      authenticated: options.authenticated,
      key: options.key,
      signal: options.signal,
    }),

  Patch: <T>(path: string, body: object, options: WriteOptions = {}) =>
    request<T>(path, 'PUT', {
      body,
      authenticated: options.authenticated,
      key: options.key,
      signal: options.signal,
    }),

  Delete: <T>(path: string, body: object, options: WriteOptions = {}) =>
    request<T>(path, 'DELETE', {
      body,
      authenticated: options.authenticated,
      key: options.key,
      signal: options.signal,
    }),
};
