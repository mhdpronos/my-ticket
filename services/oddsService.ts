import { bookmakers } from '@/data/bookmakers';
import { mockOddsByKey, OddsKey } from '@/data/odds';
import { OddsByBookmaker, Prediction } from '@/types';

export const getBookmakers = () => bookmakers;

export const getOddsForPrediction = (prediction: Prediction): OddsByBookmaker => {
  const key: OddsKey = `${prediction.matchId}:${prediction.market}:${prediction.selection}`;
  return mockOddsByKey[key] ?? {};
};
