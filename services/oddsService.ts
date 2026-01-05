import { generateOdds } from '@/data/mockOdds';
import type { OddsByBookmaker } from '@/types/odds';

export const oddsService = {
  getOdds(matchId: string, market: string): OddsByBookmaker {
    return generateOdds(`${matchId}-${market}`);
  },
};
