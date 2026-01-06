import { bookmakers } from '@/data/bookmakers';
import { buildPredictionsForMatch } from '@/data/predictions';
import { mockMatches } from '@/data/matches';
import { OddsByBookmaker } from '@/types';

export type OddsKey = `${string}:${string}:${string}`;

const buildOddsValue = (seed: number, offset: number) => {
  const raw = (seed * 13 + offset * 7) % 220;
  return 1.2 + raw / 100;
};

export const buildMockOddsMap = () => {
  const map: Record<OddsKey, OddsByBookmaker> = {};

  mockMatches.forEach((match, matchIndex) => {
    const predictions = buildPredictionsForMatch(match.id);
    predictions.forEach((prediction, predictionIndex) => {
      const key: OddsKey = `${match.id}:${prediction.market}:${prediction.selection}`;
      const odds: OddsByBookmaker = {};

      bookmakers.forEach((bookmaker, bookmakerIndex) => {
        const seed = matchIndex + predictionIndex + bookmakerIndex;
        odds[bookmaker.id] = Number(buildOddsValue(seed, bookmakerIndex).toFixed(2));
      });

      map[key] = odds;
    });
  });

  return map;
};

export const mockOddsByKey = buildMockOddsMap();
