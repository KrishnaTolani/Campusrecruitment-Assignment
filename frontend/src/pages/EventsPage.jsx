import React, { useState, useEffect, useCallback } from 'react';
import { fetchEvents } from '../api';
import EventCard from '../components/EventCard';
import './EventsPage.css';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [genre, setGenre] = useState('music');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [cityInput, setCityInput] = useState('');

  const loadEvents = useCallback(async (kw, ct, g, pg) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchEvents({ keyword: kw, city: ct, classificationName: g, page: pg, size: 20 });
      setEvents(res.data.events);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError('Failed to load events. Check your Ticketmaster API key.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents(keyword, city, genre, page);
  }, [keyword, city, genre, page, loadEvents]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setKeyword(searchInput);
    setCity(cityInput);
  };

  const genres = ['music', 'sports', 'arts', 'family', 'film', 'miscellaneous'];

  return (
    <div className="events-page">
      <div className="events-header">
        <h1 className="page-title">Find Events</h1>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search events..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
            aria-label="Search events"
          />
          <input
            type="text"
            placeholder="City..."
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            className="search-input city-input"
            aria-label="Filter by city"
          />
          <button type="submit" className="search-btn">Search</button>
        </form>

        <div className="genre-filters" role="group" aria-label="Filter by genre">
          {genres.map((g) => (
            <button
              key={g}
              className={`genre-btn ${genre === g ? 'active' : ''}`}
              onClick={() => { setGenre(g); setPage(0); }}
            >
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {loading ? (
        <div className="loading-grid">
          {Array(8).fill(0).map((_, i) => <div key={i} className="skeleton-card" />)}
        </div>
      ) : (
        <>
          {events.length === 0 && !error && (
            <div className="empty-state">No events found. Try a different search or genre.</div>
          )}
          <div className="events-grid">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            ← Prev
          </button>
          <span className="page-info">Page {page + 1} / {totalPages}</span>
          <button
            className="page-btn"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
