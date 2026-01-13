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

const apiFetch = async (path, params) => {
  if (!API_KEY) {
    throw new Error('Missing API_FOOTBALL_KEY env variable.');
  }
  const response = await fetch(buildApiUrl(path, params), {
    headers: {
      'x-apisports-key': API_KEY,
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
    const data = await apiFetch('/fixtures', params);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/fixtures/:id', async (req, res) => {
  try {
    const data = await apiFetch('/fixtures', { id: req.params.id });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/predictions', async (req, res) => {
  try {
    const data = await apiFetch('/predictions', { fixture: req.query.fixture });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/odds', async (req, res) => {
  try {
    const data = await apiFetch('/odds', {
      fixture: req.query.fixture,
      bookmaker: req.query.bookmaker,
      bet: req.query.bet,
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/bookmakers', async (_req, res) => {
  try {
    const data = await apiFetch('/odds/bookmakers');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`API proxy running on http://localhost:${port}`);
});
