// Utilitaires pour la fenêtre glissante de J-2 à J+7.
// Cela reflète la logique produit décrite dans les besoins.

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
