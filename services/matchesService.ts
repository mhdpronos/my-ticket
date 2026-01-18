import AsyncStorage from '@react-native-async-storage/async-storage';

import { mapSportMonksFixtureToMatch, SportMonksFixture } from '@/services/mappers/mapSportMonksFixtureToMatch';
import { sportMonksGet } from '@/services/sportMonksClient';
import { Match } from '@/types';
import { isAllowedLeague } from '@/utils/leagueFilters';

const formatApiDate = (dateIso: string) => {
  const date = new Date(dateIso);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

type FixturesCacheEntry = {
  data: Match[];
  cachedAt: number;
  ttlMs: number;
};

type CacheEntry<T> = {
  data: T;
  cachedAt: number;
  ttlMs: number;
};

type MatchesResult = {
  matches: Match[];
  isStale: boolean;
};

const TODAY_TTL_MS = 3 * 60 * 1000;
const FUTURE_TTL_MS = 12 * 60 * 60 * 1000;
const PAST_TTL_MS = 24 * 60 * 60 * 1000;
const ALL_MATCHES_TTL_MS = 6 * 60 * 60 * 1000;
const MATCH_DETAILS_TTL_MS = 24 * 60 * 60 * 1000;

const pendingRequests = new Map<string, Promise<unknown>>();

const isCacheValid = (entry: { cachedAt: number; ttlMs: number }) => Date.now() < entry.cachedAt + entry.ttlMs;

const getFixturesCacheKey = (dateIso: string) => `fixtures:${formatApiDate(dateIso)}`;

const getFixturesTtlMs = (dateIso: string) => {
  const selected = new Date(dateIso);
  const selectedMidnight = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate());
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  if (selectedMidnight.getTime() === todayMidnight.getTime()) {
    return TODAY_TTL_MS;
  }
  if (selectedMidnight.getTime() < todayMidnight.getTime()) {
    return PAST_TTL_MS;
  }
  return FUTURE_TTL_MS;
};

const readFixturesCache = async (cacheKey: string): Promise<FixturesCacheEntry | null> => {
  try {
    const cachedRaw = await AsyncStorage.getItem(cacheKey);
    if (!cachedRaw) {
      return null;
    }
    return JSON.parse(cachedRaw) as FixturesCacheEntry;
  } catch (error) {
    console.warn('[SportMonks] Failed to read fixtures cache', error);
    return null;
  }
};

const writeFixturesCache = async (cacheKey: string, entry: FixturesCacheEntry) => {
  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(entry));
  } catch (error) {
    console.warn('[SportMonks] Failed to write fixtures cache', error);
  }
};

const readCache = async <T>(cacheKey: string): Promise<CacheEntry<T> | null> => {
  try {
    const cachedRaw = await AsyncStorage.getItem(cacheKey);
    if (!cachedRaw) {
      return null;
    }
    return JSON.parse(cachedRaw) as CacheEntry<T>;
  } catch (error) {
    console.warn('[SportMonks] Failed to read cache', error);
    return null;
  }
};

const writeCache = async <T>(cacheKey: string, entry: CacheEntry<T>) => {
  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(entry));
  } catch (error) {
    console.warn('[SportMonks] Failed to write cache', error);
  }
};

const includeParams = 'participants;league.country;venue;scores';

export const getMatchesByDate = async (
  dateIso: string,
  options: { forceRefresh?: boolean } = {}
): Promise<MatchesResult> => {
  const cacheKey = getFixturesCacheKey(dateIso);
  const cacheEntry = await readFixturesCache(cacheKey);
  const hasValidCache = cacheEntry ? isCacheValid(cacheEntry) : false;

  if (hasValidCache && !options.forceRefresh) {
    return { matches: cacheEntry?.data ?? [], isStale: false };
  }

  const pendingKey = `fixtures-by-date:${formatApiDate(dateIso)}`;
  if (!options.forceRefresh && pendingRequests.has(pendingKey)) {
    return (await pendingRequests.get(pendingKey)) as MatchesResult;
  }

  const request = (async () => {
    try {
      const fixtures = await sportMonksGet<SportMonksFixture[] | null>(`fixtures/date/${formatApiDate(dateIso)}`,
        {
          include: includeParams,
          per_page: 100,
        }
      );
      const normalizedFixtures = fixtures ?? [];
      const matches = normalizedFixtures
        .map(mapSportMonksFixtureToMatch)
        .filter((match) => isAllowedLeague(match.league.name));

      console.info('[SportMonks] fixtures count', matches.length);

      await writeFixturesCache(cacheKey, {
        data: matches,
        cachedAt: Date.now(),
        ttlMs: getFixturesTtlMs(dateIso),
      });

      return { matches, isStale: false };
    } catch (error) {
      if (cacheEntry) {
        console.warn('[SportMonks] Using stale fixtures cache', { date: formatApiDate(dateIso) });
        return { matches: cacheEntry.data, isStale: true };
      }
      throw error;
    } finally {
      pendingRequests.delete(pendingKey);
    }
  })();

  pendingRequests.set(pendingKey, request);
  return request;
};

export const getAllMatches = async (): Promise<Match[]> => {
  const cacheKey = 'fixtures:range:10-days';
  const cacheEntry = await readCache<Match[]>(cacheKey);
  if (cacheEntry && isCacheValid(cacheEntry)) {
    return cacheEntry.data;
  }

  if (pendingRequests.has(cacheKey)) {
    return (await pendingRequests.get(cacheKey)) as Match[];
  }

  const request = (async () => {
    try {
      const today = new Date();
      const end = new Date();
      end.setDate(today.getDate() + 7);
      const fixtures = await sportMonksGet<SportMonksFixture[] | null>(
        `fixtures/between/${formatApiDate(today.toISOString())}/${formatApiDate(end.toISOString())}`,
        {
          include: includeParams,
          per_page: 200,
        }
      );

      const normalizedFixtures = fixtures ?? [];
      const matches = normalizedFixtures
        .map(mapSportMonksFixtureToMatch)
        .filter((match) => isAllowedLeague(match.league.name));

      await writeCache(cacheKey, {
        data: matches,
        cachedAt: Date.now(),
        ttlMs: ALL_MATCHES_TTL_MS,
      });

      return matches;
    } catch (error) {
      if (cacheEntry) {
        console.warn('[SportMonks] Using stale fixtures cache', { context: 'fixtures range' });
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

export const getMatchById = async (
  matchId: string,
  options: { forceRefresh?: boolean } = {}
): Promise<Match | null> => {
  const cacheKey = `fixture:${matchId}`;
  const cacheEntry = await readCache<Match | null>(cacheKey);
  if (cacheEntry && isCacheValid(cacheEntry) && !options.forceRefresh) {
    return cacheEntry.data;
  }

  if (!options.forceRefresh && pendingRequests.has(cacheKey)) {
    return (await pendingRequests.get(cacheKey)) as Match | null;
  }

  const request = (async () => {
    try {
      const fixture = await sportMonksGet<SportMonksFixture | SportMonksFixture[] | null>(
        `fixtures/${matchId}`,
        { include: includeParams }
      );
      const resolvedFixture = Array.isArray(fixture) ? fixture[0] : fixture;
      const match = resolvedFixture ? mapSportMonksFixtureToMatch(resolvedFixture) : null;

      await writeCache(cacheKey, {
        data: match,
        cachedAt: Date.now(),
        ttlMs: MATCH_DETAILS_TTL_MS,
      });

      return match;
    } catch (error) {
      if (cacheEntry) {
        console.warn('[SportMonks] Using stale fixtures cache', { context: 'fixture by id' });
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
