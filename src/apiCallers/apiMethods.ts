const buildURL = (path = '') => {
  if (String(path).startsWith('http://') || String(path).startsWith('https://')) {
    return path;
  }

  const urlPrefix = process.env.EXPO_PUBLIC_URL_PREFIX || '';
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || '';

  return `${urlPrefix}${apiUrl}${path}`;
};

const buildEndpoint = (endpoint = '') => {
  const trimmedEndpoint = String(endpoint).trim();
  if (!trimmedEndpoint) return '';
  if (trimmedEndpoint.startsWith('?')) return trimmedEndpoint;
  if (trimmedEndpoint.match(/^https?:\/\//i)) return trimmedEndpoint;

  const actionValue = encodeURIComponent(trimmedEndpoint.replace(/^\/+/, '')).replace(/%2F/g, '/');
  return `?action=${actionValue}`;
};

type CallAPIProps = {
  values: Record<string, any>;
  endpoint: string;
  action?: string | null;
  timeout?: number;
};

const withTimeout = async (promise: Promise<any>, timeoutMs = 10000, label = 'API request') => {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`${label} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timer) clearTimeout(timer);
  }
};

export const callAPI = async ({ values, endpoint, action, timeout = 10000 }: CallAPIProps) => {
  try {
    const apiEndpoint = buildEndpoint(endpoint);
    const requestBody = { ...values } as Record<string, unknown>;
    if (action != null) {
      requestBody.action = action;
    }

    const response = await withTimeout(
      fetch(buildURL(apiEndpoint), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }),
      timeout,
      `POST ${endpoint}`
    );

    if (!response.ok) {
      const bodyText = await response.text().catch(() => '<unreadable>');
      console.error(
        `API ${response.status} ${response.statusText} - URL: ${buildURL(apiEndpoint)} - body: ${bodyText}`
      );
      throw new Error(`Failed to call API: ${endpoint} (${response.status})`);
    }
    if (response.headers.get('Content-Type')?.startsWith('application/json')) {
      return await response.json();
    } else {
      const textResponse = await response.text();
      console.warn(`Expected JSON response but got: ${textResponse}`);
      return { success: false, error: 'Unexpected response format' };
    }
  } catch (error) {
    console.error(`Error calling API: ${endpoint}`, error);
    throw error;
  }
};

const actionPost = async (action = '', body = {}, options = { timeout: 10000 }) => {
  return callAPI({ values: body, endpoint: `?action=${action}`, action, timeout: options.timeout });
};

export const API = {
  actionPost,
};