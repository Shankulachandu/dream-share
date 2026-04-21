import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const myId     = localStorage.getItem('user_id');
  const navigate = useNavigate();

  useEffect(() => {
    if (!myId) { navigate('/login'); return; }
    axios.get(`http://127.0.0.1:5000/notifications/${myId}`)
         .then(res => { setNotifications(res.data); setLoading(false); });
  }, []);

  const getIcon = (type) => {
    if (type === 'like')   return '❤️';
    if (type === 'follow') return '👤';
    return '🔔';
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h2 style={styles.title}>🔔 Notifications</h2>
        <p style={styles.subtitle}>Your latest activity</p>
      </div>

      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : notifications.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyIcon}>🔔</p>
          <p style={styles.emptyText}>No notifications yet</p>
          <p style={styles.emptySub}>
            When someone likes or follows you, it will show here.
          </p>
        </div>
      ) : (
        notifications.map((n, i) => (
          <div key={i} style={styles.card}>
            <div style={styles.iconBox}>{getIcon(n.type)}</div>
            <div style={styles.info}>
              <p style={styles.message}>{n.message}</p>
              {n.preview && (
                <p style={styles.preview}>"{n.preview}..."</p>
              )}
              <p style={styles.time}>
                {new Date(n.time).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '32px 16px'
  },
  hero: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  title: {
    color: 'white',
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '6px'
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '14px'
  },
  loading: {
    textAlign: 'center',
    color: '#6b7280',
    padding: '40px'
  },
  empty: {
    textAlign: 'center',
    padding: '60px 0'
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '12px'
  },
  emptyText: {
    color: 'white',
    fontSize: '18px',
    fontWeight: '600'
  },
  emptySub: {
    color: '#6b7280',
    fontSize: '13px',
    marginTop: '6px'
  },
  card: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '16px',
    borderRadius: '16px',
    marginBottom: '10px',
    backdropFilter: 'blur(10px)'
  },
  iconBox: {
    fontSize: '24px',
    flexShrink: 0,
    width: '44px',
    height: '44px',
    background: 'rgba(108, 99, 255, 0.15)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  info: {
    flex: 1
  },
  message: {
    margin: 0,
    fontSize: '14px',
    fontWeight: '600',
    color: 'white'
  },
  preview: {
    margin: '4px 0 0',
    fontSize: '12px',
    color: '#6b7280',
    fontStyle: 'italic'
  },
  time: {
    margin: '4px 0 0',
    fontSize: '11px',
    color: '#4b5563'
  }
};

export default Notifications;