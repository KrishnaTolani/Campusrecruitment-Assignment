import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { generateShareLink, fetchShareStats } from '../api';
import './ShareModal.css';

export default function ShareModal({ event, onClose, onFriendsCountUpdate }) {
  const { user } = useApp();
  const [shareUrl, setShareUrl] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        // Try to get existing share stats first
        const statsRes = await fetchShareStats(event.id, user._id);
        if (statsRes.data.shareUrl) {
          setShareUrl(statsRes.data.shareUrl);
          setClickCount(statsRes.data.clickCount);
        } else {
          // Generate new link
          const res = await generateShareLink({ userId: user._id, eventId: event.id, eventName: event.name });
          setShareUrl(res.data.shareUrl);
          setClickCount(res.data.shareLink?.clickCount || 0);
        }
      } catch (err) {
        console.error('Share modal error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [event.id, user]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerate = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await generateShareLink({ userId: user._id, eventId: event.id, eventName: event.name });
      setShareUrl(res.data.shareUrl);
      setClickCount(res.data.shareLink?.clickCount || 0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Share event">
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔗 Invite Friends</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <p className="modal-event-name">{event.name}</p>

        <div className="modal-stats">
          <div className="stat-pill">
            <span className="stat-num">{clickCount}</span>
            <span className="stat-label">Link Clicks</span>
          </div>
        </div>

        {loading ? (
          <div className="modal-loading">Generating link…</div>
        ) : shareUrl ? (
          <div className="share-link-box">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="share-link-input"
              aria-label="Share link"
            />
            <button className={`btn-copy ${copied ? 'copied' : ''}`} onClick={handleCopy}>
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        ) : (
          <button className="btn-generate" onClick={handleGenerate}>
            Generate Share Link
          </button>
        )}

        <p className="modal-hint">
          Share this link with friends. Every click is tracked and contributes to the "Friends Attending" count.
        </p>
      </div>
    </div>
  );
}
