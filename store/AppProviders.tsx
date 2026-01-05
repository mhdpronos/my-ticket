import React from 'react';
import { DateStoreProvider } from './dateStore';
import { FavoritesStoreProvider } from './favoritesStore';
import { TicketStoreProvider } from './ticketStore';
import { UserStoreProvider } from './userStore';

export const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <UserStoreProvider>
    <FavoritesStoreProvider>
      <TicketStoreProvider>
        <DateStoreProvider>{children}</DateStoreProvider>
      </TicketStoreProvider>
    </FavoritesStoreProvider>
  </UserStoreProvider>
);
