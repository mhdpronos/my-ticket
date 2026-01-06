import { Prediction } from '@/types';

const basePredictions = [
  {
    label: 'Victoire domicile',
    market: '1X2',
    selection: 'HOME',
    tier: 'free',
    risk: 'safe',
  },
  {
    label: 'Plus de 1.5 buts',
    market: 'OVER_UNDER',
    selection: 'OVER',
    tier: 'free',
    risk: 'medium',
  },
  {
    label: 'Les deux équipes marquent',
    market: 'BOTH_TEAMS_SCORE',
    selection: 'YES',
    tier: 'free',
    risk: 'medium',
  },
  {
    label: 'Victoire domicile + +1.5 buts',
    market: 'HANDICAP',
    selection: 'HOME',
    tier: 'premium',
    risk: 'risky',
  },
  {
    label: 'Victoire domicile sans encaisser',
    market: 'DOUBLE_CHANCE',
    selection: 'HOME',
    tier: 'premium',
    risk: 'risky',
  },
  {
    label: 'Score exact 2-0',
    market: '1X2',
    selection: 'HOME',
    tier: 'premium',
    risk: 'risky',
  },
] as const;

export const buildPredictionsForMatch = (matchId: string): Prediction[] =>
  basePredictions.map((prediction, index) => ({
    id: `${matchId}-pred-${index}`,
    matchId,
    label: prediction.label,
    market: prediction.market,
    selection: prediction.selection,
    tier: prediction.tier,
    risk: prediction.risk,
  }));
