const normalizeLeagueName = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '');

const allowedLeagueNames = new Set([
  'uefachampionsleague',
  'liguedeschampions',
  'laliga',
  'bundesliga',
  'premierleague',
  'ligue1',
  'africacupofnations',
  'coupeafriquedesnations',
  'coupedafriquedesnations',
  'seriea',
  'coupedefrance',
  'copadelrey',
  'coupeduroi',
]);

export const isAllowedLeague = (leagueName: string) => {
  const normalized = normalizeLeagueName(leagueName);
  return allowedLeagueNames.has(normalized);
};
