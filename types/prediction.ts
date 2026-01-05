export type RiskLevel = 'SAFE' | 'MEDIUM' | 'RISKY';

export interface Prediction {
  id: string;
  matchId: string;
  label: string;
  market: string;
  isPremium: boolean;
  riskLevel: RiskLevel;
}
