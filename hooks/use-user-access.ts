import { useMemo } from 'react';

import { mockUserAccess } from '@/data/mock-user';
import { UserAccess } from '@/types/domain';

// Placeholder hook for subscription access.
// Replace with Firebase + RevenueCat state when available.

export function useUserAccess(): UserAccess {
  return useMemo(() => mockUserAccess, []);
}
