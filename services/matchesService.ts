import AsyncStorage from '@react-native-async-storage/async-storage';

import { ApiFootballResult, fetchApiFootball } from '@/services/apiFootball';
import { Match, MatchStatus } from '@/types';
import { isAllowedLeague } from '@/utils/leagueFilters';

type ApiFixture = {
  fixture: {
    id: number;
    date: string;
    status: { short: string; elapsed: number | null };
    venue?: { name?: string | null };
  };
  league: {
    id: number;
    name: string;
    country: string;
  };
  teams: {
    home: { id: number; name: string; logo: string };
    away: { id: number; name: string; logo: string };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
};

type ApiFixtureResponse = {
  response: ApiFixture[];
  errors?: Record<string, string>;
};

const liveStatuses = new Set(['1H', '2H', 'ET', 'P', 'HT', 'BT', 'LIVE', 'INT', 'SUSP']);
const finishedStatuses = new Set(['FT', 'AET', 'PEN', 'AWD', 'WO']);

const mapStatus = (short: string): MatchStatus => {
  if (liveStatuses.has(short)) {
    return 'live';
  }
  if (finishedStatuses.has(short)) {
    return 'finished';
  }
  return 'upcoming';
};

const mapFixtureToMatch = (fixture: ApiFixture): Match => {
  const status = mapStatus(fixture.fixture.status.short);
  const goalsHome = fixture.goals.home;
  const goalsAway = fixture.goals.away;
  const score =
    typeof goalsHome === 'number' && typeof goalsAway === 'number'
      ? { home: goalsHome, away: goalsAway }
      : undefined;

  return {
    id: String(fixture.fixture.id),
    homeTeam: {
      id: String(fixture.teams.home.id),
      name: fixture.teams.home.name,
      logoUrl: fixture.teams.home.logo,
    },
    awayTeam: {
      id: String(fixture.teams.away.id),
      name: fixture.teams.away.name,
      logoUrl: fixture.teams.away.logo,
    },
    league: {
      id: String(fixture.league.id),
      name: fixture.league.name,
      country: fixture.league.country,
    },
    kickoffIso: fixture.fixture.date,
    status,
    score,
    liveMinute: fixture.fixture.status.elapsed ?? undefined,
    venue: fixture.fixture.venue?.name ?? undefined,
  };
};

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

const MIN_DEV_TTL_MS = 10 * 60 * 1000;
const ALL_MATCHES_TTL_MS = 5 * 60 * 1000;
const MATCH_DETAILS_TTL_MS = 10 * 60 * 1000;

const pendingRequests = new Map<string, Promise<unknown>>();

const ensureDevTtl = (ttlMs: number) => (__DEV__ ? Math.max(ttlMs, MIN_DEV_TTL_MS) : ttlMs);

const ensureResponse = <T>(result: ApiFootballResult<T>, context: string): T => {
  console.info(`[API-Football] ${context} status`, result.status);
  const errors = (result.data as { errors?: Record<string, string> } | null)?.errors;
  if (errors && Object.keys(errors).length > 0) {
    console.warn(`[API-Football] ${context} errors`, errors);
  }
  if (!result.ok || !result.data) {
    throw new Error(`API-Football request failed (${context})`);
  }
  return result.data;
};

const getFixturesCacheKey = (dateIso: string) => `fixtures:${formatApiDate(dateIso)}`;

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

const getFixturesTtlMs = (dateIso: string) => {
  const targetDay = startOfDay(new Date(dateIso));
  const todayDay = startOfDay(new Date());
  if (targetDay === todayDay) {
    return ensureDevTtl(2 * 60 * 1000);
  }
  if (targetDay > todayDay) {
    return ensureDevTtl(6 * 60 * 60 * 1000);
  }
  return ensureDevTtl(24 * 60 * 60 * 1000);
};

const readFixturesCache = async (cacheKey: string): Promise<FixturesCacheEntry | null> => {
  try {
    const cachedRaw = await AsyncStorage.getItem(cacheKey);
    if (!cachedRaw) {
      return null;
    }
    return JSON.parse(cachedRaw) as FixturesCacheEntry;
  } catch (error) {
    console.warn('[API-Football] Failed to read fixtures cache', error);
    return null;
  }
};

const writeFixturesCache = async (cacheKey: string, entry: FixturesCacheEntry) => {
  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(entry));
  } catch (error) {
    console.warn('[API-Football] Failed to write fixtures cache', error);
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
    console.warn('[API-Football] Failed to read cache', error);
    return null;
  }
};

const writeCache = async <T>(cacheKey: string, entry: CacheEntry<T>) => {
  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(entry));
  } catch (error) {
    console.warn('[API-Football] Failed to write cache', error);
  }
};

const isCacheValid = (entry: { cachedAt: number; ttlMs: number }) => Date.now() < entry.cachedAt + entry.ttlMs;


export const getMatchesByDate = async (
  dateIso: string,
  options: { forceRefresh?: boolean } = {}
): Promise<Match[]> => {
  const cacheKey = getFixturesCacheKey(dateIso);
  const cacheEntry = await readFixturesCache(cacheKey);
  const hasValidCache = cacheEntry ? isCacheValid(cacheEntry) : false;

  if (hasValidCache && !options.forceRefresh) {
    return cacheEntry?.data ?? [];
  }

  const pendingKey = `fixtures-by-date:${formatApiDate(dateIso)}`;
  if (!options.forceRefresh && pendingRequests.has(pendingKey)) {
    return (await pendingRequests.get(pendingKey)) as Match[];
  }

  const params = { date: formatApiDate(dateIso), timezone: 'Africa/Abidjan' };
  const request = (async () => {
    try {
      const result = await fetchApiFootball<ApiFixtureResponse>('/fixtures', params);
      const data = ensureResponse(result, 'fixtures by date');
      const matches = data.response
        .map(mapFixtureToMatch)
        .filter((match) => isAllowedLeague(match.league.name));

      await writeFixturesCache(cacheKey, {
        data: matches,
        cachedAt: Date.now(),
        ttlMs: getFixturesTtlMs(dateIso),
      });

      return matches;
    } catch (error) {
      if (cacheEntry) {
        console.warn('[API-Football] Using stale fixtures cache', { date: formatApiDate(dateIso) });
        return cacheEntry.data;
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
  const cacheKey = 'fixtures:next:30';
  const cacheEntry = await readCache<Match[]>(cacheKey);
  if (cacheEntry && isCacheValid(cacheEntry)) {
    return cacheEntry.data;
  }

  if (pendingRequests.has(cacheKey)) {
    return (await pendingRequests.get(cacheKey)) as Match[];
  }

  const params = { next: 30 };
  const request = (async () => {
    try {
      const result = await fetchApiFootball<ApiFixtureResponse>('/fixtures', params);
      console.info('[API-Football] fixtures URL params', params);
      const data = ensureResponse(result, 'fixtures next');
      console.info('[API-Football] fixtures count', data.response.length);
      const matches = data.response
        .map(mapFixtureToMatch)
        .filter((match) => isAllowedLeague(match.league.name));

      await writeCache(cacheKey, {
        data: matches,
        cachedAt: Date.now(),
        ttlMs: ensureDevTtl(ALL_MATCHES_TTL_MS),
      });

      return matches;
    } catch (error) {
      if (cacheEntry) {
        console.warn('[API-Football] Using stale fixtures cache', { context: 'fixtures next' });
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

export const getMatchById = async (matchId: string): Promise<Match | null> => {
  const cacheKey = `fixture:${matchId}`;
  const cacheEntry = await readCache<Match | null>(cacheKey);
  if (cacheEntry && isCacheValid(cacheEntry)) {
    return cacheEntry.data;
  }

  if (pendingRequests.has(cacheKey)) {
    return (await pendingRequests.get(cacheKey)) as Match | null;
  }

  const params = { id: matchId };
  const request = (async () => {
    try {
      const result = await fetchApiFootball<ApiFixtureResponse>('/fixtures', params);
      console.info('[API-Football] fixtures URL params', params);
      const data = ensureResponse(result, 'fixture by id');
      console.info('[API-Football] fixtures count', data.response.length);
      const match = data.response[0] ? mapFixtureToMatch(data.response[0]) : null;

      await writeCache(cacheKey, {
        data: match,
        cachedAt: Date.now(),
        ttlMs: ensureDevTtl(MATCH_DETAILS_TTL_MS),
      });

      return match;
    } catch (error) {
      if (cacheEntry) {
        console.warn('[API-Football] Using stale fixtures cache', { context: 'fixture by id' });
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
