import { fetchJsonWithError } from '@/services/apiClient';
import { Match, MatchStatus } from '@/types';

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

export type MatchesResult = {
  matches: Match[];
  error: string | null;
};

export type MatchResult = {
  match: Match | null;
  error: string | null;
};

const formatApiDate = (dateIso: string) => {
  const date = new Date(dateIso);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getMatchesByDate = async (dateIso: string): Promise<MatchesResult> => {
  const { data, error } = await fetchJsonWithError<ApiFixtureResponse>('/api/fixtures', {
    date: formatApiDate(dateIso),
  });
  return {
    matches: data?.response.map(mapFixtureToMatch) ?? [],
    error,
  };
};

export const getAllMatches = async (): Promise<MatchesResult> => {
  const { data, error } = await fetchJsonWithError<ApiFixtureResponse>('/api/fixtures', { next: 30 });
  return {
    matches: data?.response.map(mapFixtureToMatch) ?? [],
    error,
  };
};

export const getMatchById = async (matchId: string): Promise<MatchResult> => {
  const { data, error } = await fetchJsonWithError<ApiFixtureResponse>('/api/fixtures/' + matchId);
  return {
    match: data?.response[0] ? mapFixtureToMatch(data.response[0]) : null,
    error,
  };
};
