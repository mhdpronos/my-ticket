import { generatePredictionsForMatch } from '@/data/mockPredictions';
import type { Prediction } from '@/types/prediction';

export const predictionsService = {
  getPredictionsByMatch(matchId: string): Prediction[] {
    return generatePredictionsForMatch(matchId);
  },
};
