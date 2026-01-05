import type { Bookmaker } from '@/types/odds';
import type { League } from '@/types/league';
import type { Team } from '@/types/team';

export const leagues: League[] = [
  { id: 'ligue-1', name: 'Ligue 1', country: 'France' },
  { id: 'premier-league', name: 'Premier League', country: 'Angleterre' },
  { id: 'la-liga', name: 'La Liga', country: 'Espagne' },
  { id: 'serie-a', name: 'Serie A', country: 'Italie' },
  { id: 'bundesliga', name: 'Bundesliga', country: 'Allemagne' },
];

export const teams: Team[] = [
  { id: 'psg', name: 'Paris SG', shortName: 'PSG' },
  { id: 'om', name: 'Marseille', shortName: 'OM' },
  { id: 'ol', name: 'Lyon', shortName: 'OL' },
  { id: 'monaco', name: 'Monaco', shortName: 'ASM' },
  { id: 'lille', name: 'Lille', shortName: 'LOSC' },
  { id: 'real', name: 'Real Madrid', shortName: 'RMA' },
  { id: 'barca', name: 'FC Barcelone', shortName: 'FCB' },
  { id: 'atleti', name: 'Atlético', shortName: 'ATM' },
  { id: 'valencia', name: 'Valence', shortName: 'VAL' },
  { id: 'sevilla', name: 'Séville', shortName: 'SEV' },
  { id: 'liverpool', name: 'Liverpool', shortName: 'LIV' },
  { id: 'arsenal', name: 'Arsenal', shortName: 'ARS' },
  { id: 'chelsea', name: 'Chelsea', shortName: 'CHE' },
  { id: 'city', name: 'Man City', shortName: 'MCI' },
  { id: 'united', name: 'Man United', shortName: 'MUN' },
  { id: 'inter', name: 'Inter', shortName: 'INT' },
  { id: 'milan', name: 'AC Milan', shortName: 'MIL' },
  { id: 'juve', name: 'Juventus', shortName: 'JUV' },
  { id: 'napoli', name: 'Napoli', shortName: 'NAP' },
  { id: 'roma', name: 'Roma', shortName: 'ROM' },
];

export const bookmakers: Bookmaker[] = [
  { id: '1xbet', name: '1xBet' },
  { id: 'betwinner', name: 'Betwinner' },
  { id: 'melbet', name: 'Melbet' },
];
