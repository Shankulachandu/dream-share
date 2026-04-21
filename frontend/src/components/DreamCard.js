import React, { useState } from 'react';
import axios from 'axios';

const moodEmoji = {
  happy: '😊', scary: '😱', weird: '🤯',
  neutral: '😶', romantic: '💕', lucid: '✨'
};

const moodColors = {
  happy:    '#f59e0b',
  scary:    '#ef4444',
  weird:    '#8b5cf6',
  neutral:  '#6b7280',
  romantic: '#ec4899',
  lucid:    '#06b6d4'
};

function DreamCard({ dream, onLike }) {
  const [showComments, setShowComments]             = useState(false);
  const [comments, setComments]                     = useState([]);
  const [newComment, setNewComment]                 = useState('');
  const [loadingCom, setLoadingCom]                 = useState(false);
  const [interpretation, setInterpretation]         = useState('');
  const [loadingAI, setLoadingAI]                   = useState(false);
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [liked, setLiked]                           = useState(false);

  const handleLike = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) { alert('Login to like dreams!'); return; }
    await axios.post('http://127.0.0.1:5000/dream/like', {
      user_id: parseInt(userId),
      dream_id: dream.id
    });
    setLiked(!liked);
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
    if (!newComment.trim()) return;
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
    if (showInterpretation) { setShowInterpretation(false); return; }
    if (interpretation) { setShowInterpretation(true); return; }
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

  const moodColor = moodColors[dream.mood] || '#6b7280';

  return (
    <div style={styles.card}>

      {/* Mood accent bar */}
      <div style={{ ...styles.moodBar, background: moodColor }} />

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.userInfo}>
          <div style={{
            ...styles.avatar,
            background: dream.is_anonymous
              ? 'linear-gradient(135deg, #444, #666)'
              : 'linear-gradient(135deg, #6c63ff, #a78bfa)'
          }}>
            {dream.is_anonymous ? '?' : dream.username[0].toUpperCase()}
          </div>
          <div>
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
            <div style={styles.meta}>
              <span style={{ ...styles.moodTag, color: moodColor, borderColor: moodColor }}>
                {moodEmoji[dream.mood]} {dream.mood}
              </span>
              <span style={styles.time}>
                {new Date(dream.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
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
          <div style={styles.aiHeader}>
            <span>🤖</span>
            <span style={styles.aiTitle}>AI Dream Interpretation</span>
          </div>
          <p style={styles.aiText}>{interpretation}</p>
        </div>
      )}

      {/* Footer buttons */}
      <div style={styles.footer}>
        <button onClick={handleLike} style={{
          ...styles.actionBtn,
          color: liked ? '#e74c3c' : '#a0a0b0'
        }}>
          {liked ? '❤️' : '🤍'} {dream.like_count}
        </button>

        <button onClick={loadComments} style={styles.actionBtn}>
          💬 {dream.comment_count}
        </button>

        <button onClick={interpretDream} style={styles.interpretBtn}>
          {loadingAI ? '⏳ Analyzing...' : showInterpretation ? '🤖 Hide' : '🤖 Interpret'}
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div style={styles.commentsBox}>
          {loadingCom && <p style={styles.loadingText}>Loading comments...</p>}

          {comments.length === 0 ? (
            <p style={styles.noComments}>No comments yet. Be the first!</p>
          ) : (
            comments.map(c => (
              <div key={c.id} style={styles.commentItem}>
                <div style={styles.commentAvatar}>
                  {c.username[0].toUpperCase()}
                </div>
                <div style={styles.commentContent}>
                  <span style={styles.commentUser}>@{c.username}</span>
                  <span style={styles.commentText}>{c.text}</span>
                </div>
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
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '0',
    marginBottom: '20px',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  moodBar: {
    height: '3px',
    width: '100%',
    opacity: 0.8
  },
  header: {
    padding: '16px 16px 8px'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  avatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '16px',
    flexShrink: 0
  },
  username: {
    fontWeight: '600',
    fontSize: '14px',
    color: '#a78bfa',
    display: 'block'
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '3px'
  },
  moodTag: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '20px',
    border: '1px solid',
    opacity: 0.9
  },
  time: {
    fontSize: '11px',
    color: '#6b7280'
  },
  content: {
    fontSize: '15px',
    lineHeight: '1.7',
    color: '#e0e0e0',
    padding: '8px 16px 16px',
    margin: 0
  },
  dreamImage: {
    width: '100%',
    maxHeight: '320px',
    objectFit: 'cover',
    display: 'block'
  },
  aiBox: {
    margin: '0 16px 16px',
    background: 'rgba(108, 99, 255, 0.1)',
    border: '1px solid rgba(108, 99, 255, 0.3)',
    borderRadius: '12px',
    padding: '14px'
  },
  aiHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px'
  },
  aiTitle: {
    fontWeight: '700',
    fontSize: '12px',
    color: '#a78bfa',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  aiText: {
    fontSize: '13px',
    lineHeight: '1.6',
    color: '#c4b5fd',
    margin: 0,
    fontStyle: 'italic'
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 12px 12px',
    borderTop: '1px solid rgba(255,255,255,0.06)'
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#a0a0b0',
    padding: '6px 12px',
    borderRadius: '8px',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  interpretBtn: {
    background: 'rgba(108, 99, 255, 0.15)',
    border: '1px solid rgba(108, 99, 255, 0.3)',
    color: '#a78bfa',
    padding: '5px 12px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    marginLeft: 'auto'
  },
  commentsBox: {
    padding: '12px 16px 16px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(0,0,0,0.2)'
  },
  loadingText: {
    fontSize: '13px',
    color: '#6b7280',
    textAlign: 'center',
    padding: '8px'
  },
  noComments: {
    fontSize: '13px',
    color: '#6b7280',
    textAlign: 'center',
    padding: '8px 0'
  },
  commentItem: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
    marginBottom: '12px'
  },
  commentAvatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '700',
    flexShrink: 0
  },
  commentContent: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '10px',
    padding: '8px 12px',
    flex: 1
  },
  commentUser: {
    fontWeight: '600',
    fontSize: '12px',
    color: '#a78bfa',
    display: 'block',
    marginBottom: '2px'
  },
  commentText: {
    fontSize: '13px',
    color: '#d0d0d0'
  },
  commentInputRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px'
  },
  commentInput: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    fontSize: '13px',
    outline: 'none'
  },
  sendBtn: {
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: 'white',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600'
  }
};

export default DreamCard;