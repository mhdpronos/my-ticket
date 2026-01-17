import { Prediction } from '@/types';

const basePredictions = [
  {
    label: '1X2: V1',
    market: '1X2',
    selection: 'HOME',
    selectionLabel: 'V1',
    tier: 'free',
    risk: 'safe',
    odds: 1.25,
  },
  {
    label: '1X2: X',
    market: '1X2',
    selection: 'DRAW',
    selectionLabel: 'X',
    tier: 'free',
    risk: 'medium',
    odds: 1.28,
  },
  {
    label: '1X2: V2',
    market: '1X2',
    selection: 'AWAY',
    selectionLabel: 'V2',
    tier: 'free',
    risk: 'medium',
    odds: 1.3,
  },
  {
    label: 'DOUBLE_CHANCE: 12',
    market: 'DOUBLE_CHANCE',
    selection: 'HOME',
    selectionLabel: '12',
    tier: 'free',
    risk: 'safe',
    odds: 1.22,
  },
  {
    label: 'OVER_UNDER: +1.5',
    market: 'OVER_UNDER',
    selection: 'OVER',
    selectionLabel: '+1.5',
    tier: 'free',
    risk: 'medium',
    odds: 1.26,
  },
  {
    label: 'BOTH_TEAMS_SCORE: Oui',
    market: 'BOTH_TEAMS_SCORE',
    selection: 'YES',
    selectionLabel: 'Oui',
    tier: 'free',
    risk: 'medium',
    odds: 1.29,
  },
  {
    label: '1X2: V1',
    market: '1X2',
    selection: 'HOME',
    selectionLabel: 'V1',
    tier: 'premium',
    risk: 'medium',
    odds: 1.55,
  },
  {
    label: '1X2: V2',
    market: '1X2',
    selection: 'AWAY',
    selectionLabel: 'V2',
    tier: 'premium',
    risk: 'risky',
    odds: 1.82,
  },
  {
    label: 'DOUBLE_CHANCE: 1X',
    market: 'DOUBLE_CHANCE',
    selection: 'HOME',
    selectionLabel: '1X',
    tier: 'premium',
    risk: 'safe',
    odds: 1.45,
  },
  {
    label: 'DOUBLE_CHANCE: X2',
    market: 'DOUBLE_CHANCE',
    selection: 'AWAY',
    selectionLabel: 'X2',
    tier: 'premium',
    risk: 'safe',
    odds: 1.5,
  },
  {
    label: 'HANDICAP: V1 -1',
    market: 'HANDICAP',
    selection: 'HOME',
    selectionLabel: 'V1 -1',
    tier: 'premium',
    risk: 'risky',
    odds: 1.9,
  },
  {
    label: 'OVER_UNDER: +2.5',
    market: 'OVER_UNDER',
    selection: 'OVER',
    selectionLabel: '+2.5',
    tier: 'premium',
    risk: 'risky',
    odds: 1.75,
  },
] as const;

type ConfidenceOverride = Partial<Record<'HOME' | 'DRAW' | 'AWAY', number>>;

export const buildPredictionsForMatch = (
  matchId: string,
  confidenceOverrides: ConfidenceOverride = {}
): Prediction[] =>
  basePredictions.map((prediction, index) => {
    const confidence =
      prediction.market === '1X2'
        ? confidenceOverrides[prediction.selection as 'HOME' | 'DRAW' | 'AWAY']
        : undefined;
    return {
      id: `${matchId}-pred-${index}`,
      matchId,
      label: prediction.label,
      market: prediction.market,
      selection: prediction.selection,
      selectionLabel: prediction.selectionLabel,
      tier: prediction.tier,
      risk: prediction.risk,
      odds: prediction.odds,
      confidence: typeof confidence === 'number' && prediction.market === '1X2' ? confidence : undefined,
    };
  });
