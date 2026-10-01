const mongoose = require('mongoose');

const rsvpSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: String, required: true }, // Ticketmaster event ID
    eventName: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventVenue: { type: String, default: '' },
    eventImage: { type: String, default: '' },
    eventUrl: { type: String, default: '' },
    status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
  },
  { timestamps: true }
);

// Compound index to prevent duplicate RSVPs
rsvpSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('RSVP', rsvpSchema);
