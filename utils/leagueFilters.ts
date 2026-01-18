const normalizeLeagueName = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '');

const allowedLeagueNames = new Set([
  'can',
  'africacupofnations',
  'coupeafriquedesnations',
  'coupedafriquedesnations',
  'bundesliga',
  'premierleague',
  'laliga',
  'uefachampionsleague',
  'liguedeschampions',
  'ligue1',
  'seriea',
  'coupedumonde',
  'worldcup',
  'fifaclubworldcup',
  'coupedumondedesclubsfifa',
  'coupedumondedesclubs',
  'clubworldcup',
  'euro',
  'uefaeuro',
  'copadelrey',
  'coupeduroi',
  'uefaeuropaleague',
  'europaleague',
  'ligueeuropa',
  'coupedefrance',
  'uefanationsleague',
  'liguedesnations',
  'liguedesnationsuefa',
  'ligue1cotedivoire',
]);

export const isAllowedLeague = (leagueName: string) => {
  const normalized = normalizeLeagueName(leagueName);
  return allowedLeagueNames.has(normalized);
};
