import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// ── Events ──────────────────────────────────────────────
export const fetchEvents = (params) => api.get('/events', { params });
export const fetchEventById = (id) => api.get(`/events/${id}`);

// ── RSVP ────────────────────────────────────────────────
export const createRSVP = (data) => api.post('/rsvp', data);
export const fetchRSVPs = (userId) => api.get(`/rsvp/${userId}`);
export const cancelRSVP = (userId, eventId) => api.delete(`/rsvp/${userId}/${eventId}`);
export const fetchEventRSVPCount = (eventId) => api.get(`/rsvp/event/${eventId}/count`);

// ── Share ────────────────────────────────────────────────
export const generateShareLink = (data) => api.post('/share/generate', data);
export const fetchShareStats = (eventId, userId) => api.get(`/share/stats/${eventId}/${userId}`);
export const trackShareClick = (token) => api.get(`/share/${token}`);

// ── User ─────────────────────────────────────────────────
export const createOrUpdateUser = (data) => api.post('/user', data);
export const fetchUser = (id) => api.get(`/user/${id}`);
export const updateReminderSettings = (id, settings) => api.put(`/user/${id}/reminders`, settings);
