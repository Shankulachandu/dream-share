import React from 'react';
import axios from 'axios';

const moodEmoji = {
  happy: '😊', scary: '😱', weird: '🤯',
  neutral: '😶', romantic: '💕', lucid: '✨'
};

function DreamCard({ dream, onLike }) {
  const handleLike = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) { alert('Login to like dreams!'); return; }

    await axios.post('http://127.0.0.1:5000/dream/like', {
      user_id: parseInt(userId),
      dream_id: dream.id
    });

    if (onLike) onLike();
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.username}>
          {dream.is_anonymous ? '🕶️ Anonymous Dreamer' : `@${dream.username}`}
        </span>
        <span style={styles.mood}>
          {moodEmoji[dream.mood]} {dream.mood}
        </span>
      </div>

      <p style={styles.content}>{dream.content}</p>

      <div style={styles.footer}>
        <button onClick={handleLike} style={styles.likeBtn}>
          ❤️ {dream.like_count}
        </button>
        <span style={styles.comments}>💬 {dream.comment_count}</span>
        <span style={styles.time}>
          {new Date(dream.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#fff',
    border: '1px solid #eee',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px'
  },
  username: {
    fontWeight: '600',
    fontSize: '14px',
    color: '#6c63ff'
  },
  mood: {
    fontSize: '13px',
    color: '#888'
  },
  content: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#222',
    marginBottom: '12px'
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  likeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#e74c3c'
  },
  comments: {
    fontSize: '14px',
    color: '#888'
  },
  time: {
    fontSize: '12px',
    color: '#bbb',
    marginLeft: 'auto'
  }
};

export default DreamCard;