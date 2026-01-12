export type RollingDate = {
  id: string;
  label: string;
  iso: string;
  isToday: boolean;
  date: Date;
};

const formatLabel = (date: Date, locale: string) =>
  date.toLocaleDateString(locale, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });

export const buildRollingDates = (today = new Date(), locale = 'fr-FR'): RollingDate[] => {
  const start = new Date(today);
  start.setDate(today.getDate() - 2);

  return Array.from({ length: 10 }, (_, offset) => {
    const current = new Date(start);
    current.setDate(start.getDate() + offset);

    return {
      id: current.toISOString(),
      label: formatLabel(current, locale),
      iso: current.toISOString(),
      isToday: current.toDateString() === today.toDateString(),
      date: current,
    };
  });
};

export const isSameDay = (leftIso: string, rightIso: string) => {
  const left = new Date(leftIso);
  const right = new Date(rightIso);
  return left.toDateString() === right.toDateString();
};
