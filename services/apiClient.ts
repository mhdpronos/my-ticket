const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

type QueryParams = Record<string, string | number | boolean | undefined | null>;

const buildUrl = (path: string, params: QueryParams = {}) => {
  const url = new URL(path, API_BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }
    url.searchParams.set(key, String(value));
  });
  return url.toString();
};

export const fetchJson = async <T>(path: string, params?: QueryParams): Promise<T | null> => {
  try {
    const response = await fetch(buildUrl(path, params));
    if (!response.ok) {
      console.warn('API request failed', response.status, response.statusText);
      return null;
    }
    return (await response.json()) as T;
  } catch (error) {
    console.warn('API request error', error);
    return null;
  }
};
