import { mockMatches } from '@/data/matches';
import { fetchJson } from '@/services/apiClient';
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

const formatApiDate = (dateIso: string) => {
  const date = new Date(dateIso);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const filterMockMatchesByDate = (dateIso: string) => {
  const target = formatApiDate(dateIso);
  return mockMatches.filter((match) => formatApiDate(match.kickoffIso) === target);
};

export const getMatchesByDate = async (dateIso: string): Promise<Match[]> => {
  const data = await fetchJson<ApiFixtureResponse>('/api/fixtures', { date: formatApiDate(dateIso) });
  if (data?.response?.length) {
    return data.response.map(mapFixtureToMatch);
  }
  return filterMockMatchesByDate(dateIso);
};

export const getAllMatches = async (): Promise<Match[]> => {
  const data = await fetchJson<ApiFixtureResponse>('/api/fixtures', { next: 30 });
  if (data?.response?.length) {
    return data.response.map(mapFixtureToMatch);
  }
  return mockMatches;
};

export const getMatchById = async (matchId: string): Promise<Match | null> => {
  const data = await fetchJson<ApiFixtureResponse>('/api/fixtures', { id: matchId });
  if (data?.response[0]) {
    return mapFixtureToMatch(data.response[0]);
  }
  return mockMatches.find((match) => match.id === matchId) ?? null;
};
