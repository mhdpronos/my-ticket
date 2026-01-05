import React, { createContext, useContext, useMemo, useState } from 'react';
import type { TicketItem } from '@/types/ticket';

interface TicketStore {
  items: TicketItem[];
  addItem: (item: TicketItem) => void;
  removeItem: (itemId: string) => void;
  clear: () => void;
}

const TicketContext = createContext<TicketStore | undefined>(undefined);

export const TicketStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<TicketItem[]>([]);

  const value = useMemo<TicketStore>(
    () => ({
      items,
      addItem: (item) =>
        setItems((prev) => {
          const filtered = prev.filter((existing) => existing.matchId !== item.matchId);
          return [...filtered, item];
        }),
      removeItem: (itemId) => setItems((prev) => prev.filter((item) => item.id !== itemId)),
      clear: () => setItems([]),
    }),
    [items],
  );

  return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>;
};

export const useTicketStore = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTicketStore must be used within TicketStoreProvider');
  }
  return context;
};
