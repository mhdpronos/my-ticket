import { useMemo } from 'react';

import { accesUtilisateurFactice } from '@/donnees/utilisateur-factice';
import { UserAccess } from '@/types/domaine';

// Crochet temporaire pour l'accès à l'abonnement.
// À remplacer plus tard par l'état Firebase + RevenueCat.

export function useAccesUtilisateur(): UserAccess {
  return useMemo(() => accesUtilisateurFactice, []);
}
