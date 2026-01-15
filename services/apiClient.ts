import Constants from 'expo-constants';

const DEFAULT_API_BASE_URL = 'http://localhost:3001';
const API_BASE_URL = (() => {
  const configuredBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;
  try {
    const url = new URL(configuredBaseUrl);
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      const manifest = Constants.manifest as { debuggerHost?: string } | null;
      const hostUri = Constants.expoConfig?.hostUri ?? manifest?.debuggerHost ?? null;
      const devHost = hostUri?.split(':')[0];
      if (devHost) {
        url.hostname = devHost;
        return url.toString();
      }
    }
  } catch (error) {
    console.warn('Failed to parse API base URL', error);
  }
  return configuredBaseUrl;
})();
const DIRECT_API_BASE_URL = process.env.EXPO_PUBLIC_API_DIRECT_BASE_URL ?? 'https://v3.football.api-sports.io';
const DIRECT_API_KEY = process.env.EXPO_PUBLIC_API_FOOTBALL_KEY;

type QueryParams = Record<string, string | number | boolean | undefined | null>;

const buildUrl = (path: string, params: QueryParams = {}, baseUrl = API_BASE_URL) => {
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

const fetchWithBase = async <T>(
  path: string,
  params: QueryParams | undefined,
  baseUrl: string,
  headers: Record<string, string> = {}
): Promise<T | null> => {
  const response = await fetch(buildUrl(path, params, baseUrl), { headers });
  if (!response.ok) {
    const message = await response.text();
    console.warn('API request failed', response.status, response.statusText, message);
    return null;
  }
  return (await response.json()) as T;
};

export const fetchJson = async <T>(path: string, params?: QueryParams): Promise<T | null> => {
  let proxyResponse: T | null = null;
  try {
    const proxyHeaders = DIRECT_API_KEY ? { 'x-apisports-key': DIRECT_API_KEY } : {};
    proxyResponse = await fetchWithBase<T>(path, params, API_BASE_URL, proxyHeaders);
  } catch (error) {
    console.warn('API proxy request error', error);
  }

  if (proxyResponse) {
    return proxyResponse;
  }

  if (!DIRECT_API_KEY) {
    return null;
  }

  try {
    return await fetchWithBase<T>(mapDirectPath(path), params, DIRECT_API_BASE_URL, {
      'x-apisports-key': DIRECT_API_KEY,
    });
  } catch (error) {
    console.warn('Direct API request error', error);
    return null;
  }
};
