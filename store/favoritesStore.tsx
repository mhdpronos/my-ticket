import React, { createContext, useContext, useMemo, useState } from 'react';

interface FavoritesStore {
  teamIds: string[];
  leagueIds: string[];
  toggleTeam: (teamId: string) => void;
  toggleLeague: (leagueId: string) => void;
  isFavoriteTeam: (teamId: string) => boolean;
  isFavoriteLeague: (leagueId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesStore | undefined>(undefined);

export const FavoritesStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [teamIds, setTeamIds] = useState<string[]>([]);
  const [leagueIds, setLeagueIds] = useState<string[]>([]);

  const toggleItem = (items: string[], value: string) =>
    items.includes(value) ? items.filter((item) => item !== value) : [...items, value];

  const value = useMemo<FavoritesStore>(
    () => ({
      teamIds,
      leagueIds,
      toggleTeam: (teamId) => setTeamIds((prev) => toggleItem(prev, teamId)),
      toggleLeague: (leagueId) => setLeagueIds((prev) => toggleItem(prev, leagueId)),
      isFavoriteTeam: (teamId) => teamIds.includes(teamId),
      isFavoriteLeague: (leagueId) => leagueIds.includes(leagueId),
    }),
    [teamIds, leagueIds],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavoritesStore = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavoritesStore must be used within FavoritesStoreProvider');
  }
  return context;
};
