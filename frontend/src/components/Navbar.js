import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
  const [unreadMessages, setUnreadMessages]         = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const userId   = localStorage.getItem('user_id');
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;
    fetchCounts();
    // Check every 10 seconds automatically
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
    } catch (err) {
      console.log('Could not fetch counts');
    }
  };

  const handleMessagesClick = () => {
    navigate('/conversations');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>🌙 Dream Share</Link>

      <div style={styles.links}>
        <Link to="/"       style={styles.link}>Feed</Link>
        <Link to="/search" style={styles.link}>🔍 Search</Link>

        {userId ? (
          <>
            <Link to="/create" style={styles.link}>+ Post</Link>

            {/* Messages icon with badge */}
            <div style={styles.iconWrap} onClick={handleMessagesClick}>
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
            }} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"    style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
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
    padding: '12px 24px',
    backgroundColor: '#0f0f1a',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  logo: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '20px',
    fontWeight: 'bold'
  },
  links: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center'
  },
  link: {
    color: '#ccc',
    textDecoration: 'none',
    fontSize: '14px'
  },
  iconWrap: {
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  },
  iconBtn: {
    fontSize: '20px',
    textDecoration: 'none',
    color: 'white'
  },
  badge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
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
  btn: {
    background: 'none',
    color: '#ccc',
    border: '1px solid #444',
    padding: '4px 12px',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};

export default Navbar;