import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { TicketItem } from '@/types/domain';

// Context for managing the selection ticket across the app.
// This isolates ticket logic from UI components.

type TicketContextValue = {
  items: TicketItem[];
  addItem: (item: TicketItem) => void;
  removeItem: (matchId: string) => void;
  clear: () => void;
};

const TicketContext = createContext<TicketContextValue | undefined>(undefined);

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<TicketItem[]>([]);

  const addItem = useCallback((item: TicketItem) => {
    setItems((current) => {
      const exists = current.some((entry) => entry.matchId === item.matchId);
      if (exists) {
        return current.map((entry) => (entry.matchId === item.matchId ? item : entry));
      }
      return [...current, item];
    });
  }, []);

  const removeItem = useCallback((matchId: string) => {
    setItems((current) => current.filter((entry) => entry.matchId !== matchId));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      clear,
    }),
    [addItem, clear, items, removeItem]
  );

  return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>;
}

export function useTicket() {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTicket must be used inside TicketProvider');
  }
  return context;
}
