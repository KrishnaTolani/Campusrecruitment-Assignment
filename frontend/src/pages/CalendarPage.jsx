import React, { useState, useEffect } from 'react';
import { fetchEvents } from '../api';
import EventCalendar from '../components/EventCalendar';
import EventCard from '../components/EventCard';
import './CalendarPage.css';

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch a broad set of events for the calendar
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchEvents({ size: 50, classificationName: '' });
        setEvents(res.data.events);
      } catch {
        setError('Could not load events for calendar.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDaySelect = (date) => setSelectedDate(date === selectedDate ? null : date);

  const filteredEvents = selectedDate
    ? events.filter((e) => e.date === selectedDate)
    : [];

  return (
    <div className="calendar-page">
      <h1 className="page-title">Event Calendar</h1>
      <p className="cal-subtitle">Dates highlighted in purple have events. Click to see them.</p>

      {error && <div className="error-msg">{error}</div>}

      <div className="cal-layout">
        <div className="cal-sidebar">
          {loading ? (
            <div className="cal-loading">Loading calendar…</div>
          ) : (
            <EventCalendar
              events={events}
              onDaySelect={handleDaySelect}
              selectedDate={selectedDate}
            />
          )}
        </div>

        <div className="cal-events">
          {!selectedDate ? (
            <div className="cal-empty">
              <span>👆</span>
              <p>Select a highlighted date to see events</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="cal-empty">
              <p>No events on {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
          ) : (
            <>
              <h2 className="day-events-title">
                Events on {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h2>
              <div className="day-events-grid">
                {filteredEvents.map((e) => <EventCard key={e.id} event={e} />)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
