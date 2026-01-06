import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { TicketItem } from '@/types/domaine';

// Contexte pour gérer le ticket de sélection dans l'app.
// Cela isole la logique du ticket des composants d'interface.

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
    throw new Error('useTicket doit être utilisé dans TicketProvider');
  }
  return context;
}
