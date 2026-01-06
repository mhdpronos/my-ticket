import React, { createContext, useContext, useMemo, useState } from 'react';
import { userService } from '@/services/userService';
import type { UserAccess, UserProfile } from '@/types/user';

interface UserStore {
  user: UserProfile;
  setAccess: (access: UserAccess) => void;
}

const UserContext = createContext<UserStore | undefined>(undefined);

export const UserStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile>(userService.getCurrentUser());

  const value = useMemo<UserStore>(
    () => ({
      user,
      setAccess: (access) => setUser((prev) => ({ ...prev, access })),
    }),
    [user],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserStore = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserStore must be used within UserStoreProvider');
  }
  return context;
};
