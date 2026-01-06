export type Team = {
  id: string;
  name: string;
};

export type League = {
  id: string;
  name: string;
  country: string;
};

export type MatchStatus = 'upcoming' | 'live' | 'finished';

export type Match = {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  league: League;
  kickoffIso: string;
  status: MatchStatus;
};

export type MarketType = '1X2' | 'OVER_UNDER' | 'BOTH_TEAMS_SCORE' | 'DOUBLE_CHANCE' | 'HANDICAP';

export type SelectionType = 'HOME' | 'DRAW' | 'AWAY' | 'OVER' | 'UNDER' | 'YES' | 'NO';

export type PredictionTier = 'free' | 'premium';

export type RiskLevel = 'safe' | 'medium' | 'risky';

export type Prediction = {
  id: string;
  matchId: string;
  label: string;
  market: MarketType;
  selection: SelectionType;
  tier: PredictionTier;
  risk: RiskLevel;
};

export type TicketItem = {
  match: Match;
  prediction: Prediction;
};

export type OddsByBookmaker = Record<string, number>;

export type UserAccess = {
  status: 'FREE' | 'PREMIUM';
  isGuest: boolean;
};

export type Bookmaker = {
  id: string;
  name: string;
};
