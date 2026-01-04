// Helper utilities for the rolling J-2 to J+7 window.
// This mirrors the product logic described in the requirements.

export type RollingDate = {
  id: string;
  label: string;
  iso: string;
  isToday: boolean;
};

const formatLabel = (date: Date) => {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });
};

export const buildRollingDates = (today = new Date()): RollingDate[] => {
  const start = new Date(today);
  start.setDate(today.getDate() - 2);

  const dates: RollingDate[] = [];

  for (let offset = 0; offset < 10; offset += 1) {
    const current = new Date(start);
    current.setDate(start.getDate() + offset);

    dates.push({
      id: current.toISOString(),
      label: formatLabel(current),
      iso: current.toISOString(),
      isToday: current.toDateString() === today.toDateString(),
    });
  }

  return dates;
};
