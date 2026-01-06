import type { UserProfile } from '@/types/user';

const defaultUser: UserProfile = {
  id: 'guest',
  name: 'Invité',
  access: 'FREE',
};

export const userService = {
  getCurrentUser(): UserProfile {
    return defaultUser;
  },
};
