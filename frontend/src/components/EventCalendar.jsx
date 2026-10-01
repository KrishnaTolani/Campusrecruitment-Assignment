import React, { useState } from 'react';
import './EventCalendar.css';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

export default function EventCalendar({ events, onDaySelect, selectedDate }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // Build a map of date -> event count
  const eventsByDate = {};
  events.forEach((e) => {
    if (e.date) {
      const key = e.date.slice(0, 10); // YYYY-MM-DD
      eventsByDate[key] = (eventsByDate[key] || 0) + 1;
    }
  });

  // Calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const formatKey = (d) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const isToday = (d) => {
    return d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const isSelected = (d) => selectedDate === formatKey(d);

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button className="cal-nav" onClick={prevMonth} aria-label="Previous month">‹</button>
        <span className="cal-title">{MONTHS[month]} {year}</span>
        <button className="cal-nav" onClick={nextMonth} aria-label="Next month">›</button>
      </div>

      <div className="calendar-grid calendar-day-names">
        {DAYS.map((d) => <div key={d} className="cal-day-name">{d}</div>)}
      </div>

      <div className="calendar-grid">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} className="cal-cell empty" />;
          const key = formatKey(day);
          const count = eventsByDate[key] || 0;
          return (
            <div
              key={key}
              className={`cal-cell ${isToday(day) ? 'today' : ''} ${isSelected(day) ? 'selected' : ''} ${count > 0 ? 'has-events' : ''}`}
              onClick={() => count > 0 && onDaySelect(key)}
              role={count > 0 ? 'button' : undefined}
              tabIndex={count > 0 ? 0 : undefined}
              aria-label={count > 0 ? `${key}: ${count} event${count > 1 ? 's' : ''}` : undefined}
              onKeyDown={(e) => e.key === 'Enter' && count > 0 && onDaySelect(key)}
            >
              <span className="cal-day-num">{day}</span>
              {count > 0 && (
                <span className="event-dot" title={`${count} event${count > 1 ? 's' : ''}`}>
                  {count > 3 ? '3+' : count}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className="cal-clear-row">
          <button className="cal-clear-btn" onClick={() => onDaySelect(null)}>
            Clear filter
          </button>
        </div>
      )}
    </div>
  );
}
