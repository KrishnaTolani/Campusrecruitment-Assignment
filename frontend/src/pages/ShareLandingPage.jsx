import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { trackShareClick } from '../api';
import './ShareLandingPage.css';

export default function ShareLandingPage() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const track = async () => {
      try {
        const res = await trackShareClick(token);
        setData(res.data);
      } catch {
        setError('This share link is invalid or has expired.');
      } finally {
        setLoading(false);
      }
    };
    track();
  }, [token]);

  if (loading) return (
    <div className="share-landing">
      <div className="share-card loading">Loading…</div>
    </div>
  );

  if (error) return (
    <div className="share-landing">
      <div className="share-card error">
        <div className="share-icon">😕</div>
        <h2>Oops</h2>
        <p>{error}</p>
        <Link to="/" className="share-cta">Browse events instead</Link>
      </div>
    </div>
  );

  return (
    <div className="share-landing">
      <div className="share-card">
        <div className="share-icon">🎫</div>
        <div className="share-badge">You were invited!</div>
        <h1 className="share-event-name">{data.eventName}</h1>

        <div className="share-stats">
          <div className="share-stat">
            <span className="share-stat-num">{data.friendsAttending}</span>
            <span className="share-stat-label">Friends Attending</span>
          </div>
          <div className="share-stat">
            <span className="share-stat-num">{data.clickCount}</span>
            <span className="share-stat-label">Link Clicks</span>
          </div>
        </div>

        <p className="share-msg">
          Your friend is going to this event and wants you to join them!
        </p>

        <Link to="/" className="share-cta">
          Browse Events & RSVP
        </Link>
      </div>
    </div>
  );
}
