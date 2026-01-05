// Données fictives pour alimenter l'interface et le flux du ticket.
// À remplacer par une API réelle quand ce sera prêt.

import { Match } from '@/types/domaine';

export const rencontresFictives: Match[] = [
  {
    id: 'match-001',
    homeTeam: 'Barcelona',
    awayTeam: 'Sevilla',
    league: 'La Liga',
    country: 'Spain',
    kickoffIso: '2025-02-02T18:00:00.000Z',
    status: 'upcoming',
    predictions: [
      {
        id: 'pred-001',
        label: 'Barcelona gagne',
        market: '1X2',
        selection: 'HOME',
        confidence: 4,
        tier: 'free',
        bookmakers: [
          { id: 'book-1xbet', name: '1xBet', oddsDecimal: 1.5 },
          { id: 'book-betwinner', name: 'Betwinner', oddsDecimal: 1.6 },
          { id: 'book-melbet', name: 'Melbet', oddsDecimal: 1.55 },
        ],
      },
      {
        id: 'pred-002',
        label: 'Plus de 2.5 buts',
        market: 'OVER_UNDER',
        selection: 'OVER',
        confidence: 3,
        tier: 'free',
        bookmakers: [
          { id: 'book-1xbet', name: '1xBet', oddsDecimal: 1.85 },
          { id: 'book-betwinner', name: 'Betwinner', oddsDecimal: 1.9 },
        ],
      },
      {
        id: 'pred-003',
        label: 'Les deux équipes marquent',
        market: 'BOTH_TEAMS_SCORE',
        selection: 'YES',
        confidence: 3,
        tier: 'free',
        bookmakers: [
          { id: 'book-1xbet', name: '1xBet', oddsDecimal: 1.72 },
          { id: 'book-melbet', name: 'Melbet', oddsDecimal: 1.75 },
        ],
      },
      {
        id: 'pred-004',
        label: 'Barça gagne et +1.5 buts',
        market: 'HANDICAP',
        selection: 'HOME',
        confidence: 5,
        tier: 'premium',
        bookmakers: [
          { id: 'book-1xbet', name: '1xBet', oddsDecimal: 2.4 },
          { id: 'book-betwinner', name: 'Betwinner', oddsDecimal: 2.35 },
        ],
      },
      {
        id: 'pred-005',
        label: 'Barça gagne sans encaisser',
        market: 'DOUBLE_CHANCE',
        selection: 'HOME',
        confidence: 4,
        tier: 'premium',
        bookmakers: [
          { id: 'book-melbet', name: 'Melbet', oddsDecimal: 2.7 },
        ],
      },
      {
        id: 'pred-006',
        label: 'Score exact 2-0',
        market: '1X2',
        selection: 'HOME',
        confidence: 2,
        tier: 'premium',
        bookmakers: [
          { id: 'book-1xbet', name: '1xBet', oddsDecimal: 6.5 },
        ],
      },
    ],
  },
  {
    id: 'match-002',
    homeTeam: 'PSG',
    awayTeam: 'Lyon',
    league: 'Ligue 1',
    country: 'France',
    kickoffIso: '2025-02-02T20:00:00.000Z',
    status: 'upcoming',
    predictions: [
      {
        id: 'pred-007',
        label: 'PSG gagne',
        market: '1X2',
        selection: 'HOME',
        confidence: 4,
        tier: 'free',
        bookmakers: [
          { id: 'book-1xbet', name: '1xBet', oddsDecimal: 1.45 },
          { id: 'book-betwinner', name: 'Betwinner', oddsDecimal: 1.48 },
        ],
      },
      {
        id: 'pred-008',
        label: 'Plus de 2.5 buts',
        market: 'OVER_UNDER',
        selection: 'OVER',
        confidence: 3,
        tier: 'free',
        bookmakers: [
          { id: 'book-melbet', name: 'Melbet', oddsDecimal: 1.78 },
        ],
      },
      {
        id: 'pred-009',
        label: 'BTTS Oui',
        market: 'BOTH_TEAMS_SCORE',
        selection: 'YES',
        confidence: 3,
        tier: 'free',
        bookmakers: [
          { id: 'book-1xbet', name: '1xBet', oddsDecimal: 1.7 },
        ],
      },
      {
        id: 'pred-010',
        label: 'PSG gagne + BTTS',
        market: 'DOUBLE_CHANCE',
        selection: 'HOME',
        confidence: 5,
        tier: 'premium',
        bookmakers: [
          { id: 'book-betwinner', name: 'Betwinner', oddsDecimal: 2.9 },
        ],
      },
      {
        id: 'pred-011',
        label: 'Mbappé buteur',
        market: '1X2',
        selection: 'HOME',
        confidence: 4,
        tier: 'premium',
        bookmakers: [
          { id: 'book-melbet', name: 'Melbet', oddsDecimal: 2.2 },
        ],
      },
      {
        id: 'pred-012',
        label: 'PSG gagne à la mi-temps',
        market: '1X2',
        selection: 'HOME',
        confidence: 3,
        tier: 'premium',
        bookmakers: [
          { id: 'book-1xbet', name: '1xBet', oddsDecimal: 2.1 },
        ],
      },
    ],
  },
];
