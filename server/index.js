const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const API_BASE_URL = process.env.API_FOOTBALL_BASE_URL ?? 'https://v3.football.api-sports.io';
const API_KEY = process.env.API_FOOTBALL_KEY;

const buildApiUrl = (path, params = {}) => {
  const url = new URL(path, API_BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }
    url.searchParams.set(key, String(value));
  });
  return url.toString();
};

const apiFetch = async (path, params, apiKey) => {
  if (!apiKey) {
    throw new Error('Missing API_FOOTBALL_KEY env variable or x-apisports-key header.');
  }
  const response = await fetch(buildApiUrl(path, params), {
    headers: {
      'x-apisports-key': apiKey,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`API-Football error (${response.status}): ${message}`);
  }

  return response.json();
};

app.get('/api/fixtures', async (req, res) => {
  try {
    const params = {
      id: req.query.id,
      date: req.query.date,
      next: req.query.next,
      league: req.query.league,
      season: req.query.season,
      team: req.query.team,
      from: req.query.from,
      to: req.query.to,
      status: req.query.status,
      timezone: req.query.timezone,
    };
    const apiKey = API_KEY ?? req.get('x-apisports-key');
    const data = await apiFetch('/fixtures', params, apiKey);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/fixtures/:id', async (req, res) => {
  try {
    const apiKey = API_KEY ?? req.get('x-apisports-key');
    const data = await apiFetch('/fixtures', { id: req.params.id }, apiKey);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/predictions', async (req, res) => {
  try {
    const apiKey = API_KEY ?? req.get('x-apisports-key');
    const data = await apiFetch('/predictions', { fixture: req.query.fixture }, apiKey);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/odds', async (req, res) => {
  try {
    const apiKey = API_KEY ?? req.get('x-apisports-key');
    const data = await apiFetch('/odds', {
      fixture: req.query.fixture,
      bookmaker: req.query.bookmaker,
      bet: req.query.bet,
    }, apiKey);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/bookmakers', async (_req, res) => {
  try {
    const apiKey = API_KEY ?? _req.get('x-apisports-key');
    const data = await apiFetch('/odds/bookmakers', undefined, apiKey);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`API proxy running on http://localhost:${port}`);
});
