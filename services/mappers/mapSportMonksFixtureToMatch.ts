import { Match, MatchScore, MatchStatus } from '@/types';

export type SportMonksParticipant = {
  id: number;
  name: string;
  image_path?: string | null;
  meta?: {
    location?: 'home' | 'away';
  };
};

export type SportMonksFixture = {
  id: number;
  starting_at: string;
  state?: string | null;
  league?: {
    id: number;
    name: string;
    country?: {
      name?: string | null;
    } | null;
  } | null;
  participants?: SportMonksParticipant[] | null;
  venue?: {
    name?: string | null;
  } | null;
  time?: {
    minute?: number | null;
  } | null;
  scores?: Array<{
    description?: string | null;
    participant_id?: number | null;
    score?: {
      participant_id?: number | null;
      goals?: number | null;
    } | null;
  }> | null;
};

const mapStatus = (state?: string | null): MatchStatus => {
  const normalized = state?.toLowerCase() ?? '';
  if (normalized.includes('live') || normalized.includes('inplay') || normalized.includes('in-play')) {
    return 'live';
  }
  if (normalized.includes('finished') || normalized.includes('ft') || normalized.includes('ended')) {
    return 'finished';
  }
  return 'upcoming';
};

const getParticipantByLocation = (fixture: SportMonksFixture, location: 'home' | 'away') =>
  fixture.participants?.find((participant) => participant.meta?.location === location) ?? null;

const buildScoreMap = (fixture: SportMonksFixture) => {
  const scores = fixture.scores ?? [];
  const normalizedScores = scores.map((entry) => ({
    description: entry.description?.toLowerCase() ?? '',
    participantId: entry.participant_id ?? entry.score?.participant_id ?? null,
    goals: entry.score?.goals ?? null,
  }));

  const preferredScores = normalizedScores.filter((entry) =>
    ['current', 'ft', 'fulltime', 'final'].some((token) => entry.description.includes(token))
  );

  const sourceScores = preferredScores.length > 0 ? preferredScores : normalizedScores;
  const scoreMap = new Map<number, number>();
  sourceScores.forEach((entry) => {
    if (entry.participantId && typeof entry.goals === 'number') {
      scoreMap.set(entry.participantId, entry.goals);
    }
  });
  return scoreMap;
};

const buildScore = (fixture: SportMonksFixture, home?: SportMonksParticipant | null, away?: SportMonksParticipant | null) => {
  if (!home || !away) {
    return undefined;
  }
  const scoreMap = buildScoreMap(fixture);
  const homeGoals = scoreMap.get(home.id);
  const awayGoals = scoreMap.get(away.id);
  if (typeof homeGoals === 'number' && typeof awayGoals === 'number') {
    return { home: homeGoals, away: awayGoals } as MatchScore;
  }
  return undefined;
};

export const mapSportMonksFixtureToMatch = (fixture: SportMonksFixture): Match => {
  const homeParticipant = getParticipantByLocation(fixture, 'home') ?? fixture.participants?.[0] ?? null;
  const awayParticipant = getParticipantByLocation(fixture, 'away') ?? fixture.participants?.[1] ?? null;

  const status = mapStatus(fixture.state);
  const score = buildScore(fixture, homeParticipant, awayParticipant);

  return {
    id: String(fixture.id),
    homeTeam: {
      id: String(homeParticipant?.id ?? '0'),
      name: homeParticipant?.name ?? 'Home',
      logoUrl: homeParticipant?.image_path ?? '',
    },
    awayTeam: {
      id: String(awayParticipant?.id ?? '0'),
      name: awayParticipant?.name ?? 'Away',
      logoUrl: awayParticipant?.image_path ?? '',
    },
    league: {
      id: String(fixture.league?.id ?? '0'),
      name: fixture.league?.name ?? 'Unknown League',
      country: fixture.league?.country?.name ?? 'International',
    },
    kickoffIso: fixture.starting_at,
    status,
    score,
    liveMinute: fixture.time?.minute ?? undefined,
    venue: fixture.venue?.name ?? undefined,
  };
};
