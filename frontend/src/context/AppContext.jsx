import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createOrUpdateUser, fetchRSVPs, createRSVP, cancelRSVP } from '../api';

const AppContext = createContext(null);

// Demo user — in production, replace with real auth
const DEMO_USER = { name: 'Alex Johnson', email: 'alex@demo.com' };

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Bootstrap user on mount
  useEffect(() => {
    const init = async () => {
      try {
        const res = await createOrUpdateUser(DEMO_USER);
        setUser(res.data);
        const rsvpRes = await fetchRSVPs(res.data._id);
        setRsvps(rsvpRes.data);
      } catch (err) {
        console.error('Init error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const rsvpEvent = useCallback(
    async (event) => {
      if (!user) return;
      try {
        const res = await createRSVP({
          userId: user._id,
          eventId: event.id,
          eventName: event.name,
          eventDate: event.date,
          eventVenue: event.venue,
          eventImage: event.image,
          eventUrl: event.url,
        });
        // Refresh RSVPs
        const rsvpRes = await fetchRSVPs(user._id);
        setRsvps(rsvpRes.data);
        return res.data;
      } catch (err) {
        console.error('RSVP error:', err.message);
      }
    },
    [user]
  );

  const removeRSVP = useCallback(
    async (eventId) => {
      if (!user) return;
      await cancelRSVP(user._id, eventId);
      setRsvps((prev) => prev.filter((r) => r.eventId !== eventId));
    },
    [user]
  );

  const isRsvped = useCallback(
    (eventId) => rsvps.some((r) => r.eventId === eventId && r.status === 'confirmed'),
    [rsvps]
  );

  return (
    <AppContext.Provider value={{ user, rsvps, loading, rsvpEvent, removeRSVP, isRsvped }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
