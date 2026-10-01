# EventFinder — Event Finding & Tracking Platform

A full-stack web app for discovering, tracking, and sharing events using the Ticketmaster API.

## Tech Stack
- **Frontend**: React 18 + Vite, React Router v6
- **Backend**: Node.js + Express
- **Database**: MongoDB (Mongoose)
- **External API**: Ticketmaster Discovery API

## Features
- 🔍 **Event Search** — Browse and search events by keyword, city, and genre via Ticketmaster API
- 📅 **Event Calendar** — Calendar grid with highlighted dates showing local events
- 🎫 **Event Cards** — Title, venue, date, time, genre badge, Friends Attending count, Interested button
- ✅ **RSVP Dashboard** — View all confirmed events with stats and reminder settings
- 🔗 **Friend Invite System** — Generate shareable links after RSVPing; every click is tracked and shown as "Friends Attending" count

## Project Structure
```
chatinterface/
├── backend/
│   ├── server.js
│   ├── models/
│   │   ├── User.js
│   │   ├── RSVP.js
│   │   └── ShareLink.js
│   ├── routes/
│   │   ├── events.js      (Ticketmaster API proxy)
│   │   ├── rsvp.js
│   │   ├── share.js
│   │   └── user.js
│   └── .env
└── frontend/
    └── src/
        ├── App.jsx
        ├── api.js
        ├── context/AppContext.jsx
        ├── components/
        │   ├── EventCard.jsx
        │   ├── EventCalendar.jsx
        │   └── ShareModal.jsx
        └── pages/
            ├── EventsPage.jsx
            ├── CalendarPage.jsx
            ├── DashboardPage.jsx
            └── ShareLandingPage.jsx
```

## Setup & Run

### 1. Get a Ticketmaster API Key
Register at https://developer.ticketmaster.com/ and grab a free API key.

### 2. Backend
```bash
cd backend
# Edit .env — set your TICKETMASTER_API_KEY and MONGODB_URI
npm install
npm start
# Server runs on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

### 4. MongoDB
Make sure MongoDB is running locally (`mongod`) or update `MONGODB_URI` in `.env` to point to MongoDB Atlas.

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/events | Fetch events from Ticketmaster |
| GET | /api/events/:id | Single event details |
| POST | /api/rsvp | Create RSVP |
| GET | /api/rsvp/:userId | Get user's RSVPs |
| DELETE | /api/rsvp/:userId/:eventId | Cancel RSVP |
| GET | /api/rsvp/event/:eventId/count | Friends attending count |
| POST | /api/share/generate | Generate share link |
| GET | /api/share/:token | Track link click + return event info |
| GET | /api/share/stats/:eventId/:userId | Get share stats |
| POST | /api/user | Create/update user |
| PUT | /api/user/:id/reminders | Update reminder settings |
