export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type ApiProblem = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  request_id?: string;
};

export type RequestOptions = {
  authenticated?: boolean;
  body?: object;
  key?: string;
  pdf?: boolean;
  signal?: AbortSignal;
};

export type ReadOptions = Pick<RequestOptions, 'pdf' | 'signal'>;
export type WriteOptions = Pick<RequestOptions, 'authenticated' | 'key' | 'signal'>;

export type ApiError = Error & { status: number; requestId?: string };

export type Scalar = string | number;

export type Saved = { saved: true };
