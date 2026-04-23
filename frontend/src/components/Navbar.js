import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
  const [unreadMessages, setUnreadMessages]           = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const userId   = localStorage.getItem('user_id');
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;
    fetchCounts();
    const interval = setInterval(fetchCounts, 10000);
    return () => clearInterval(interval);
  }, [userId]);

  const fetchCounts = async () => {
    try {
      const [msgRes, notifRes] = await Promise.all([
        axios.get(`http://127.0.0.1:5000/messages/unread/${userId}`),
        axios.get(`http://127.0.0.1:5000/notifications/unread/${userId}`)
      ]);
      setUnreadMessages(msgRes.data.count);
      setUnreadNotifications(notifRes.data.count);
    } catch (err) {}
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        <span style={styles.logoMoon}>🌙</span>
        <span style={styles.logoText}>Dream Share</span>
      </Link>

      <div style={styles.links}>
        <Link to="/"       style={styles.link}>Feed</Link>
        <Link to="/search"  style={styles.link}>🔍 Search</Link>
        <Link to="/explore" style={styles.link}>🔭 Explore</Link>

        {userId ? (
          <>
            <Link to="/create" style={styles.createBtn}>+ Post Dream</Link>

            {/* Messages icon with badge */}
            <div style={styles.iconWrap} onClick={() => navigate('/conversations')}>
              <span style={styles.iconBtn}>💬</span>
              {unreadMessages > 0 && (
                <span style={styles.badge}>{unreadMessages}</span>
              )}
            </div>

            {/* Notifications icon with badge */}
            <div style={styles.iconWrap}>
              <Link to="/notifications" style={styles.iconBtn}>🔔</Link>
              {unreadNotifications > 0 && (
                <span style={styles.badge}>{unreadNotifications}</span>
              )}
            </div>

            <Link to={`/profile/${userId}`} style={styles.link}>My Profile</Link>
            <button onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"    style={styles.link}>Login</Link>
            <Link to="/register" style={styles.createBtn}>Join Free</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 32px',
    background: 'rgba(15, 15, 26, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(108, 99, 255, 0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none'
  },
  logoMoon: {
    fontSize: '24px'
  },
  logoText: {
    color: 'white',
    fontSize: '20px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  links: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center'
  },
  link: {
    color: '#a0a0b0',
    textDecoration: 'none',
    fontSize: '14px',
    padding: '6px 12px',
    borderRadius: '8px',
    fontWeight: '500'
  },
  createBtn: {
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600'
  },
  iconWrap: {
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '6px'
  },
  iconBtn: {
    fontSize: '20px',
    textDecoration: 'none'
  },
  badge: {
    position: 'absolute',
    top: '-2px',
    right: '-2px',
    background: '#e74c3c',
    color: 'white',
    fontSize: '10px',
    fontWeight: 'bold',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #0f0f1a'
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.05)',
    color: '#a0a0b0',
    border: '1px solid rgba(255,255,255,0.1)',
    padding: '6px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px'
  }
};

export default Navbar;