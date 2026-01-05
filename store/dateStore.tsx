import React, { createContext, useContext, useMemo, useState } from 'react';
import { toDateKey } from '@/utils/date';

interface DateStore {
  selectedDate: string;
  setSelectedDate: (dateKey: string) => void;
}

const DateContext = createContext<DateStore | undefined>(undefined);

export const DateStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedDate, setSelectedDate] = useState<string>(toDateKey(new Date()));

  const value = useMemo<DateStore>(
    () => ({
      selectedDate,
      setSelectedDate,
    }),
    [selectedDate],
  );

  return <DateContext.Provider value={value}>{children}</DateContext.Provider>;
};

export const useDateStore = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error('useDateStore must be used within DateStoreProvider');
  }
  return context;
};
