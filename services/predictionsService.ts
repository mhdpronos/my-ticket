import AsyncStorage from '@react-native-async-storage/async-storage';

import { buildPredictionsForMatch } from '@/data/predictions';
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

const buildPredictionsPayload = (matchId: string, prediction?: ApiPredictionsResponse['response'][number]['predictions']) => {
  if (!prediction) {
    return buildPredictionsForMatch(matchId);
  }

  const percentHome = parsePercent(prediction.percent.home);
  const percentDraw = parsePercent(prediction.percent.draw);
  const percentAway = parsePercent(prediction.percent.away);

  return buildPredictionsForMatch(matchId, {
    HOME: percentHome,
    DRAW: percentDraw,
    AWAY: percentAway,
  }).map((item) => {
    if (item.market !== '1X2' || item.confidence === undefined) {
      return item;
    }
    return {
      ...item,
      risk: riskFromPercent(item.confidence),
    };
  });
};

export const getPredictionsForMatch = async (
  matchId: string,
  options: { forceRefresh?: boolean } = {}
): Promise<Prediction[]> => {
  const cacheKey = `predictions:${matchId}`;
  const cacheEntry = await readCache(cacheKey);

  if (cacheEntry && !options.forceRefresh) {
    return cacheEntry.data;
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
      const fallback = buildPredictionsPayload(matchId);
      await writeCache(cacheKey, {
        data: fallback,
        cachedAt: Date.now(),
        ttlMs: DAY_TTL_MS,
      });
      return fallback;
    } finally {
      pendingRequests.delete(cacheKey);
    }
  })();

  pendingRequests.set(cacheKey, request);
  return request;
};
