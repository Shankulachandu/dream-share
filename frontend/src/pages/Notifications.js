import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const myId     = localStorage.getItem('user_id');
  const navigate = useNavigate();

  useEffect(() => {
    if (!myId) { navigate('/login'); return; }
    axios.get(`${API_URL}/notifications/${myId}`)
         .then(res => { setNotifications(res.data); setLoading(false); });
  }, []);

  const getIcon = (type) => {
    if (type === 'like')       return '❤️';
    if (type === 'follow')     return '👤';
    if (type === 'connection') return '🌀';
    return '🔔';
  };

  const getCardStyle = (type) => {
    if (type === 'connection') return {
      ...styles.card,
      background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(167,139,250,0.05))',
      border: '1px solid rgba(108,99,255,0.4)'
    };
    return styles.card;
  };

  const getIconStyle = (type) => {
    if (type === 'connection') return {
      ...styles.iconBox,
      background: 'linear-gradient(135deg, rgba(108,99,255,0.3), rgba(167,139,250,0.2))',
      border: '1px solid rgba(108,99,255,0.4)'
    };
    return styles.iconBox;
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
            When someone likes, follows you, or you get a Dream Connection it will show here.
          </p>
        </div>
      ) : (
        notifications.map((n, i) => (
          <div
            key={i}
            style={{
              ...getCardStyle(n.type),
              cursor: n.link ? 'pointer' : 'default'
            }}
            onClick={() => n.link && navigate(n.link)}
          >
            <div style={getIconStyle(n.type)}>
              {getIcon(n.type)}
            </div>
            <div style={styles.info}>
              <p style={{
                ...styles.message,
                color: n.type === 'connection' ? '#a78bfa' : 'white'
              }}>
                {n.message}
              </p>
              {n.preview && (
                <p style={styles.preview}>
                  {n.type === 'connection' ? n.preview : `"${n.preview}..."`}
                </p>
              )}
              <p style={styles.time}>
                {new Date(n.time).toLocaleDateString()}
              </p>
            </div>
            {n.link && (
              <span style={styles.arrow}>→</span>
            )}
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
    marginTop: '6px',
    maxWidth: '280px',
    margin: '8px auto 0',
    lineHeight: '1.6'
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
    fontSize: '20px',
    flexShrink: 0,
    width: '44px',
    height: '44px',
    background: 'rgba(108,99,255,0.15)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  info: { flex: 1 },
  message: {
    margin: 0,
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
    lineHeight: '1.4'
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
  },
  arrow: {
    color: '#6b7280',
    fontSize: '18px',
    flexShrink: 0,
    alignSelf: 'center'
  }
};

export default Notifications;