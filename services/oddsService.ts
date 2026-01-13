import { fetchJson } from '@/services/apiClient';
import { Bookmaker, OddsByBookmaker, Prediction } from '@/types';

type ApiBookmakerResponse = {
  response: Array<{ id: number; name: string }>;
};

type ApiOddsResponse = {
  response: Array<{
    bookmakers: Array<{
      id: number;
      name: string;
      bets: Array<{
        name: string;
        values: Array<{ value: string; odd: string }>;
      }>;
    }>;
  }>;
};

let cachedBookmakers: Bookmaker[] | null = null;

const mapSelection = (value: string) => {
  const normalized = value.toLowerCase();
  if (normalized === '1' || normalized === 'home') {
    return 'HOME';
  }
  if (normalized === 'x' || normalized === 'draw') {
    return 'DRAW';
  }
  if (normalized === '2' || normalized === 'away') {
    return 'AWAY';
  }
  return null;
};

export const fetchBookmakers = async (): Promise<Bookmaker[]> => {
  if (cachedBookmakers) {
    return cachedBookmakers;
  }
  const data = await fetchJson<ApiBookmakerResponse>('/api/bookmakers');
  cachedBookmakers = data?.response.map((item) => ({ id: String(item.id), name: item.name })) ?? [];
  return cachedBookmakers;
};

export const fetchOddsForPrediction = async (prediction: Prediction): Promise<OddsByBookmaker> => {
  if (prediction.market !== '1X2') {
    return {};
  }
  const data = await fetchJson<ApiOddsResponse>('/api/odds', { fixture: prediction.matchId });
  const oddsMap: OddsByBookmaker = {};
  const entry = data?.response[0];
  if (!entry) {
    return oddsMap;
  }

  entry.bookmakers.forEach((bookmaker) => {
    const matchWinner = bookmaker.bets.find((bet) => bet.name.toLowerCase() === 'match winner');
    if (!matchWinner) {
      return;
    }
    const found = matchWinner.values.find((value) => mapSelection(value.value) === prediction.selection);
    if (!found) {
      return;
    }
    const odd = Number(found.odd);
    if (!Number.isNaN(odd)) {
      oddsMap[String(bookmaker.id)] = odd;
    }
  });

  return oddsMap;
};
