import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';
import './Navbar.css';

function Navbar() {
  const [unreadMessages, setUnreadMessages]           = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const userId   = localStorage.getItem('user_id');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!userId) return;
    fetchCounts();
    const interval = setInterval(fetchCounts, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  const fetchCounts = async () => {
    try {
      const [msgRes, notifRes] = await Promise.all([
        axios.get(`${API_URL}/messages/unread/${userId}`),
        axios.get(`${API_URL}/notifications/unread/${userId}`)
      ]);
      setUnreadMessages(msgRes.data.count);
      setUnreadNotifications(notifRes.data.count);
    } catch (err) {}
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="desktop-nav">
        <Link to="/" className="nav-logo">
          <span className="nav-logo-moon">🌙</span>
          <span className="nav-logo-text">Dream Share</span>
        </Link>

        <div className="nav-links">
          <Link to="/"        className="nav-link">Feed</Link>
          <Link to="/search"  className="nav-link">🔍 Search</Link>
          <Link to="/explore" className="nav-link">🔭 Explore</Link>

          {userId ? (
            <>
              <Link to="/create" className="nav-create-btn">+ Post Dream</Link>

              <div className="nav-icon-wrap" onClick={() => navigate('/conversations')}>
                <span className="nav-icon">💬</span>
                {unreadMessages > 0 && <span className="nav-badge">{unreadMessages}</span>}
              </div>

              <div className="nav-icon-wrap">
                <Link to="/notifications" className="nav-icon">🔔</Link>
                {unreadNotifications > 0 && <span className="nav-badge">{unreadNotifications}</span>}
              </div>

              <Link to={`/profile/${userId}`} className="nav-link">My Profile</Link>
              <button className="nav-logout-btn" onClick={() => {
                localStorage.clear();
                window.location.href = '/login';
              }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"    className="nav-link">Login</Link>
              <Link to="/register" className="nav-create-btn">Join Free</Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Navigation — 7 items */}
      {userId && (
        <div className="mobile-nav">

          {/* Feed */}
          <Link to="/" className={`mobile-nav-item ${isActive('/')}`}>
            <span className="mobile-nav-icon">🏠</span>
            <span className="mobile-nav-label">Feed</span>
          </Link>

          {/* Search */}
          <Link to="/search" className={`mobile-nav-item ${isActive('/search')}`}>
            <span className="mobile-nav-icon">🔍</span>
            <span className="mobile-nav-label">Search</span>
          </Link>

          {/* Post Dream — center button */}
          <Link to="/create" className="mobile-post-btn">+</Link>

          {/* Explore */}
          <Link to="/explore" className={`mobile-nav-item ${isActive('/explore')}`}>
            <span className="mobile-nav-icon">🔭</span>
            <span className="mobile-nav-label">Explore</span>
          </Link>

          {/* Messages */}
          <div
            className={`mobile-nav-item ${isActive('/conversations')}`}
            onClick={() => navigate('/conversations')}
          >
            <span className="mobile-nav-icon">💬</span>
            {unreadMessages > 0 && <span className="mobile-badge">{unreadMessages}</span>}
            <span className="mobile-nav-label">Messages</span>
          </div>

          {/* Notifications */}
          <div
            className={`mobile-nav-item ${isActive('/notifications')}`}
            onClick={() => navigate('/notifications')}
          >
            <span className="mobile-nav-icon">🔔</span>
            {unreadNotifications > 0 && <span className="mobile-badge">{unreadNotifications}</span>}
            <span className="mobile-nav-label">Alerts</span>
          </div>

          {/* Profile */}
          <Link
            to={`/profile/${userId}`}
            className={`mobile-nav-item ${isActive(`/profile/${userId}`)}`}
          >
            <span className="mobile-nav-icon">👤</span>
            <span className="mobile-nav-label">Profile</span>
          </Link>

        </div>
      )}
    </>
  );
}

export default Navbar;