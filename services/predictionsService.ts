import AsyncStorage from '@react-native-async-storage/async-storage';

import { buildPredictionsForMatch } from '@/data/predictions';
import { Prediction } from '@/types';

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

const buildPredictionsPayload = (matchId: string) => buildPredictionsForMatch(matchId);

export const getPredictionsForMatch = async (
  matchId: string,
  options: { forceRefresh?: boolean } = {}
): Promise<Prediction[]> => {
  const cacheKey = `predictions:${matchId}`;
  const cacheEntry = await readCache(cacheKey);
  const hasValidCache = cacheEntry ? isCacheValid(cacheEntry) : false;

  if (hasValidCache && !options.forceRefresh) {
    return cacheEntry.data;
  }

  if (!options.forceRefresh && pendingRequests.has(cacheKey)) {
    return (await pendingRequests.get(cacheKey)) as Prediction[];
  }

  const request = (async () => {
    try {
      const payload = buildPredictionsPayload(matchId);
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
      throw error;
    } finally {
      pendingRequests.delete(cacheKey);
    }
  })();

  pendingRequests.set(cacheKey, request);
  return request;
};
