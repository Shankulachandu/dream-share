import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Conversations() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading]             = useState(true);
  const myId     = localStorage.getItem('user_id');
  const navigate = useNavigate();

  useEffect(() => {
    if (!myId) { navigate('/login'); return; }
    axios.get(`http://127.0.0.1:5000/conversations/${myId}`)
         .then(res => { setConversations(res.data); setLoading(false); });
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>💬 Messages</h2>

      {loading ? (
        <p>Loading...</p>
      ) : conversations.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyIcon}>💬</p>
          <p>No messages yet.</p>
          <p style={styles.emptyHint}>Search for a user and send them a message!</p>
          <button
            onClick={() => navigate('/search')}
            style={styles.searchBtn}
          >
            🔍 Find People
          </button>
        </div>
      ) : (
        conversations.map(c => (
          <div
            key={c.user_id}
            style={styles.card}
            onClick={() => navigate(`/messages/${c.user_id}`)}
          >
            <div style={styles.avatar}>
              {c.username[0].toUpperCase()}
            </div>
            <div style={styles.info}>
              <p style={styles.username}>@{c.username}</p>
              <p style={styles.lastMsg}>
                {c.last_message || 'Start a conversation'}
              </p>
            </div>
            <div style={styles.right}>
              {c.unread > 0 && (
                <span style={styles.unreadBadge}>{c.unread}</span>
              )}
              <span style={styles.time}>
                {c.last_time
                  ? new Date(c.last_time).toLocaleDateString()
                  : ''}
              </span>
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
    textAlign: 'center',
    marginTop: '60px',
    color: '#888'
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '12px'
  },
  emptyHint: {
    fontSize: '13px',
    color: '#aaa',
    marginTop: '6px'
  },
  searchBtn: {
    marginTop: '16px',
    padding: '10px 24px',
    background: '#6c63ff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: '#fff',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '10px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    cursor: 'pointer'
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: '#6c63ff',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    flexShrink: 0
  },
  info: {
    flex: 1
  },
  username: {
    fontWeight: '600',
    color: '#1a1a2e',
    margin: 0,
    fontSize: '15px'
  },
  lastMsg: {
    color: '#888',
    margin: '3px 0 0',
    fontSize: '13px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '300px'
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '6px'
  },
  unreadBadge: {
    background: '#6c63ff',
    color: 'white',
    fontSize: '11px',
    fontWeight: 'bold',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  time: {
    fontSize: '11px',
    color: '#bbb'
  }
};

export default Conversations;