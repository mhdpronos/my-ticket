import { buildPredictionsForMatch } from '@/data/predictions';
import { Prediction } from '@/types';

export const getPredictionsForMatch = async (matchId: string): Promise<Prediction[]> => {
  return Promise.resolve(buildPredictionsForMatch(matchId));
};
