import { leagues, teams } from './mockCatalog';
import type { Match } from '@/types/match';
import { formatTime, toDateKey } from '@/utils/date';

const matchCache = new Map<string, Match[]>();

const pickTeam = (index: number) => teams[index % teams.length];

export const generateMatchesForDate = (date: Date, count = 50): Match[] => {
  const dateKey = toDateKey(date);
  if (matchCache.has(dateKey)) {
    return matchCache.get(dateKey) ?? [];
  }

  const matches: Match[] = [];
  for (let i = 0; i < count; i += 1) {
    const league = leagues[i % leagues.length];
    const homeTeam = pickTeam(i + 3);
    const awayTeam = pickTeam(i + 10);
    const matchDate = new Date(date);
    matchDate.setHours(10 + (i % 10) * 2, 0, 0, 0);

    matches.push({
      id: `${dateKey}-${i}`,
      date: dateKey,
      time: formatTime(matchDate),
      league,
      homeTeam,
      awayTeam,
    });
  }

  matchCache.set(dateKey, matches);
  return matches;
};
