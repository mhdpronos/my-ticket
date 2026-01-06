// Le code qui prépare les matchs fictifs pour l'affichage.
import { leagues } from '@/data/leagues';
import { teams } from '@/data/teams';
import { Match, MatchScore, MatchWinRate } from '@/types';
import { buildRollingDates } from '@/utils/dateRange';

const MATCHES_PER_DAY = 18;

const buildKickoff = (baseDate: Date, index: number) => {
  const kickoff = new Date(baseDate);
  const hour = 12 + (index % 10);
  const minute = (index % 4) * 15;
  kickoff.setHours(hour, minute, 0, 0);
  return kickoff.toISOString();
};

const buildScore = (seed: number, isLive: boolean): MatchScore => {
  const home = (seed % 3) + (isLive ? 1 : 0);
  const away = (seed % 2) + (isLive ? 0 : 1);
  return { home, away };
};

const buildWinRate = (seed: number): MatchWinRate => {
  const base = 40 + (seed % 25);
  const home = Math.min(78, base + (seed % 8));
  const away = Math.max(18, 100 - home - (seed % 12));
  const draw = Math.max(8, 100 - home - away);
  return { home, draw, away };
};

const buildStatus = (index: number): Match['status'] => {
  if (index % 6 === 0) {
    return 'live';
  }
  if (index % 6 === 1) {
    return 'finished';
  }
  return 'upcoming';
};

export const generateMockMatches = (): Match[] => {
  const rollingDates = buildRollingDates();
  const matches: Match[] = [];

  rollingDates.forEach((rollingDate, dayIndex) => {
    for (let i = 0; i < MATCHES_PER_DAY; i += 1) {
      const homeIndex = (dayIndex * 7 + i) % teams.length;
      let awayIndex = (homeIndex + 3 + i) % teams.length;
      if (awayIndex === homeIndex) {
        awayIndex = (awayIndex + 1) % teams.length;
      }

      const league = leagues[(dayIndex + i) % leagues.length];
      const status = buildStatus(i + dayIndex);
      const isLive = status === 'live';
      const isFinished = status === 'finished';
      const score = isLive || isFinished ? buildScore(i + dayIndex, isLive) : undefined;

      matches.push({
        id: `match-${dayIndex}-${i}`,
        homeTeam: teams[homeIndex],
        awayTeam: teams[awayIndex],
        league,
        kickoffIso: buildKickoff(rollingDate.date, i),
        status,
        score,
        liveMinute: isLive ? 12 + (i % 78) : undefined,
        winRate: buildWinRate(i + dayIndex),
        venue: `${league.country} Arena ${i + 1}`,
      });
    }
  });

  return matches;
};

export const mockMatches = generateMockMatches();
