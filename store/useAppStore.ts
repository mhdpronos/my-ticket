// Le code qui gère l'état global de l'application avec Zustand.
import { create } from 'zustand';

import { Match, Prediction, TicketItem, UserAccess, UserProfile } from '@/types';

type AppState = {
  language: 'fr' | 'en';
  setLanguage: (language: 'fr' | 'en') => void;
  themePreference: 'system' | 'light' | 'dark' | 'nocturne';
  setThemePreference: (theme: 'system' | 'light' | 'dark' | 'nocturne') => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (enabled: boolean) => void;
  appUnlockEnabled: boolean;
  setAppUnlockEnabled: (enabled: boolean) => void;
  loginBiometricEnabled: boolean;
  setLoginBiometricEnabled: (enabled: boolean) => void;
  selectedDateId: string | null;
  setSelectedDateId: (dateId: string) => void;
  ticketItems: TicketItem[];
  addTicketItem: (match: Match, prediction: Prediction) => void;
  removeTicketItem: (matchId: string) => void;
  clearTicket: () => void;
  favoriteMatches: Match[];
  toggleFavoriteMatch: (match: Match) => void;
  userAccess: UserAccess;
  setUserAccess: (access: UserAccess) => void;
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  signOut: () => void;
};

const initialProfile: UserProfile = {
  fullName: '',
  email: '',
  phone: '',
  city: '',
  favoriteTeam: '',
  birthDate: '',
};

export const useAppStore = create<AppState>((set) => ({
  language: 'fr',
  setLanguage: (language) => set({ language }),
  themePreference: 'nocturne',
  setThemePreference: (themePreference) => set({ themePreference }),
  notificationsEnabled: true,
  setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
  twoFactorEnabled: true,
  setTwoFactorEnabled: (enabled) => set({ twoFactorEnabled: enabled }),
  appUnlockEnabled: true,
  setAppUnlockEnabled: (enabled) => set({ appUnlockEnabled: enabled }),
  loginBiometricEnabled: false,
  setLoginBiometricEnabled: (enabled) => set({ loginBiometricEnabled: enabled }),
  selectedDateId: null,
  setSelectedDateId: (dateId) => set({ selectedDateId: dateId }),
  ticketItems: [],
  addTicketItem: (match, prediction) =>
    set((state) => {
      const exists = state.ticketItems.some((item) => item.match.id === match.id);
      const item: TicketItem = { match, prediction };
      return {
        ticketItems: exists
          ? state.ticketItems.map((entry) => (entry.match.id === match.id ? item : entry))
          : [...state.ticketItems, item],
      };
    }),
  removeTicketItem: (matchId) =>
    set((state) => ({
      ticketItems: state.ticketItems.filter((item) => item.match.id !== matchId),
    })),
  clearTicket: () => set({ ticketItems: [] }),
  favoriteMatches: [],
  toggleFavoriteMatch: (match) =>
    set((state) => {
      const exists = state.favoriteMatches.some((item) => item.id === match.id);
      return {
        favoriteMatches: exists
          ? state.favoriteMatches.filter((item) => item.id !== match.id)
          : [match, ...state.favoriteMatches],
      };
    }),
  userAccess: { status: 'FREE', isGuest: true },
  setUserAccess: (access) => set({ userAccess: access }),
  userProfile: initialProfile,
  updateUserProfile: (profile) =>
    set((state) => ({
      userProfile: {
        ...state.userProfile,
        ...profile,
      },
    })),
  signOut: () =>
    set({
      userAccess: { status: 'FREE', isGuest: true },
      userProfile: initialProfile,
      ticketItems: [],
      favoriteMatches: [],
    }),
}));
