import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import EventsPage from './pages/EventsPage';
import CalendarPage from './pages/CalendarPage';
import DashboardPage from './pages/DashboardPage';
import ShareLandingPage from './pages/ShareLandingPage';
import './App.css';

function Nav() {
  return (
    <nav className="main-nav">
      <div className="nav-brand">🎫 EventFinder</div>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Browse
        </NavLink>
        <NavLink to="/calendar" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Calendar
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          My RSVPs
        </NavLink>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/share/:token" element={<ShareLandingPage />} />
          <Route
            path="/*"
            element={
              <>
                <Nav />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<EventsPage />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                  </Routes>
                </main>
              </>
            }
          />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
