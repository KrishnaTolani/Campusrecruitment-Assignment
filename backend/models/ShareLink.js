const mongoose = require('mongoose');

const shareLinkSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    eventId: { type: String, required: true }, // Ticketmaster event ID
    eventName: { type: String, required: true },
    createdByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clickCount: { type: Number, default: 0 },
    // Track unique clickers by IP or userId
    clickers: [
      {
        ip: String,
        clickedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShareLink', shareLinkSchema);
