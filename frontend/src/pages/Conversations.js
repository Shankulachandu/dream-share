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
      <div style={styles.hero}>
        <h2 style={styles.title}>💬 Messages</h2>
        <p style={styles.subtitle}>Your private conversations</p>
      </div>

      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : conversations.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyIcon}>💬</p>
          <p style={styles.emptyText}>No messages yet</p>
          <p style={styles.emptySub}>Search for someone and start a conversation!</p>
          <button onClick={() => navigate('/search')} style={styles.searchBtn}>
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
              <p style={styles.lastMsg}>{c.last_message || 'Start a conversation'}</p>
            </div>
            <div style={styles.right}>
              {c.unread > 0 && (
                <span style={styles.unreadBadge}>{c.unread}</span>
              )}
              <span style={styles.time}>
                {c.last_time ? new Date(c.last_time).toLocaleDateString() : ''}
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
  searchBtn: {
    marginTop: '20px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '16px',
    borderRadius: '16px',
    marginBottom: '10px',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.2s'
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '700',
    flexShrink: 0
  },
  info: {
    flex: 1
  },
  username: {
    fontWeight: '600',
    color: '#a78bfa',
    margin: 0,
    fontSize: '15px'
  },
  lastMsg: {
    color: '#6b7280',
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
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: 'white',
    fontSize: '11px',
    fontWeight: '700',
    borderRadius: '50%',
    width: '22px',
    height: '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  time: {
    fontSize: '11px',
    color: '#4b5563'
  }
};

export default Conversations;