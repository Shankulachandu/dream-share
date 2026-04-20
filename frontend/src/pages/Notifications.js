import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const myId = localStorage.getItem('user_id');
  const navigate = useNavigate();

  useEffect(() => {
    if (!myId) { navigate('/login'); return; }
    axios.get(`http://127.0.0.1:5000/notifications/${myId}`)
         .then(res => setNotifications(res.data));
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔔 Notifications</h2>

      {notifications.length === 0 ? (
        <p style={styles.empty}>No notifications yet.</p>
      ) : (
        notifications.map((n, i) => (
          <div key={i} style={styles.card}>
            <span style={styles.icon}>
              {n.type === 'like' ? '❤️' : '👤'}
            </span>
            <div>
              <p style={styles.message}>{n.message}</p>
              {n.preview && (
                <p style={styles.preview}>"{n.preview}..."</p>
              )}
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
    margin: '32px auto',
    padding: '0 16px'
  },
  title: {
    marginBottom: '24px',
    color: '#1a1a2e'
  },
  empty: {
    color: '#888',
    textAlign: 'center',
    marginTop: '40px'
  },
  card: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px',
    background: '#fff',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '10px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  },
  icon: {
    fontSize: '22px',
    flexShrink: 0
  },
  message: {
    margin: 0,
    fontSize: '14px',
    fontWeight: '600',
    color: '#222'
  },
  preview: {
    margin: '4px 0 0',
    fontSize: '12px',
    color: '#888'
  }
};

export default Notifications;