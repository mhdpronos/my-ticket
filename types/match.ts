import type { League } from './league';
import type { Team } from './team';

export interface Match {
  id: string;
  date: string;
  time: string;
  league: League;
  homeTeam: Team;
  awayTeam: Team;
}
