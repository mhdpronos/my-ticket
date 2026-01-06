const MS_IN_DAY = 24 * 60 * 60 * 1000;

export const toDateKey = (date: Date) => date.toISOString().split('T')[0];

export const addDays = (date: Date, amount: number) => new Date(date.getTime() + MS_IN_DAY * amount);

export const formatDayLabel = (date: Date) => {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};

export const formatTime = (date: Date) => {
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

export const getDateRange = (base: Date, pastDays = 2, futureDays = 7) => {
  const range: Date[] = [];
  for (let offset = -pastDays; offset <= futureDays; offset += 1) {
    range.push(addDays(base, offset));
  }
  return range;
};
