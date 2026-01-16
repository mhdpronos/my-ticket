const DIRECT_API_BASE_URL = process.env.EXPO_PUBLIC_API_DIRECT_BASE_URL ?? 'https://v3.football.api-sports.io';
const DIRECT_API_KEY = process.env.EXPO_PUBLIC_API_FOOTBALL_KEY;

type QueryParams = Record<string, string | number | boolean | undefined | null>;

const buildUrl = (path: string, params: QueryParams = {}, baseUrl = DIRECT_API_BASE_URL) => {
  const url = new URL(path, baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }
    url.searchParams.set(key, String(value));
  });
  return url.toString();
};

const mapDirectPath = (path: string) => (path.startsWith('/api/') ? path.replace('/api', '') : path);

export type ApiFootballResult<T> = {
  data: T | null;
  status: number | null;
  ok: boolean;
};

export const fetchApiFootball = async <T>(
  path: string,
  params?: QueryParams
): Promise<ApiFootballResult<T>> => {
  if (!DIRECT_API_KEY) {
    throw new Error('Missing API-Football key. Check EXPO_PUBLIC_API_FOOTBALL_KEY.');
  }
  const url = buildUrl(mapDirectPath(path), params, DIRECT_API_BASE_URL);
  console.info('[API-Football] GET', url);
  const response = await fetch(url, {
    headers: {
      'x-apisports-key': DIRECT_API_KEY,
    },
  });

  let data: T | null = null;
  try {
    data = (await response.json()) as T;
  } catch (error) {
    console.warn('Failed to parse API response JSON', error);
  }

  return {
    data,
    status: response.status,
    ok: response.ok,
  };
};

export const fetchJson = async <T>(path: string, params?: QueryParams): Promise<T | null> => {
  try {
    const result = await fetchApiFootball<T>(path, params);
    if (!result.ok) {
      console.warn('API request failed', result.status);
      return null;
    }
    return result.data;
  } catch (error) {
    console.warn('API request error', error);
    return null;
  }
};
