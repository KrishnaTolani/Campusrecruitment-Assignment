const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const ShareLink = require('../models/ShareLink');
const RSVP = require('../models/RSVP');

/**
 * POST /api/share/generate
 * Generate a share link for an event
 * Body: { userId, eventId, eventName }
 */
router.post('/generate', async (req, res) => {
  try {
    const { userId, eventId, eventName } = req.body;

    if (!userId || !eventId || !eventName) {
      return res.status(400).json({ error: 'userId, eventId, and eventName are required' });
    }

    // Check if share link already exists for this user+event
    let shareLink = await ShareLink.findOne({ eventId, createdByUserId: userId });

    if (!shareLink) {
      const token = uuidv4();
      shareLink = await ShareLink.create({ token, eventId, eventName, createdByUserId: userId });
    }

    const shareUrl = `${process.env.FRONTEND_URL}/share/${shareLink.token}`;
    res.json({ shareLink, shareUrl });
  } catch (err) {
    console.error('Share generate error:', err.message);
    res.status(500).json({ error: 'Failed to generate share link' });
  }
});

/**
 * GET /api/share/:token
 * Track a click and return event info
 */
router.get('/:token', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const shareLink = await ShareLink.findOneAndUpdate(
      { token: req.params.token },
      {
        $inc: { clickCount: 1 },
        $push: { clickers: { ip, clickedAt: new Date() } },
      },
      { returnDocument: 'after' }
    );

    if (!shareLink) {
      return res.status(404).json({ error: 'Share link not found' });
    }

    // Get friends attending count for this event
    const friendsAttending = await RSVP.countDocuments({ eventId: shareLink.eventId, status: 'confirmed' });

    res.json({
      eventId: shareLink.eventId,
      eventName: shareLink.eventName,
      clickCount: shareLink.clickCount,
      friendsAttending,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to track share link' });
  }
});

/**
 * GET /api/share/stats/:eventId/:userId
 * Get share link stats for a user's event
 */
router.get('/stats/:eventId/:userId', async (req, res) => {
  try {
    const shareLink = await ShareLink.findOne({
      eventId: req.params.eventId,
      createdByUserId: req.params.userId,
    });

    if (!shareLink) return res.json({ clickCount: 0, shareUrl: null });

    const shareUrl = `${process.env.FRONTEND_URL}/share/${shareLink.token}`;
    res.json({ clickCount: shareLink.clickCount, shareUrl, token: shareLink.token });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get share stats' });
  }
});

module.exports = router;
