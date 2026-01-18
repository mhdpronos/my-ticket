import AsyncStorage from '@react-native-async-storage/async-storage';

import { fetchJson } from '@/services/apiClient';
import { Prediction } from '@/types';

type ApiPredictionsResponse = {
  response: Array<{
    predictions: {
      percent: { home: string; draw: string; away: string };
      advice?: string;
    };
  }>;
};

const parsePercent = (value: string) => Number(value.replace('%', '').trim());

const riskFromPercent = (percent: number) => {
  if (percent >= 60) {
    return 'safe';
  }
  if (percent >= 45) {
    return 'medium';
  }
  return 'risky';
};

type CacheEntry<T> = {
  data: T;
  cachedAt: number;
  ttlMs: number;
};

const DAY_TTL_MS = 24 * 60 * 60 * 1000;

const pendingRequests = new Map<string, Promise<Prediction[]>>();

const readCache = async (cacheKey: string): Promise<CacheEntry<Prediction[]> | null> => {
  try {
    const cachedRaw = await AsyncStorage.getItem(cacheKey);
    if (!cachedRaw) {
      return null;
    }
    return JSON.parse(cachedRaw) as CacheEntry<Prediction[]>;
  } catch (error) {
    console.warn('[Predictions] Failed to read cache', error);
    return null;
  }
};

const writeCache = async (cacheKey: string, entry: CacheEntry<Prediction[]>) => {
  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(entry));
  } catch (error) {
    console.warn('[Predictions] Failed to write cache', error);
  }
};

const isCacheValid = (entry: CacheEntry<Prediction[]>) => Date.now() < entry.cachedAt + entry.ttlMs;

const buildPredictionsPayload = (
  matchId: string,
  prediction?: ApiPredictionsResponse['response'][number]['predictions']
) => {
  if (!prediction) {
    return [];
  }

  const percentHome = parsePercent(prediction.percent.home);
  const percentDraw = parsePercent(prediction.percent.draw);
  const percentAway = parsePercent(prediction.percent.away);

  const predictions: Prediction[] = [
    {
      id: `${matchId}-pred-home`,
      matchId,
      label: '1X2: V1',
      market: '1X2',
      selection: 'HOME',
      selectionLabel: 'V1',
      tier: 'free',
      risk: riskFromPercent(percentHome),
      confidence: percentHome,
    },
    {
      id: `${matchId}-pred-draw`,
      matchId,
      label: '1X2: X',
      market: '1X2',
      selection: 'DRAW',
      selectionLabel: 'X',
      tier: 'free',
      risk: riskFromPercent(percentDraw),
      confidence: percentDraw,
    },
    {
      id: `${matchId}-pred-away`,
      matchId,
      label: '1X2: V2',
      market: '1X2',
      selection: 'AWAY',
      selectionLabel: 'V2',
      tier: 'free',
      risk: riskFromPercent(percentAway),
      confidence: percentAway,
    },
  ];

  return predictions;
};

export const getPredictionsForMatch = async (
  matchId: string,
  options: { forceRefresh?: boolean; allowStale?: boolean } = {}
): Promise<Prediction[]> => {
  const cacheKey = `predictions:${matchId}`;
  const cacheEntry = await readCache(cacheKey);
  const hasValidCache = cacheEntry ? isCacheValid(cacheEntry) : false;

  if (cacheEntry && !options.forceRefresh) {
    if (hasValidCache || options.allowStale) {
      return cacheEntry.data;
    }
  }

  if (!options.forceRefresh && pendingRequests.has(cacheKey)) {
    return (await pendingRequests.get(cacheKey)) as Prediction[];
  }

  const request = (async () => {
    try {
      const data = await fetchJson<ApiPredictionsResponse>('/api/predictions', { fixture: matchId });
      const prediction = data?.response[0]?.predictions;
      const payload = buildPredictionsPayload(matchId, prediction);
      await writeCache(cacheKey, {
        data: payload,
        cachedAt: Date.now(),
        ttlMs: DAY_TTL_MS,
      });
      return payload;
    } catch (error) {
      if (cacheEntry) {
        console.warn('[Predictions] Using stale cache', { matchId });
        return cacheEntry.data;
      }
      console.warn('[Predictions] Failed to load predictions', { matchId, error });
      return [];
    } finally {
      pendingRequests.delete(cacheKey);
    }
  })();

  pendingRequests.set(cacheKey, request);
  return request;
};
