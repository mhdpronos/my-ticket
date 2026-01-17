const DIRECT_API_BASE_URL =
  process.env.EXPO_PUBLIC_API_DIRECT_BASE_URL ?? 'https://v3.football.api-sports.io';
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

const logApiResponse = (url: string, status: number, data: unknown) => {
  console.info('[API-Football] GET', url);
  console.info('[API-Football] status', status);
  const response = data as { response?: unknown[]; errors?: Record<string, string> } | null;
  if (response?.response && Array.isArray(response.response)) {
    console.info('[API-Football] response count', response.response.length);
  }
  if (response?.errors && Object.keys(response.errors).length > 0) {
    console.warn('[API-Football] response errors', response.errors);
  }
};

export const fetchApiFootball = async <T>(
  path: string,
  params?: QueryParams
): Promise<ApiFootballResult<T>> => {
  if (!DIRECT_API_KEY) {
    throw new Error('Missing API-Football key. Check EXPO_PUBLIC_API_FOOTBALL_KEY.');
  }
  const url = buildUrl(mapDirectPath(path), params, DIRECT_API_BASE_URL);
  const response = await fetch(url, {
    headers: {
      'x-apisports-key': DIRECT_API_KEY,
    },
  });

  let data: T | null = null;
  try {
    data = (await response.json()) as T;
  } catch (error) {
    console.warn('[API-Football] Failed to parse JSON', error);
  }

  logApiResponse(url, response.status, data);

  return {
    data,
    status: response.status,
    ok: response.ok,
  };
};
