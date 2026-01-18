import { bookmakers } from '@/data/bookmakers';
import { Bookmaker, OddsByBookmaker, Prediction } from '@/types';

let cachedBookmakers: Bookmaker[] | null = null;

export const fetchBookmakers = async (): Promise<Bookmaker[]> => {
  if (cachedBookmakers) {
    return cachedBookmakers;
  }
  cachedBookmakers = bookmakers;
  return cachedBookmakers;
};

export const fetchOddsForPrediction = async (prediction: Prediction): Promise<OddsByBookmaker> => {
  if (prediction.market !== '1X2') {
    return {};
  }
  const oddsMap: OddsByBookmaker = {};
  return oddsMap;
};
