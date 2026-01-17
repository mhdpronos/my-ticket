import { buildPredictionsForMatch } from '@/data/predictions';
import { fetchJson } from '@/services/apiClient';
import { Prediction } from '@/types';

type ApiPredictionsResponse = {
  response: Array<{
    predictions: {
      percent: { home: string; draw: string; away: string };
      advice?: string;
    };
  }>;
};

const parsePercent = (value: string) => Number(value.replace('%', '').trim());

const riskFromPercent = (percent: number) => {
  if (percent >= 60) {
    return 'safe';
  }
  if (percent >= 45) {
    return 'medium';
  }
  return 'risky';
};

export const getPredictionsForMatch = async (matchId: string): Promise<Prediction[]> => {
  const data = await fetchJson<ApiPredictionsResponse>('/api/predictions', { fixture: matchId });
  const prediction = data?.response[0]?.predictions;
  if (!prediction) {
    return buildPredictionsForMatch(matchId);
  }

  const percentHome = parsePercent(prediction.percent.home);
  const percentDraw = parsePercent(prediction.percent.draw);
  const percentAway = parsePercent(prediction.percent.away);

  return buildPredictionsForMatch(matchId, {
    HOME: percentHome,
    DRAW: percentDraw,
    AWAY: percentAway,
  }).map((item) => {
    if (item.market !== '1X2' || item.confidence === undefined) {
      return item;
    }
    return {
      ...item,
      risk: riskFromPercent(item.confidence),
    };
  });
};
