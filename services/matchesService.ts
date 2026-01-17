import { ApiFootballResult, fetchApiFootball } from '@/services/apiClient';
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
let hasLoggedStatus = false;

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

type ApiStatusResponse = {
  response?: {
    requests?: { current?: number; limit_day?: number };
    subscription?: { active?: boolean; plan?: string };
  };
  errors?: Record<string, string>;
};

const logApiStatusOnce = async () => {
  if (hasLoggedStatus) {
    return;
  }
  hasLoggedStatus = true;
  const statusResult = await fetchApiFootball<ApiStatusResponse>('/status');
  console.info('[API-Football] GET /status', statusResult.status, statusResult.data);
  if (statusResult.data?.errors && Object.keys(statusResult.data.errors).length > 0) {
    console.warn('[API-Football] /status errors', statusResult.data.errors);
  }
};

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

export const getMatchesByDate = async (dateIso: string): Promise<Match[]> => {
  await logApiStatusOnce();
  const params = { date: formatApiDate(dateIso) };
  const result = await fetchApiFootball<ApiFixtureResponse>('/fixtures', params);
  console.info('[API-Football] fixtures URL params', params);
  const data = ensureResponse(result, 'fixtures by date');
  console.info('[API-Football] fixtures count', data.response.length);
  return data.response
    .map(mapFixtureToMatch)
    .filter((match) => isAllowedLeague(match.league.name));
};

export const getAllMatches = async (): Promise<Match[]> => {
  await logApiStatusOnce();
  const params = { next: 30 };
  const result = await fetchApiFootball<ApiFixtureResponse>('/fixtures', params);
  console.info('[API-Football] fixtures URL params', params);
  const data = ensureResponse(result, 'fixtures next');
  console.info('[API-Football] fixtures count', data.response.length);
  return data.response
    .map(mapFixtureToMatch)
    .filter((match) => isAllowedLeague(match.league.name));
};

export const getMatchById = async (matchId: string): Promise<Match | null> => {
  await logApiStatusOnce();
  const params = { id: matchId };
  const result = await fetchApiFootball<ApiFixtureResponse>('/fixtures', params);
  console.info('[API-Football] fixtures URL params', params);
  const data = ensureResponse(result, 'fixture by id');
  console.info('[API-Football] fixtures count', data.response.length);
  if (data.response[0]) {
    return mapFixtureToMatch(data.response[0]);
  }
  return null;
};
