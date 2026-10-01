const express = require('express');
const axios = require('axios');
const router = express.Router();

const TM_BASE = 'https://app.ticketmaster.com/discovery/v2';

/**
 * GET /api/events
 * Query params: keyword, city, startDateTime, endDateTime, page, size
 */
router.get('/', async (req, res) => {
  try {
    const {
      keyword = '',
      city = '',
      startDateTime,
      endDateTime,
      page = 0,
      size = 20,
      classificationName = 'music',
    } = req.query;

    const params = {
      apikey: process.env.TICKETMASTER_API_KEY,
      keyword,
      city,
      classificationName,
      page,
      size,
      sort: 'date,asc',
    };

    if (startDateTime) params.startDateTime = startDateTime;
    if (endDateTime) params.endDateTime = endDateTime;

    const response = await axios.get(`${TM_BASE}/events.json`, { params });
    const data = response.data;

    const events = (data._embedded?.events || []).map((e) => ({
      id: e.id,
      name: e.name,
      date: e.dates?.start?.localDate || null,
      time: e.dates?.start?.localTime || null,
      venue: e._embedded?.venues?.[0]?.name || 'TBA',
      city: e._embedded?.venues?.[0]?.city?.name || '',
      state: e._embedded?.venues?.[0]?.state?.stateCode || '',
      image: e.images?.[0]?.url || '',
      url: e.url || '',
      priceMin: e.priceRanges?.[0]?.min || null,
      priceMax: e.priceRanges?.[0]?.max || null,
      genre: e.classifications?.[0]?.genre?.name || '',
      segment: e.classifications?.[0]?.segment?.name || '',
    }));

    res.json({
      events,
      page: data.page?.number || 0,
      totalPages: data.page?.totalPages || 0,
      totalElements: data.page?.totalElements || 0,
    });
  } catch (err) {
    console.error('Ticketmaster API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch events from Ticketmaster' });
  }
});

/**
 * GET /api/events/:id
 * Fetch a single event by Ticketmaster ID
 */
router.get('/:id', async (req, res) => {
  try {
    const response = await axios.get(`${TM_BASE}/events/${req.params.id}.json`, {
      params: { apikey: process.env.TICKETMASTER_API_KEY },
    });
    const e = response.data;

    res.json({
      id: e.id,
      name: e.name,
      date: e.dates?.start?.localDate || null,
      time: e.dates?.start?.localTime || null,
      venue: e._embedded?.venues?.[0]?.name || 'TBA',
      city: e._embedded?.venues?.[0]?.city?.name || '',
      state: e._embedded?.venues?.[0]?.state?.stateCode || '',
      image: e.images?.[0]?.url || '',
      url: e.url || '',
      priceMin: e.priceRanges?.[0]?.min || null,
      priceMax: e.priceRanges?.[0]?.max || null,
      genre: e.classifications?.[0]?.genre?.name || '',
      description: e.info || e.pleaseNote || '',
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event details' });
  }
});

module.exports = router;
