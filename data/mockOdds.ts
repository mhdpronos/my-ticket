import type { OddsByBookmaker } from '@/types/odds';

export const generateOdds = (seed: string): OddsByBookmaker => {
  const base = seed.length % 5;
  return {
    '1xbet': Number((1.35 + base * 0.05).toFixed(2)),
    betwinner: Number((1.42 + base * 0.06).toFixed(2)),
    melbet: Number((1.38 + base * 0.055).toFixed(2)),
  };
};
