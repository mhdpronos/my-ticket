import { generateMatchesForDate } from '@/data/mockMatches';
import type { Match } from '@/types/match';

export const matchesService = {
  getMatchesForDate(date: Date, count = 50): Match[] {
    return generateMatchesForDate(date, count);
  },
  getMatchById(matchId: string): Match | undefined {
    const dateKey = matchId.split('-').slice(0, 3).join('-');
    const [year, month, day] = dateKey.split('-').map(Number);
    if (!year || !month || !day) {
      return undefined;
    }
    const matches = generateMatchesForDate(new Date(year, month - 1, day), 50);
    return matches.find((match) => match.id === matchId);
  },
};
