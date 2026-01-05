// Types de domaine centraux pour l'application.
// Ces types sont partagés entre écrans, sources de données et composants.

export type MarketType =
  | '1X2'
  | 'OVER_UNDER'
  | 'BOTH_TEAMS_SCORE'
  | 'DOUBLE_CHANCE'
  | 'HANDICAP';

export type SelectionType = 'HOME' | 'DRAW' | 'AWAY' | 'OVER' | 'UNDER' | 'YES' | 'NO';

export type MatchStatus = 'upcoming' | 'live' | 'finished';

export type BookmakerOdds = {
  id: string;
  name: string;
  oddsDecimal: number;
  deepLink?: string;
};

export type Prediction = {
  id: string;
  label: string;
  market: MarketType;
  selection: SelectionType;
  confidence: 1 | 2 | 3 | 4 | 5;
  tier: 'free' | 'premium';
  bookmakers: BookmakerOdds[];
};

export type Match = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  country: string;
  kickoffIso: string;
  status: MatchStatus;
  predictions: Prediction[];
};

export type TicketItem = {
  matchId: string;
  matchLabel: string;
  prediction: Prediction;
};

export type UserAccess = {
  isPremium: boolean;
};
