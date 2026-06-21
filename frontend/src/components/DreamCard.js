import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { timeAgo } from '../utils/timeAgo';

const moodEmoji = {
  happy: '😊', scary: '😱', weird: '🤯',
  neutral: '😶', romantic: '💕', lucid: '✨'
};

const moodColors = {
  happy: '#f59e0b', scary: '#ef4444', weird: '#8b5cf6',
  neutral: '#6b7280', romantic: '#ec4899', lucid: '#06b6d4'
};

const getMediaSrc = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `${API_URL}${url}`;
};

function DreamCard({ dream, onLike, onDelete }) {
  const [showComments, setShowComments]             = useState(false);
  const [comments, setComments]                     = useState([]);
  const [newComment, setNewComment]                 = useState('');
  const [loadingCom, setLoadingCom]                 = useState(false);
  const [interpretation, setInterpretation]         = useState('');
  const [loadingAI, setLoadingAI]                   = useState(false);
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [liked, setLiked]                           = useState(false);
  const [likeCount, setLikeCount]                   = useState(dream.like_count);
  const [showOptions, setShowOptions]               = useState(false);
  const [confirmDelete, setConfirmDelete]           = useState(false);
  const [isLiking, setIsLiking]                     = useState(false);
  const [showShare, setShowShare]                   = useState(false);
  const [copied, setCopied]                         = useState(false);

  const optionsRef = useRef(null);

  const myId      = localStorage.getItem('user_id');
  const isMyDream = myId && dream.owner_id && String(dream.owner_id) === String(myId);

  const dreamUrl  = `${window.location.origin}/dream/${dream.id}`;
  const shareText = `🌙 Check out this dream on Dream Share!\n\n"${dream.content.slice(0, 100)}..."\n\n`;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };
    if (showOptions) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showOptions]);

  const handleLike = async () => {
    if (!myId) { alert('Login to like dreams!'); return; }
    if (isLiking) return;
    setIsLiking(true);
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    try {
      await axios.post(`${API_URL}/dream/like`, {
        user_id: parseInt(myId), dream_id: dream.id
      });
      if (onLike) onLike();
    } catch (err) {
      setLiked(liked);
      setLikeCount(likeCount);
    }
    setIsLiking(false);
  };

  const handleDelete = async () => {
    await axios.delete(`${API_URL}/dream/${dream.id}?user_id=${myId}`);
    setConfirmDelete(false);
    setShowOptions(false);
    if (onDelete) onDelete();
    if (onLike) onLike();
  };

  const loadComments = async () => {
    if (showComments) { setShowComments(false); return; }
    setLoadingCom(true);
    const res = await axios.get(`${API_URL}/dream/${dream.id}/comments`);
    setComments(res.data);
    setShowComments(true);
    setLoadingCom(false);
  };

  const postComment = async () => {
    if (!myId) { alert('Login to comment!'); return; }
    if (!newComment.trim()) return;
    await axios.post(`${API_URL}/dream/comment`, {
      user_id: parseInt(myId), dream_id: dream.id, text: newComment
    });
    setNewComment('');
    const res = await axios.get(`${API_URL}/dream/${dream.id}/comments`);
    setComments(res.data);
  };

  const interpretDream = async () => {
    if (showInterpretation) { setShowInterpretation(false); return; }
    if (interpretation) { setShowInterpretation(true); return; }
    setLoadingAI(true);
    try {
      const res = await axios.post(`${API_URL}/dream/interpret`, {
        content: dream.content
      });
      setInterpretation(res.data.interpretation);
      setShowInterpretation(true);
    } catch (err) {
      alert('Could not interpret dream. Try again.');
    }
    setLoadingAI(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(dreamUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + dreamUrl)}`, '_blank');
  };

  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(dreamUrl)}`, '_blank');
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(dreamUrl)}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '🌙 Dream Share',
          text:  shareText,
          url:   dreamUrl
        });
      } catch (err) {}
    } else {
      setShowShare(true);
    }
  };

  const moodColor = moodColors[dream.mood] || '#6b7280';

  return (
    <div style={styles.card}>
      <div style={{ ...styles.moodBar, background: moodColor }} />

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
              style={{ ...styles.username, cursor: dream.is_anonymous ? 'default' : 'pointer' }}
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
              <span style={styles.time}>{timeAgo(dream.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Options menu */}
        <div style={styles.optionsWrap} ref={optionsRef}>
          <button
            onClick={() => setShowOptions(!showOptions)}
            style={styles.optionsBtn}
          >
            ···
          </button>
          {showOptions && (
            <div style={styles.optionsMenu}>
              <button
                onClick={() => { handleNativeShare(); setShowOptions(false); }}
                style={styles.menuOption}
              >
                🔗 Share Dream
              </button>
              {isMyDream && (
                <>
                  <div style={styles.menuDivider} />
                  <button
                    onClick={() => { setConfirmDelete(true); setShowOptions(false); }}
                    style={{ ...styles.menuOption, color: '#ef4444' }}
                  >
                    🗑️ Delete Dream
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div style={styles.confirmBox}>
          <p style={styles.confirmText}>Are you sure you want to delete this dream?</p>
          <div style={styles.confirmBtns}>
            <button onClick={() => setConfirmDelete(false)} style={styles.confirmCancel}>Cancel</button>
            <button onClick={handleDelete} style={styles.confirmDelete}>Yes, Delete</button>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShare && (
        <div style={styles.shareModal} onClick={() => setShowShare(false)}>
          <div style={styles.shareCard} onClick={e => e.stopPropagation()}>
            <div style={styles.shareHeader}>
              <p style={styles.shareTitle}>🔗 Share this Dream</p>
              <button onClick={() => setShowShare(false)} style={styles.shareClose}>✕</button>
            </div>
            <div style={styles.sharePreview}>
              <p style={styles.sharePreviewText}>
                "{dream.content.slice(0, 80)}{dream.content.length > 80 ? '...' : ''}"
              </p>
            </div>
            <div style={styles.shareButtons}>
              <button onClick={handleShareWhatsApp} style={styles.shareBtn}>
                <span style={styles.shareBtnIcon}>💬</span>
                <span style={styles.shareBtnLabel}>WhatsApp</span>
              </button>
              <button onClick={handleShareTwitter} style={styles.shareBtn}>
                <span style={styles.shareBtnIcon}>🐦</span>
                <span style={styles.shareBtnLabel}>Twitter</span>
              </button>
              <button onClick={handleShareFacebook} style={styles.shareBtn}>
                <span style={styles.shareBtnIcon}>📘</span>
                <span style={styles.shareBtnLabel}>Facebook</span>
              </button>
              <button onClick={handleCopyLink} style={{
                ...styles.shareBtn,
                background:  copied ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
                borderColor: copied ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)'
              }}>
                <span style={styles.shareBtnIcon}>{copied ? '✅' : '🔗'}</span>
                <span style={styles.shareBtnLabel}>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
            <div style={styles.linkBox}>
              <p style={styles.linkText}>{dreamUrl}</p>
            </div>
          </div>
        </div>
      )}

      <p style={styles.content}>{dream.content}</p>

      {dream.image_url && (
        <img src={getMediaSrc(dream.image_url)} alt="dream" style={styles.dreamMedia} />
      )}
      {dream.video_url && (
        <video src={getMediaSrc(dream.video_url)} controls style={styles.dreamMedia} />
      )}

      {showInterpretation && interpretation && (
        <div style={styles.aiBox}>
          <div style={styles.aiHeader}>
            <span>🤖</span>
            <span style={styles.aiTitle}>AI Dream Interpretation</span>
          </div>
          <p style={styles.aiText}>{interpretation}</p>
        </div>
      )}

      <div style={styles.footer}>
        <button
          onClick={handleLike}
          style={{
            ...styles.actionBtn,
            color:      liked ? '#e74c3c' : '#a0a0b0',
            transform:  isLiking ? 'scale(1.3)' : 'scale(1)',
            transition: 'transform 0.1s'
          }}
        >
          {liked ? '❤️' : '🤍'} {likeCount}
        </button>

        <button onClick={loadComments} style={styles.actionBtn}>
          💬 {dream.comment_count}
        </button>

        <button onClick={handleNativeShare} style={styles.actionBtn}>
          🔗 Share
        </button>

        <button onClick={interpretDream} style={styles.interpretBtn}>
          {loadingAI ? '⏳' : showInterpretation ? '🤖 Hide' : '🤖 Interpret'}
        </button>
      </div>

      {showComments && (
        <div style={styles.commentsBox}>
          {loadingCom && <p style={styles.loadingText}>Loading comments...</p>}
          {comments.length === 0 ? (
            <p style={styles.noComments}>No comments yet. Be the first!</p>
          ) : (
            comments.map(c => (
              <div key={c.id} style={styles.commentItem}>
                <div style={styles.commentAvatar}>{c.username[0].toUpperCase()}</div>
                <div style={styles.commentContent}>
                  <div style={styles.commentTop}>
                    <span style={styles.commentUser}>@{c.username}</span>
                    <span style={styles.commentTime}>{timeAgo(c.created_at)}</span>
                  </div>
                  <p style={styles.commentText}>{c.text}</p>
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
            <button onClick={postComment} style={styles.sendBtn}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    marginBottom: '20px',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
    position: 'relative',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  moodBar: { height: '3px', width: '100%', opacity: 0.8 },
  header: {
    padding: '16px 16px 8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  userInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
  avatar: {
    width: '42px', height: '42px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'white', fontWeight: '700', fontSize: '16px', flexShrink: 0
  },
  username: { fontWeight: '600', fontSize: '14px', color: '#a78bfa', display: 'block' },
  meta: { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '3px' },
  moodTag: {
    fontSize: '11px', fontWeight: '600', padding: '2px 8px',
    borderRadius: '20px', border: '1px solid', opacity: 0.9
  },
  time: { fontSize: '11px', color: '#6b7280' },
  optionsWrap: { position: 'relative' },
  optionsBtn: {
    background: 'none', border: 'none', color: '#6b7280',
    cursor: 'pointer', fontSize: '20px', padding: '4px 8px',
    borderRadius: '8px', letterSpacing: '2px', lineHeight: '1'
  },
  optionsMenu: {
    position: 'absolute', top: '32px', right: 0,
    background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px', overflow: 'hidden', zIndex: 50,
    minWidth: '180px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
  },
  menuOption: {
    display: 'block', width: '100%', padding: '12px 16px',
    background: 'none', border: 'none', color: 'white',
    cursor: 'pointer', fontSize: '14px', textAlign: 'left', fontWeight: '500'
  },
  menuDivider: { height: '1px', background: 'rgba(255,255,255,0.08)', margin: '4px 0' },
  confirmBox: {
    margin: '0 16px 12px',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '12px', padding: '14px'
  },
  confirmText: { color: '#fca5a5', fontSize: '13px', marginBottom: '12px', textAlign: 'center' },
  confirmBtns: { display: 'flex', gap: '8px' },
  confirmCancel: {
    flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)',
    color: '#a0a0b0', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px', cursor: 'pointer', fontSize: '13px'
  },
  confirmDelete: {
    flex: 1, padding: '8px', background: '#ef4444', color: 'white',
    border: 'none', borderRadius: '8px', cursor: 'pointer',
    fontSize: '13px', fontWeight: '600'
  },
  shareModal: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    zIndex: 1000
  },
  shareCard: {
    background: '#1a1a2e', border: '1px solid rgba(108,99,255,0.3)',
    borderRadius: '24px 24px 0 0', padding: '24px',
    width: '100%', maxWidth: '500px', paddingBottom: '40px'
  },
  shareHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '16px'
  },
  shareTitle: { color: 'white', fontSize: '18px', fontWeight: '700', margin: 0 },
  shareClose: {
    background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white',
    width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontSize: '16px'
  },
  sharePreview: {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px', padding: '12px', marginBottom: '20px'
  },
  sharePreviewText: { color: '#d0d0d0', fontSize: '13px', lineHeight: '1.5', margin: 0, fontStyle: 'italic' },
  shareButtons: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' },
  shareBtn: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
    padding: '14px 8px', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', cursor: 'pointer'
  },
  shareBtnIcon: { fontSize: '24px' },
  shareBtnLabel: { fontSize: '11px', color: '#a0a0b0', fontWeight: '500' },
  linkBox: {
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px', padding: '10px 14px'
  },
  linkText: { color: '#6b7280', fontSize: '12px', margin: 0, wordBreak: 'break-all' },
  content: { fontSize: '15px', lineHeight: '1.7', color: '#e0e0e0', padding: '8px 16px 16px', margin: 0 },
  dreamMedia: { width: '100%', maxHeight: '320px', objectFit: 'cover', display: 'block' },
  aiBox: {
    margin: '0 16px 16px', background: 'rgba(108,99,255,0.1)',
    border: '1px solid rgba(108,99,255,0.3)', borderRadius: '12px', padding: '14px'
  },
  aiHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' },
  aiTitle: { fontWeight: '700', fontSize: '12px', color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.5px' },
  aiText: { fontSize: '13px', lineHeight: '1.6', color: '#c4b5fd', margin: 0, fontStyle: 'italic' },
  footer: {
    display: 'flex', alignItems: 'center', gap: '4px',
    padding: '8px 12px 12px', borderTop: '1px solid rgba(255,255,255,0.06)'
  },
  actionBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: '13px', color: '#a0a0b0', padding: '6px 10px',
    borderRadius: '8px', fontWeight: '500'
  },
  interpretBtn: {
    background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)',
    color: '#a78bfa', padding: '5px 12px', borderRadius: '20px',
    cursor: 'pointer', fontSize: '12px', fontWeight: '600', marginLeft: 'auto'
  },
  commentsBox: {
    padding: '12px 16px 16px', borderTop: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(0,0,0,0.2)'
  },
  loadingText: { fontSize: '13px', color: '#6b7280', textAlign: 'center', padding: '8px' },
  noComments: { fontSize: '13px', color: '#6b7280', textAlign: 'center', padding: '8px 0' },
  commentItem: { display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '12px' },
  commentAvatar: {
    width: '28px', height: '28px', borderRadius: '50%',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: 'white', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '11px', fontWeight: '700', flexShrink: 0
  },
  commentContent: { background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '8px 12px', flex: 1 },
  commentTop: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' },
  commentUser: { fontWeight: '600', fontSize: '12px', color: '#a78bfa' },
  commentTime: { fontSize: '10px', color: '#4b5563' },
  commentText: { fontSize: '13px', color: '#d0d0d0', margin: 0 },
  commentInputRow: { display: 'flex', gap: '8px', marginTop: '12px' },
  commentInput: {
    flex: 1, padding: '10px 14px', borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '13px', outline: 'none'
  },
  sendBtn: {
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: 'white', border: 'none', padding: '10px 18px',
    borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '600'
  }
};

export default DreamCard;