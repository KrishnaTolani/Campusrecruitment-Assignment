const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * POST /api/user
 * Create or update a user profile
 */
router.post('/', async (req, res) => {
  try {
    const { name, email, avatar, reminderSettings } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'name and email are required' });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { name, email, avatar, reminderSettings },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create/update user' });
  }
});

/**
 * GET /api/user/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

/**
 * PUT /api/user/:id/reminders
 * Update reminder settings
 */
router.put('/:id/reminders', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { reminderSettings: req.body },
      { returnDocument: 'after' }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update reminder settings' });
  }
});

module.exports = router;
