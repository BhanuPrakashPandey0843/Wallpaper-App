export interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

const DEFAULT_BASE_URL = 'https://api.example.com';

export const getBaseUrl = (): string => {
  const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
  return typeof envUrl === 'string' && envUrl.length > 0 ? envUrl : DEFAULT_BASE_URL;
};

export const apiClient = async <T>(
  path: string,
  init?: RequestInit
): Promise<T> => {
  const url = `${getBaseUrl()}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  let data: unknown = null;
  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    const text = await res.text();
    data = text;
  }

  if (!res.ok) {
    const err: ApiError = new Error('API request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data as T;
};
