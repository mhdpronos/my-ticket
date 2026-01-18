const BASE_URL =
  process.env.EXPO_PUBLIC_SPORTMONKS_BASE_URL ?? 'https://api.sportmonks.com/v3/football';
const API_KEY = process.env.EXPO_PUBLIC_SPORTMONKS_API_KEY;

type QueryParams = Record<string, string | number | boolean | undefined | null>;

const buildUrl = (endpoint: string, params: QueryParams = {}) => {
  if (!API_KEY) {
    throw new Error('Missing SportMonks API key. Check EXPO_PUBLIC_SPORTMONKS_API_KEY.');
  }
  const normalizedEndpoint = endpoint.replace(/^\//, '');
  const url = new URL(normalizedEndpoint, `${BASE_URL.replace(/\/$/, '')}/`);
  const fullParams = { ...params, api_token: API_KEY };
  Object.entries(fullParams).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }
    url.searchParams.set(key, String(value));
  });
  return url.toString();
};

export const sportMonksGet = async <T>(endpoint: string, params?: QueryParams): Promise<T> => {
  const url = buildUrl(endpoint, params);
  console.info('[SportMonks] GET', url);

  const response = await fetch(url);
  let payload: unknown = null;

  try {
    payload = await response.json();
  } catch (error) {
    console.warn('[SportMonks] Failed to parse JSON', error);
    throw new Error('SportMonks response parsing failed.');
  }

  if (!response.ok) {
    const message =
      (payload as { message?: string; error?: string })?.message ??
      (payload as { message?: string; error?: string })?.error ??
      'Unknown error';
    throw new Error(`SportMonks error (${response.status}): ${message}`);
  }

  const data = (payload as { data?: T }).data ?? null;
  if (Array.isArray(data)) {
    console.info('[SportMonks] response count', data.length);
  }

  return data as T;
};
