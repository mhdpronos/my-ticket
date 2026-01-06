import { leagues } from '@/data/leagues';
import { teams } from '@/data/teams';
import { Match } from '@/types';
import { buildRollingDates } from '@/utils/dateRange';

const MATCHES_PER_DAY = 50;

const buildKickoff = (baseDate: Date, index: number) => {
  const kickoff = new Date(baseDate);
  const hour = 12 + (index % 10);
  const minute = (index % 4) * 15;
  kickoff.setHours(hour, minute, 0, 0);
  return kickoff.toISOString();
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

      matches.push({
        id: `match-${dayIndex}-${i}`,
        homeTeam: teams[homeIndex],
        awayTeam: teams[awayIndex],
        league,
        kickoffIso: buildKickoff(rollingDate.date, i),
        status: 'upcoming',
      });
    }
  });

  return matches;
};

export const mockMatches = generateMockMatches();
