// Central data access for matches.
// Swap mock data with real API + Firestore cache later.

import { mockMatches } from '@/data/mock-matches';
import { Match } from '@/types/domain';

export const getMatches = async (): Promise<Match[]> => {
  return Promise.resolve(mockMatches);
};
