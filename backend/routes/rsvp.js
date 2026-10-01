const express = require('express');
const router = express.Router();
const RSVP = require('../models/RSVP');
const ShareLink = require('../models/ShareLink');

/**
 * POST /api/rsvp
 * Body: { userId, eventId, eventName, eventDate, eventVenue, eventImage, eventUrl }
 */
router.post('/', async (req, res) => {
  try {
    const { userId, eventId, eventName, eventDate, eventVenue, eventImage, eventUrl } = req.body;

    if (!userId || !eventId || !eventName || !eventDate) {
      return res.status(400).json({ error: 'userId, eventId, eventName, and eventDate are required' });
    }

    const rsvp = await RSVP.findOneAndUpdate(
      { userId, eventId },
      { userId, eventId, eventName, eventDate, eventVenue, eventImage, eventUrl, status: 'confirmed' },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    // Get friends attending count (all RSVPs for this event)
    const friendsCount = await RSVP.countDocuments({ eventId, status: 'confirmed' });
    // Get share link click count if exists
    const shareLink = await ShareLink.findOne({ eventId, createdByUserId: userId });

    res.status(201).json({ rsvp, friendsAttending: friendsCount, shareLink });
  } catch (err) {
    console.error('RSVP error:', err.message);
    res.status(500).json({ error: 'Failed to create RSVP' });
  }
});

/**
 * GET /api/rsvp/:userId
 * Get all RSVPs for a user
 */
router.get('/:userId', async (req, res) => {
  try {
    const rsvps = await RSVP.find({ userId: req.params.userId, status: 'confirmed' }).sort({ eventDate: 1 });

    // For each RSVP, attach friends attending count and share link
    const enriched = await Promise.all(
      rsvps.map(async (r) => {
        const friendsAttending = await RSVP.countDocuments({ eventId: r.eventId, status: 'confirmed' });
        const shareLink = await ShareLink.findOne({ eventId: r.eventId, createdByUserId: req.params.userId });
        return { ...r.toObject(), friendsAttending, shareLink };
      })
    );

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch RSVPs' });
  }
});

/**
 * DELETE /api/rsvp/:userId/:eventId
 * Cancel an RSVP
 */
router.delete('/:userId/:eventId', async (req, res) => {
  try {
    await RSVP.findOneAndUpdate(
      { userId: req.params.userId, eventId: req.params.eventId },
      { status: 'cancelled' },
      { returnDocument: 'after' }
    );
    res.json({ message: 'RSVP cancelled' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel RSVP' });
  }
});

/**
 * GET /api/rsvp/event/:eventId/count
 * Get total confirmed RSVPs (friends attending) for an event
 */
router.get('/event/:eventId/count', async (req, res) => {
  try {
    const count = await RSVP.countDocuments({ eventId: req.params.eventId, status: 'confirmed' });
    res.json({ eventId: req.params.eventId, friendsAttending: count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get count' });
  }
});

module.exports = router;
