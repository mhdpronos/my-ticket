import type { Prediction, RiskLevel } from '@/types/prediction';

const riskLevels: RiskLevel[] = ['SAFE', 'MEDIUM', 'RISKY'];

export const generatePredictionsForMatch = (matchId: string): Prediction[] => {
  const basePredictions = [
    { label: 'Victoire domicile', market: '1X2' },
    { label: 'Double chance 1X', market: 'Double chance' },
    { label: 'Moins de 3.5 buts', market: 'Total buts' },
    { label: 'Les deux équipes marquent', market: 'BTTS' },
    { label: 'Victoire extérieur', market: '1X2' },
    { label: 'Plus de 2.5 buts', market: 'Total buts' },
  ];

  return basePredictions.map((item, index) => ({
    id: `${matchId}-prediction-${index}`,
    matchId,
    label: item.label,
    market: item.market,
    isPremium: index >= 3,
    riskLevel: riskLevels[index % riskLevels.length],
  }));
};
