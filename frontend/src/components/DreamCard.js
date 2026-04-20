import React, { useState } from 'react';
import axios from 'axios';

const moodEmoji = {
  happy: '😊', scary: '😱', weird: '🤯',
  neutral: '😶', romantic: '💕', lucid: '✨'
};

function DreamCard({ dream, onLike }) {
  const [showComments, setShowComments]       = useState(false);
  const [comments, setComments]               = useState([]);
  const [newComment, setNewComment]           = useState('');
  const [loadingCom, setLoadingCom]           = useState(false);
  const [interpretation, setInterpretation]   = useState('');
  const [loadingAI, setLoadingAI]             = useState(false);
  const [showInterpretation, setShowInterpretation] = useState(false);

  const handleLike = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) { alert('Login to like dreams!'); return; }
    await axios.post('http://127.0.0.1:5000/dream/like', {
      user_id: parseInt(userId),
      dream_id: dream.id
    });
    if (onLike) onLike();
  };

  const loadComments = async () => {
    if (showComments) { setShowComments(false); return; }
    setLoadingCom(true);
    const res = await axios.get(`http://127.0.0.1:5000/dream/${dream.id}/comments`);
    setComments(res.data);
    setShowComments(true);
    setLoadingCom(false);
  };

  const postComment = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) { alert('Login to comment!'); return; }
    if (!newComment.trim()) { alert('Write a comment first!'); return; }
    await axios.post('http://127.0.0.1:5000/dream/comment', {
      user_id: parseInt(userId),
      dream_id: dream.id,
      text: newComment
    });
    setNewComment('');
    const res = await axios.get(`http://127.0.0.1:5000/dream/${dream.id}/comments`);
    setComments(res.data);
  };

  const interpretDream = async () => {
    if (showInterpretation) {
      setShowInterpretation(false);
      return;
    }
    if (interpretation) {
      setShowInterpretation(true);
      return;
    }
    setLoadingAI(true);
    try {
      const res = await axios.post('http://127.0.0.1:5000/dream/interpret', {
        content: dream.content
      });
      setInterpretation(res.data.interpretation);
      setShowInterpretation(true);
    } catch (err) {
      alert('Could not interpret dream. Try again.');
    }
    setLoadingAI(false);
  };

  return (
    <div style={styles.card}>

      {/* Header */}
      <div style={styles.header}>
        <span
          style={{
            ...styles.username,
            cursor: dream.is_anonymous ? 'default' : 'pointer'
          }}
          onClick={() => {
            if (!dream.is_anonymous && dream.user_id) {
              window.location.href = `/profile/${dream.user_id}`;
            }
          }}
        >
          {dream.is_anonymous ? '🕶️ Anonymous Dreamer' : `@${dream.username}`}
        </span>
        <span style={styles.mood}>
          {moodEmoji[dream.mood]} {dream.mood}
        </span>
      </div>

      {/* Dream content */}
      <p style={styles.content}>{dream.content}</p>

      {/* Dream image */}
      {dream.image_url && (
        <img
          src={`http://127.0.0.1:5000${dream.image_url}`}
          alt="dream"
          style={styles.dreamImage}
        />
      )}

      {/* AI Interpretation */}
      {showInterpretation && interpretation && (
        <div style={styles.aiBox}>
          <p style={styles.aiTitle}>🤖 AI Dream Interpretation</p>
          <p style={styles.aiText}>{interpretation}</p>
        </div>
      )}

      {/* Footer buttons */}
      <div style={styles.footer}>
        <button onClick={handleLike} style={styles.likeBtn}>
          ❤️ {dream.like_count}
        </button>
        <button onClick={loadComments} style={styles.commentBtn}>
          💬 {dream.comment_count} {showComments ? '▲' : '▼'}
        </button>
        <button onClick={interpretDream} style={styles.aiBtn}>
          {loadingAI ? '⏳' : '🤖 Interpret'}
        </button>
        <span style={styles.time}>
          {new Date(dream.created_at).toLocaleDateString()}
        </span>
      </div>

      {/* Comments section */}
      {showComments && (
        <div style={styles.commentsBox}>
          {loadingCom && <p style={styles.loading}>Loading comments...</p>}
          {comments.length === 0 ? (
            <p style={styles.noComments}>No comments yet. Be the first!</p>
          ) : (
            comments.map(c => (
              <div key={c.id} style={styles.commentItem}>
                <span style={styles.commentUser}>@{c.username}</span>
                <span style={styles.commentText}>{c.text}</span>
                <span style={styles.commentTime}>
                  {new Date(c.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
          <div style={styles.commentInputRow}>
            <input
              placeholder="Write a comment..."
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && postComment()}
              style={styles.commentInput}
            />
            <button onClick={postComment} style={styles.sendBtn}>
              Send
            </button>
          </div>
        </div>
      )}
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
  dreamImage: {
    width: '100%',
    maxHeight: '300px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '12px'
  },
  aiBox: {
    background: 'linear-gradient(135deg, #667eea22, #764ba222)',
    border: '1px solid #6c63ff44',
    borderRadius: '10px',
    padding: '12px 16px',
    marginBottom: '12px'
  },
  aiTitle: {
    fontWeight: '700',
    fontSize: '13px',
    color: '#6c63ff',
    margin: '0 0 6px 0'
  },
  aiText: {
    fontSize: '13px',
    lineHeight: '1.6',
    color: '#444',
    margin: 0,
    fontStyle: 'italic'
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap'
  },
  likeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#e74c3c'
  },
  commentBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#6c63ff'
  },
  aiBtn: {
    background: 'none',
    border: '1px solid #6c63ff',
    color: '#6c63ff',
    padding: '3px 10px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600'
  },
  time: {
    fontSize: '12px',
    color: '#bbb',
    marginLeft: 'auto'
  },
  commentsBox: {
    marginTop: '16px',
    borderTop: '1px solid #eee',
    paddingTop: '12px'
  },
  loading: {
    fontSize: '13px',
    color: '#888'
  },
  noComments: {
    fontSize: '13px',
    color: '#aaa',
    marginBottom: '10px'
  },
  commentItem: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-start',
    marginBottom: '10px',
    padding: '8px',
    background: '#f9f9ff',
    borderRadius: '8px'
  },
  commentUser: {
    fontWeight: '600',
    fontSize: '12px',
    color: '#6c63ff',
    minWidth: '80px'
  },
  commentText: {
    fontSize: '13px',
    color: '#333',
    flex: 1
  },
  commentTime: {
    fontSize: '11px',
    color: '#bbb',
    minWidth: '70px',
    textAlign: 'right'
  },
  commentInputRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '10px'
  },
  commentInput: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '13px'
  },
  sendBtn: {
    background: '#6c63ff',
    color: 'white',
    border: 'none',
        padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px'
  }
};

export default DreamCard;