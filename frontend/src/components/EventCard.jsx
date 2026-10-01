import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ShareModal from './ShareModal';
import './EventCard.css';

export default function EventCard({ event }) {
  const { user, rsvpEvent, removeRSVP, isRsvped } = useApp();
  const [loading, setLoading] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [friendsCount, setFriendsCount] = useState(event.friendsAttending || 0);

  const rsvped = isRsvped(event.id);

  const handleRSVP = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (rsvped) {
        await removeRSVP(event.id);
        setFriendsCount((c) => Math.max(0, c - 1));
      } else {
        const result = await rsvpEvent(event);
        if (result?.friendsAttending !== undefined) setFriendsCount(result.friendsAttending);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => {
    if (!d) return 'TBA';
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  const formatTime = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const date = new Date();
    date.setHours(+h, +m);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <>
      <div className={`event-card ${rsvped ? 'rsvped' : ''}`}>
        <div className="event-card-img">
          {event.image ? (
            <img src={event.image} alt={event.name} loading="lazy" />
          ) : (
            <div className="event-card-img-placeholder">🎵</div>
          )}
          {event.genre && <span className="event-genre-badge">{event.genre}</span>}
        </div>

        <div className="event-card-body">
          <h3 className="event-title">{event.name}</h3>

          <div className="event-meta">
            <span className="meta-item">
              📅 {formatDate(event.date)}{event.time ? ` · ${formatTime(event.time)}` : ''}
            </span>
            <span className="meta-item">
              📍 {event.venue}{event.city ? `, ${event.city}` : ''}
            </span>
            {event.priceMin && (
              <span className="meta-item">
                💵 From ${event.priceMin}
              </span>
            )}
          </div>

          {friendsCount > 0 && (
            <div className="friends-attending">
              👥 {friendsCount} {friendsCount === 1 ? 'person' : 'people'} attending
            </div>
          )}

          <div className="event-card-actions">
            <button
              className={`btn-rsvp ${rsvped ? 'btn-rsvp--active' : ''}`}
              onClick={handleRSVP}
              disabled={loading}
              aria-pressed={rsvped}
            >
              {loading ? '...' : rsvped ? '✓ Interested' : 'Interested'}
            </button>

            {rsvped && (
              <button
                className="btn-share"
                onClick={() => setShowShare(true)}
                aria-label="Share event with friends"
              >
                🔗 Invite Friends
              </button>
            )}

            {event.url && (
              <a href={event.url} target="_blank" rel="noopener noreferrer" className="btn-details">
                Details
              </a>
            )}
          </div>
        </div>
      </div>

      {showShare && (
        <ShareModal
          event={event}
          onClose={() => setShowShare(false)}
          onFriendsCountUpdate={(c) => setFriendsCount(c)}
        />
      )}
    </>
  );
}
