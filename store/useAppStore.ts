// Le code qui gère l'état global de l'application avec Zustand.
import { create } from 'zustand';

import { Match, Prediction, TicketItem, UserAccess, UserProfile } from '@/types';

type AppState = {
  themePreference: 'system' | 'light' | 'dark' | 'nocturne';
  setThemePreference: (theme: 'system' | 'light' | 'dark' | 'nocturne') => void;
  language: 'fr' | 'en';
  setLanguage: (language: 'fr' | 'en') => void;
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
  userId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  country: '',
  city: '',
};

export const useAppStore = create<AppState>((set) => ({
  themePreference: 'nocturne',
  setThemePreference: (theme) =>
    set((state) => (state.themePreference === theme ? state : { themePreference: theme })),
  language: 'fr',
  setLanguage: (language) => set((state) => (state.language === language ? state : { language })),
  notificationsEnabled: true,
  setNotificationsEnabled: (enabled) =>
    set((state) => (state.notificationsEnabled === enabled ? state : { notificationsEnabled: enabled })),
  twoFactorEnabled: true,
  setTwoFactorEnabled: (enabled) =>
    set((state) => (state.twoFactorEnabled === enabled ? state : { twoFactorEnabled: enabled })),
  appUnlockEnabled: true,
  setAppUnlockEnabled: (enabled) =>
    set((state) => (state.appUnlockEnabled === enabled ? state : { appUnlockEnabled: enabled })),
  loginBiometricEnabled: false,
  setLoginBiometricEnabled: (enabled) =>
    set((state) => (state.loginBiometricEnabled === enabled ? state : { loginBiometricEnabled: enabled })),
  selectedDateId: null,
  setSelectedDateId: (dateId) => set((state) => (state.selectedDateId === dateId ? state : { selectedDateId: dateId })),
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
