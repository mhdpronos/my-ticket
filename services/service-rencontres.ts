// Accès centralisé aux données de matchs.
// Remplacer plus tard par une API réelle + cache Firestore.

import { rencontresFictives } from '@/donnees/rencontres-fictives';
import { Match } from '@/types/domaine';

export const getMatches = async (): Promise<Match[]> => {
  return Promise.resolve(rencontresFictives);
};
