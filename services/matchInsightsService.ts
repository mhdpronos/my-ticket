import AsyncStorage from '@react-native-async-storage/async-storage';

import { fetchApiFootball } from '@/services/apiFootball';
import { Match } from '@/types';

type TeamSummary = {
  id: string;
  name: string;
  logoUrl: string;
};

export type FixtureSummary = {
  id: string;
  dateIso: string;
  status: string;
  homeTeam: TeamSummary;
  awayTeam: TeamSummary;
  score?: { home: number; away: number };
};

export type StandingRow = {
  rank: number;
  team: TeamSummary;
  points: number;
  played: number;
  win: number;
  draw: number;
  lose: number;
  goalDiff: number;
  form?: string;
};

export type EventSummary = {
  time: string;
  team: TeamSummary;
  player: string;
  detail: string;
  type: string;
  assist?: string;
};

export type LineupSummary = {
  team: TeamSummary;
  coach?: string;
  formation?: string;
  starters: Array<{ name: string; number?: number; position?: string }>;
  substitutes: Array<{ name: string; number?: number; position?: string }>;
};

export type ScorerSummary = {
  player: string;
  team: TeamSummary;
  goals: number;
  appearances?: number;
};

export type TeamRosterSummary = {
  team: TeamSummary;
  players: Array<{ name: string; position?: string; age?: number }>;
};

export type CoachSummary = {
  team: TeamSummary;
  name: string;
  age?: number;
  nationality?: string;
};

export type TransferSummary = {
  player: string;
  date?: string;
  type?: string;
  from?: string;
  to?: string;
};

export type TrophySummary = {
  name: string;
  country?: string;
  season?: string;
  place?: string;
};

export type InjurySummary = {
  team: TeamSummary;
  player: string;
  reason?: string;
  type?: string;
};

export type OddsSummary = {
  bookmaker: string;
  home?: number;
  draw?: number;
  away?: number;
};

export type StatisticSummary = {
  team: TeamSummary;
  values: Array<{ label: string; value: string }>;
};

export type MatchInsights = {
  standings: StandingRow[];
  recentFixtures: Array<{ team: TeamSummary; fixtures: FixtureSummary[] }>;
  headToHead: FixtureSummary[];
  events: EventSummary[];
  lineups: LineupSummary[];
  topScorers: ScorerSummary[];
  rosters: TeamRosterSummary[];
  coaches: CoachSummary[];
  transfers: TransferSummary[];
  trophies: TrophySummary[];
  injuries: InjurySummary[];
  odds: {
    prematch: OddsSummary[];
    live: OddsSummary[];
  };
  statistics: StatisticSummary[];
};

type CacheEntry<T> = {
  data: T;
  cachedAt: number;
  ttlMs: number;
};

type ApiFixtureBase = {
  fixture: {
    id: number;
    date: string;
    status: { short: string; elapsed: number | null };
  };
  teams: {
    home: { id: number; name: string; logo: string };
    away: { id: number; name: string; logo: string };
  };
  goals: { home: number | null; away: number | null };
};

type ApiStandingsResponse = {
  response: Array<{
    league: {
      standings: Array<
        Array<{
          rank: number;
          team: { id: number; name: string; logo: string };
          points: number;
          goalsDiff: number;
          all: { played: number; win: number; draw: number; lose: number };
          form?: string;
        }>
      >;
    };
  }>;
};

type ApiFixturesResponse = {
  response: ApiFixtureBase[];
};

type ApiEventsResponse = {
  response: Array<{
    time: { elapsed: number; extra: number | null };
    team: { id: number; name: string; logo: string };
    player: { name: string };
    assist?: { name?: string };
    type: string;
    detail: string;
  }>;
};

type ApiLineupsResponse = {
  response: Array<{
    team: { id: number; name: string; logo: string };
    coach?: { name?: string };
    formation?: string;
    startXI: Array<{ player: { name: string; number?: number; pos?: string } }>;
    substitutes: Array<{ player: { name: string; number?: number; pos?: string } }>;
  }>;
};

type ApiTopScorersResponse = {
  response: Array<{
    player: { name: string };
    statistics: Array<{ goals: { total: number | null }; games: { appearences: number | null } }>;
    team: { id: number; name: string; logo: string };
  }>;
};

type ApiPlayersResponse = {
  response: Array<{
    player: { name: string; age?: number };
    statistics: Array<{ games: { position?: string } }>;
  }>;
};

type ApiCoachesResponse = {
  response: Array<{ name: string; age?: number; nationality?: string }>;
};

type ApiTransfersResponse = {
  response: Array<{
    player: { name: string };
    transfers: Array<{
      date?: string;
      type?: string;
      teams?: { in?: { name?: string }; out?: { name?: string } };
    }>;
  }>;
};

type ApiTrophiesResponse = {
  response: Array<{ league: string; country?: string; season?: string; place?: string }>;
};

type ApiInjuriesResponse = {
  response: Array<{
    team: { id: number; name: string; logo: string };
    player: { name: string };
    type?: string;
    reason?: string;
  }>;
};

type ApiOddsResponse = {
  response: Array<{
    bookmakers: Array<{
      name: string;
      bets: Array<{
        name: string;
        values: Array<{ value: string; odd: string }>;
      }>;
    }>;
  }>;
};

type ApiStatsResponse = {
  response: Array<{
    team: { id: number; name: string; logo: string };
    statistics: Array<{ type: string; value: string | number | null }>;
  }>;
};

const TTL_MS = 24 * 60 * 60 * 1000;

const pendingRequests = new Map<string, Promise<MatchInsights>>();

const emptyInsights: MatchInsights = {
  standings: [],
  recentFixtures: [],
  headToHead: [],
  events: [],
  lineups: [],
  topScorers: [],
  rosters: [],
  coaches: [],
  transfers: [],
  trophies: [],
  injuries: [],
  odds: { prematch: [], live: [] },
  statistics: [],
};

const readCache = async (cacheKey: string): Promise<CacheEntry<MatchInsights> | null> => {
  try {
    const cachedRaw = await AsyncStorage.getItem(cacheKey);
    if (!cachedRaw) {
      return null;
    }
    return JSON.parse(cachedRaw) as CacheEntry<MatchInsights>;
  } catch (error) {
    console.warn('[MatchInsights] Failed to read cache', error);
    return null;
  }
};

const writeCache = async (cacheKey: string, entry: CacheEntry<MatchInsights>) => {
  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(entry));
  } catch (error) {
    console.warn('[MatchInsights] Failed to write cache', error);
  }
};

const isCacheValid = (entry: CacheEntry<MatchInsights>) => Date.now() < entry.cachedAt + entry.ttlMs;

const safeFetch = async <T>(path: string, params: Record<string, string | number>, context: string) => {
  try {
    const result = await fetchApiFootball<T>(path, params);
    if (!result.ok || !result.data) {
      console.warn('[MatchInsights] API request failed', { context, status: result.status });
      return null;
    }
    return result.data;
  } catch (error) {
    console.warn('[MatchInsights] API request error', { context, error });
    return null;
  }
};

const mapFixtureSummary = (fixture: ApiFixtureBase): FixtureSummary => {
  const goalsHome = fixture.goals.home;
  const goalsAway = fixture.goals.away;
  const score =
    typeof goalsHome === 'number' && typeof goalsAway === 'number'
      ? { home: goalsHome, away: goalsAway }
      : undefined;
  return {
    id: String(fixture.fixture.id),
    dateIso: fixture.fixture.date,
    status: fixture.fixture.status.short,
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
    score,
  };
};

const mapOdds = (data: ApiOddsResponse | null): OddsSummary[] => {
  if (!data?.response?.length) {
    return [];
  }
  const odds: OddsSummary[] = [];
  const response = data.response[0];
  response.bookmakers.forEach((bookmaker) => {
    const market = bookmaker.bets.find(
      (bet) => bet.name.toLowerCase().includes('match winner') || bet.name.toLowerCase().includes('1x2')
    );
    if (!market) {
      return;
    }
    const home = market.values.find((value) => {
      const normalized = value.value.toLowerCase();
      return normalized.includes('home') || normalized === '1';
    })?.odd;
    const draw = market.values.find((value) => {
      const normalized = value.value.toLowerCase();
      return normalized.includes('draw') || normalized === 'x';
    })?.odd;
    const away = market.values.find((value) => {
      const normalized = value.value.toLowerCase();
      return normalized.includes('away') || normalized === '2';
    })?.odd;
    if (!home && !draw && !away) {
      return;
    }
    odds.push({
      bookmaker: bookmaker.name,
      home: home ? Number(home) : undefined,
      draw: draw ? Number(draw) : undefined,
      away: away ? Number(away) : undefined,
    });
  });
  return odds;
};

const mapStatistics = (data: ApiStatsResponse | null): StatisticSummary[] => {
  if (!data?.response?.length) {
    return [];
  }
  const keyStats = new Set([
    'Shots on Goal',
    'Total Shots',
    'Ball Possession',
    'Fouls',
    'Corner Kicks',
    'Offsides',
  ]);
  return data.response.map((item) => ({
    team: {
      id: String(item.team.id),
      name: item.team.name,
      logoUrl: item.team.logo,
    },
    values: item.statistics
      .filter((stat) => keyStats.has(stat.type))
      .map((stat) => ({
        label: stat.type,
        value: stat.value === null || stat.value === undefined ? '-' : String(stat.value),
      })),
  }));
};

export const getMatchInsights = async (
  match: Match,
  options: { forceRefresh?: boolean; allowStale?: boolean } = {}
): Promise<MatchInsights> => {
  const cacheKey = `match-insights:${match.id}`;
  const cacheEntry = await readCache(cacheKey);
  if (cacheEntry && !options.forceRefresh) {
    if (isCacheValid(cacheEntry) || options.allowStale) {
      return cacheEntry.data;
    }
  }

  if (!options.forceRefresh && pendingRequests.has(cacheKey)) {
    return (await pendingRequests.get(cacheKey)) as MatchInsights;
  }

  const request = (async () => {
    try {
      const season = new Date(match.kickoffIso).getFullYear();
      const h2h = `${match.homeTeam.id}-${match.awayTeam.id}`;

      const [
        standingsData,
        headToHeadData,
        eventsData,
        lineupsData,
        topScorersData,
        homeFixturesData,
        awayFixturesData,
        homePlayersData,
        awayPlayersData,
        homeCoachesData,
        awayCoachesData,
        homeTransfersData,
        awayTransfersData,
        homeTrophiesData,
        awayTrophiesData,
        injuriesData,
        oddsPrematchData,
        oddsLiveData,
        statsData,
      ] = await Promise.all([
        safeFetch<ApiStandingsResponse>('/standings', { league: match.league.id, season }, 'standings'),
        safeFetch<ApiFixturesResponse>('/fixtures/headtohead', { h2h, last: 5 }, 'head-to-head'),
        safeFetch<ApiEventsResponse>('/fixtures/events', { fixture: match.id }, 'events'),
        safeFetch<ApiLineupsResponse>('/fixtures/lineups', { fixture: match.id }, 'lineups'),
        safeFetch<ApiTopScorersResponse>('/players/topscorers', { league: match.league.id, season }, 'topscorers'),
        safeFetch<ApiFixturesResponse>('/fixtures', { team: match.homeTeam.id, last: 5 }, 'home-fixtures'),
        safeFetch<ApiFixturesResponse>('/fixtures', { team: match.awayTeam.id, last: 5 }, 'away-fixtures'),
        safeFetch<ApiPlayersResponse>('/players', { team: match.homeTeam.id, season }, 'home-players'),
        safeFetch<ApiPlayersResponse>('/players', { team: match.awayTeam.id, season }, 'away-players'),
        safeFetch<ApiCoachesResponse>('/coachs', { team: match.homeTeam.id }, 'home-coach'),
        safeFetch<ApiCoachesResponse>('/coachs', { team: match.awayTeam.id }, 'away-coach'),
        safeFetch<ApiTransfersResponse>('/transfers', { team: match.homeTeam.id }, 'home-transfers'),
        safeFetch<ApiTransfersResponse>('/transfers', { team: match.awayTeam.id }, 'away-transfers'),
        safeFetch<ApiTrophiesResponse>('/trophies', { team: match.homeTeam.id }, 'home-trophies'),
        safeFetch<ApiTrophiesResponse>('/trophies', { team: match.awayTeam.id }, 'away-trophies'),
        safeFetch<ApiInjuriesResponse>('/injuries', { fixture: match.id }, 'injuries'),
        safeFetch<ApiOddsResponse>('/odds', { fixture: match.id }, 'odds-prematch'),
        safeFetch<ApiOddsResponse>('/odds', { fixture: match.id, live: 'all' }, 'odds-live'),
        safeFetch<ApiStatsResponse>('/fixtures/statistics', { fixture: match.id }, 'statistics'),
      ]);

      const standings =
        standingsData?.response?.[0]?.league?.standings?.[0]?.map((row) => ({
          rank: row.rank,
          team: { id: String(row.team.id), name: row.team.name, logoUrl: row.team.logo },
          points: row.points,
          played: row.all.played,
          win: row.all.win,
          draw: row.all.draw,
          lose: row.all.lose,
          goalDiff: row.goalsDiff,
          form: row.form,
        })) ?? [];

      const headToHead = headToHeadData?.response?.map(mapFixtureSummary) ?? [];

      const events =
        eventsData?.response?.map((event) => ({
          time: `${event.time.elapsed}${event.time.extra ? `+${event.time.extra}` : ''}'`,
          team: {
            id: String(event.team.id),
            name: event.team.name,
            logoUrl: event.team.logo,
          },
          player: event.player.name,
          detail: event.detail,
          type: event.type,
          assist: event.assist?.name ?? undefined,
        })) ?? [];

      const lineups =
        lineupsData?.response?.map((lineup) => ({
          team: {
            id: String(lineup.team.id),
            name: lineup.team.name,
            logoUrl: lineup.team.logo,
          },
          coach: lineup.coach?.name,
          formation: lineup.formation,
          starters: lineup.startXI.map((item) => ({
            name: item.player.name,
            number: item.player.number ?? undefined,
            position: item.player.pos ?? undefined,
          })),
          substitutes: lineup.substitutes.map((item) => ({
            name: item.player.name,
            number: item.player.number ?? undefined,
            position: item.player.pos ?? undefined,
          })),
        })) ?? [];

      const topScorers =
        topScorersData?.response?.slice(0, 6).map((scorer) => ({
          player: scorer.player.name,
          team: {
            id: String(scorer.team.id),
            name: scorer.team.name,
            logoUrl: scorer.team.logo,
          },
          goals: scorer.statistics[0]?.goals?.total ?? 0,
          appearances: scorer.statistics[0]?.games?.appearences ?? undefined,
        })) ?? [];

      const rosters: TeamRosterSummary[] = [
        {
          team: match.homeTeam,
          players:
            homePlayersData?.response?.slice(0, 6).map((player) => ({
              name: player.player.name,
              position: player.statistics[0]?.games?.position ?? undefined,
              age: player.player.age ?? undefined,
            })) ?? [],
        },
        {
          team: match.awayTeam,
          players:
            awayPlayersData?.response?.slice(0, 6).map((player) => ({
              name: player.player.name,
              position: player.statistics[0]?.games?.position ?? undefined,
              age: player.player.age ?? undefined,
            })) ?? [],
        },
      ];

      const coaches: CoachSummary[] = [
        ...(homeCoachesData?.response?.[0]
          ? [
              {
                team: match.homeTeam,
                name: homeCoachesData.response[0].name,
                age: homeCoachesData.response[0].age,
                nationality: homeCoachesData.response[0].nationality,
              },
            ]
          : []),
        ...(awayCoachesData?.response?.[0]
          ? [
              {
                team: match.awayTeam,
                name: awayCoachesData.response[0].name,
                age: awayCoachesData.response[0].age,
                nationality: awayCoachesData.response[0].nationality,
              },
            ]
          : []),
      ];

      const transfers = [
        ...(homeTransfersData?.response ?? []),
        ...(awayTransfersData?.response ?? []),
      ]
        .flatMap((transfer) =>
          transfer.transfers.slice(0, 1).map((detail) => ({
            player: transfer.player.name,
            date: detail.date,
            type: detail.type,
            from: detail.teams?.out?.name,
            to: detail.teams?.in?.name,
          }))
        )
        .slice(0, 6);

      const trophies = [
        ...(homeTrophiesData?.response ?? []),
        ...(awayTrophiesData?.response ?? []),
      ]
        .map((trophy) => ({
          name: trophy.league,
          country: trophy.country,
          season: trophy.season,
          place: trophy.place,
        }))
        .slice(0, 6);

      const injuries =
        injuriesData?.response?.map((injury) => ({
          team: {
            id: String(injury.team.id),
            name: injury.team.name,
            logoUrl: injury.team.logo,
          },
          player: injury.player.name,
          reason: injury.reason,
          type: injury.type,
        })) ?? [];

      const recentFixtures = [
        {
          team: match.homeTeam,
          fixtures: homeFixturesData?.response?.map(mapFixtureSummary) ?? [],
        },
        {
          team: match.awayTeam,
          fixtures: awayFixturesData?.response?.map(mapFixtureSummary) ?? [],
        },
      ];

      const insights: MatchInsights = {
        standings,
        recentFixtures,
        headToHead,
        events,
        lineups,
        topScorers,
        rosters,
        coaches,
        transfers,
        trophies,
        injuries,
        odds: {
          prematch: mapOdds(oddsPrematchData),
          live: mapOdds(oddsLiveData),
        },
        statistics: mapStatistics(statsData),
      };

      await writeCache(cacheKey, {
        data: insights,
        cachedAt: Date.now(),
        ttlMs: TTL_MS,
      });

      return insights;
    } catch (error) {
      if (cacheEntry) {
        console.warn('[MatchInsights] Using stale cache', { matchId: match.id });
        return cacheEntry.data;
      }
      console.warn('[MatchInsights] Failed to load insights', error);
      return emptyInsights;
    } finally {
      pendingRequests.delete(cacheKey);
    }
  })();

  pendingRequests.set(cacheKey, request);
  return request;
};
