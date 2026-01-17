// Le code qui définit les types de données principaux de l'app.
export type Team = {
  id: string;
  name: string;
  logoUrl: string;
};

export type League = {
  id: string;
  name: string;
  country: string;
};

export type MatchStatus = 'upcoming' | 'live' | 'finished';

export type MatchScore = {
  home: number;
  away: number;
};

export type MatchWinRate = {
  home: number;
  draw: number;
  away: number;
};

export type Match = {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  league: League;
  kickoffIso: string;
  status: MatchStatus;
  score?: MatchScore;
  liveMinute?: number;
  winRate?: MatchWinRate;
  venue?: string;
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
  confidence?: number;
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

export type UserProfile = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  country: string;
  city: string;
};
