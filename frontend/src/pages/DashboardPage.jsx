import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { updateReminderSettings } from '../api';
import ShareModal from '../components/ShareModal';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user, rsvps, loading, removeRSVP } = useApp();
  const [shareEvent, setShareEvent] = useState(null);
  const [reminderEmail, setReminderEmail] = useState(true);
  const [reminderHours, setReminderHours] = useState(24);
  const [savedReminder, setSavedReminder] = useState(false);

  if (loading) return <div style={{ color: '#666', padding: '2rem' }}>Loading dashboard…</div>;

  const upcomingRsvps = rsvps
    .filter((r) => r.status === 'confirmed' && new Date(r.eventDate) >= new Date())
    .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

  const pastRsvps = rsvps
    .filter((r) => r.status === 'confirmed' && new Date(r.eventDate) < new Date())
    .sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));

  const formatDate = (d) => {
    if (!d) return 'TBA';
    return new Date(d).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  const handleSaveReminder = async () => {
    if (!user) return;
    await updateReminderSettings(user._id, { emailReminder: reminderEmail, reminderHoursBefore: reminderHours });
    setSavedReminder(true);
    setTimeout(() => setSavedReminder(false), 2000);
  };

  const RsvpCard = ({ rsvp }) => (
    <div className="rsvp-card">
      <div className="rsvp-card-img">
        {rsvp.eventImage
          ? <img src={rsvp.eventImage} alt={rsvp.eventName} loading="lazy" />
          : <span>🎫</span>
        }
      </div>
      <div className="rsvp-card-body">
        <div className="rsvp-event-name">{rsvp.eventName}</div>
        <div className="rsvp-meta">📅 {formatDate(rsvp.eventDate)}</div>
        {rsvp.eventVenue && <div className="rsvp-meta">📍 {rsvp.eventVenue}</div>}

        {rsvp.friendsAttending > 0 && (
          <div className="rsvp-friends-badge">
            👥 {rsvp.friendsAttending} friends attending
          </div>
        )}

        {rsvp.shareLink && (
          <div className="rsvp-meta">🔗 {rsvp.shareLink.clickCount} link clicks</div>
        )}

        <div className="rsvp-card-actions">
          <button
            className="btn-share-dash"
            onClick={() => setShareEvent({
              id: rsvp.eventId,
              name: rsvp.eventName,
              date: rsvp.eventDate,
              venue: rsvp.eventVenue,
              image: rsvp.eventImage,
              url: rsvp.eventUrl,
            })}
          >
            🔗 Invite
          </button>

          {rsvp.eventUrl && (
            <a href={rsvp.eventUrl} target="_blank" rel="noopener noreferrer" className="btn-details-dash">
              Details
            </a>
          )}

          <button
            className="btn-cancel-rsvp"
            onClick={() => removeRSVP(rsvp.eventId)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-page">
      <div className="dash-header">
        <h1 className="page-title">My RSVP Dashboard</h1>
        <p className="dash-subtitle">
          {user ? `Signed in as ${user.name}` : ''}
        </p>

        <div className="dash-stats">
          <div className="dash-stat">
            <strong>{upcomingRsvps.length}</strong> Upcoming events
          </div>
          <div className="dash-stat">
            <strong>{rsvps.reduce((s, r) => s + (r.friendsAttending || 0), 0)}</strong> Total friends attending
          </div>
          <div className="dash-stat">
            <strong>{rsvps.reduce((s, r) => s + (r.shareLink?.clickCount || 0), 0)}</strong> Invite link clicks
          </div>
        </div>
      </div>

      {rsvps.length === 0 ? (
        <div className="empty-dashboard">
          <div className="empty-icon">🎟️</div>
          <h3>No RSVPs yet</h3>
          <p>Browse events and click <strong>Interested</strong> to RSVP. <Link to="/">Find events →</Link></p>
        </div>
      ) : (
        <>
          {upcomingRsvps.length > 0 && (
            <>
              <div className="dash-section-title">Upcoming Events ({upcomingRsvps.length})</div>
              <div className="rsvp-grid">
                {upcomingRsvps.map((r) => <RsvpCard key={r.eventId} rsvp={r} />)}
              </div>
            </>
          )}

          {pastRsvps.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <div className="dash-section-title">Past Events ({pastRsvps.length})</div>
              <div className="rsvp-grid">
                {pastRsvps.map((r) => <RsvpCard key={r.eventId} rsvp={r} />)}
              </div>
            </div>
          )}
        </>
      )}

      {/* Reminder Settings */}
      <div className="reminder-section">
        <h2>⏰ Reminder Settings</h2>
        <div className="reminder-form">
          <div className="reminder-row">
            <span className="reminder-label">Email reminders</span>
            <label className="toggle">
              <input
                type="checkbox"
                checked={reminderEmail}
                onChange={(e) => setReminderEmail(e.target.checked)}
                aria-label="Enable email reminders"
              />
              <span className="toggle-slider" />
            </label>
          </div>
          <div className="reminder-row">
            <span className="reminder-label">Remind me before</span>
            <select
              className="reminder-select"
              value={reminderHours}
              onChange={(e) => setReminderHours(+e.target.value)}
              aria-label="Hours before event for reminder"
            >
              <option value={1}>1 hour</option>
              <option value={6}>6 hours</option>
              <option value={24}>24 hours</option>
              <option value={48}>48 hours</option>
            </select>
          </div>
          <button
            className={`save-reminder-btn ${savedReminder ? 'saved' : ''}`}
            onClick={handleSaveReminder}
          >
            {savedReminder ? '✓ Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>

      {shareEvent && (
        <ShareModal event={shareEvent} onClose={() => setShareEvent(null)} />
      )}
    </div>
  );
}
