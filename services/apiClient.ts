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

type ApiResult<T> = {
  data: T | null;
  error: string | null;
};

const parseErrorMessage = async (response: Response) => {
  try {
    const text = await response.text();
    if (!text) {
      return `${response.status} ${response.statusText}`.trim();
    }
    try {
      const parsed = JSON.parse(text) as { error?: string };
      if (parsed?.error) {
        return parsed.error;
      }
    } catch {
      return text;
    }
    return text;
  } catch {
    return `${response.status} ${response.statusText}`.trim();
  }
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

export const fetchJsonWithError = async <T>(path: string, params?: QueryParams): Promise<ApiResult<T>> => {
  try {
    const response = await fetch(buildUrl(path, params));
    if (!response.ok) {
      const message = await parseErrorMessage(response);
      console.warn('API request failed', response.status, message);
      return { data: null, error: message || 'Unexpected API error.' };
    }
    return { data: (await response.json()) as T, error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error.';
    console.warn('API request error', error);
    return { data: null, error: message };
  }
};
