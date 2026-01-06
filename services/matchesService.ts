import { mockMatches } from '@/data/matches';
import { Match } from '@/types';
import { isSameDay } from '@/utils/dateRange';

export const getMatchesByDate = async (dateIso: string): Promise<Match[]> => {
  return Promise.resolve(mockMatches.filter((match) => isSameDay(match.kickoffIso, dateIso)));
};

export const getAllMatches = async (): Promise<Match[]> => Promise.resolve(mockMatches);
