import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const MAX_CHARS = 1000;

function CreateDream() {
  const [content, setContent]         = useState('');
  const [mood, setMood]               = useState('neutral');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [tags, setTags]               = useState('');
  const [listening, setListening]     = useState(false);
  const [image, setImage]             = useState(null);
  const [preview, setPreview]         = useState(null);
  const [isVideo, setIsVideo]         = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const navigate = useNavigate();

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Use Chrome for voice input.'); return; }
    const rec = new SR();
    rec.lang = 'en-US';
    rec.start();
    setListening(true);
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setContent(p => {
        const newContent = p + ' ' + transcript;
        return newContent.slice(0, MAX_CHARS);
      });
      setListening(false);
    };
    rec.onerror = () => setListening(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsVideo(file.type.startsWith('video/'));
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlePost = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) { navigate('/login'); return; }
    if (!content.trim()) { setError('Write your dream first!'); return; }
    if (content.length > MAX_CHARS) { setError(`Dream must be under ${MAX_CHARS} characters`); return; }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('user_id',      userId);
      formData.append('content',      content);
      formData.append('mood',         mood);
      formData.append('is_anonymous', isAnonymous);
      formData.append('tags',         tags);
      if (image) formData.append(isVideo ? 'video' : 'image', image);

      await axios.post(`${API_URL}/dream/create`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const moods = [
    { name: 'happy',    emoji: '😊' },
    { name: 'scary',    emoji: '😱' },
    { name: 'weird',    emoji: '🤯' },
    { name: 'neutral',  emoji: '😶' },
    { name: 'romantic', emoji: '💕' },
    { name: 'lucid',    emoji: '✨' }
  ];

  const charsLeft    = MAX_CHARS - content.length;
  const charsPercent = (content.length / MAX_CHARS) * 100;
  const charsColor   = charsLeft < 50 ? '#ef4444' : charsLeft < 100 ? '#f59e0b' : '#a78bfa';

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
          <h2 style={styles.title}>🌙 Share Your Dream</h2>
          <div style={{ width: '60px' }} />
        </div>

        {/* Voice button */}
        <button onClick={startVoice} style={{
          ...styles.voiceBtn,
          background:  listening ? 'rgba(239,68,68,0.2)' : 'rgba(108,99,255,0.15)',
          borderColor: listening ? '#ef4444' : 'rgba(108,99,255,0.4)',
          color:       listening ? '#ef4444' : '#a78bfa'
        }}>
          {listening ? '🔴 Listening... speak now' : '🎤 Speak your dream'}
        </button>

        {/* Text area */}
        <div style={styles.textareaWrap}>
          <textarea
            placeholder="Describe your dream in detail... What happened? Who was there? How did it feel?"
            value={content}
            onChange={e => {
              if (e.target.value.length <= MAX_CHARS) {
                setContent(e.target.value);
              }
            }}
            style={styles.textarea}
          />

          {/* Character counter */}
          <div style={styles.charCountWrap}>
            {/* Progress bar */}
            <div style={styles.charBarBg}>
              <div style={{
                ...styles.charBar,
                width:      `${charsPercent}%`,
                background: charsColor
              }} />
            </div>
            <span style={{ ...styles.charCount, color: charsColor }}>
              {charsLeft} characters left
            </span>
          </div>
        </div>

        {/* Mood selector */}
        <p style={styles.label}>How was it?</p>
        <div style={styles.moodRow}>
          {moods.map(m => (
            <button
              key={m.name}
              onClick={() => setMood(m.name)}
              style={{
                ...styles.moodBtn,
                background:  mood === m.name ? 'rgba(108,99,255,0.3)' : 'rgba(255,255,255,0.05)',
                border:      mood === m.name ? '1px solid rgba(108,99,255,0.6)' : '1px solid rgba(255,255,255,0.1)',
                color:       mood === m.name ? '#a78bfa' : '#a0a0b0',
                transform:   mood === m.name ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              {m.emoji} {m.name}
            </button>
          ))}
        </div>

        {/* Tags */}
        <div style={styles.fieldWrap}>
          <p style={styles.label}>Dream Tags</p>
          <input
            placeholder="flying, ocean, school, ghost... (comma separated)"
            value={tags}
            onChange={e => setTags(e.target.value)}
            style={styles.input}
          />
          <p style={styles.fieldHint}>
            🌀 Tags help find your Dream Connections — people who dreamed the same things!
          </p>
        </div>

        {/* Media upload */}
        <div style={styles.imageBox}>
          <label style={styles.imageLabel}>
            📸 Add image / 🎥 video
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </label>

          {preview && (
            <div style={styles.previewBox}>
              {isVideo ? (
                <video src={preview} style={styles.previewImg} controls />
              ) : (
                <img src={preview} alt="preview" style={styles.previewImg} />
              )}
              <button
                onClick={() => { setImage(null); setPreview(null); setIsVideo(false); }}
                style={styles.removeBtn}
              >✕</button>
            </div>
          )}
        </div>

        {/* Anonymous toggle */}
        <label style={styles.anonRow}>
          <div
            style={{
              ...styles.toggle,
              background: isAnonymous
                ? 'linear-gradient(135deg, #6c63ff, #a78bfa)'
                : 'rgba(255,255,255,0.1)'
            }}
            onClick={() => setIsAnonymous(!isAnonymous)}
          >
            <div style={{
              ...styles.toggleDot,
              transform: isAnonymous ? 'translateX(20px)' : 'translateX(2px)'
            }} />
          </div>
          <div>
            <span style={styles.anonText}>🕶️ Post anonymously</span>
            <p style={styles.anonSub}>Your name will be hidden from others</p>
          </div>
        </label>

        {/* Error message */}
        {error && (
          <div style={styles.errorBox}>
            ⚠️ {error}
          </div>
        )}

        {/* Post button */}
        <button
          onClick={handlePost}
          style={{
            ...styles.postBtn,
            opacity: loading ? 0.7 : 1
          }}
          disabled={loading || content.length === 0}
        >
          {loading ? (
            <span>⏳ Posting your dream...</span>
          ) : (
            <span>🌙 Share Dream</span>
          )}
        </button>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '16px 16px 100px'
  },
  card: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px',
    padding: '24px',
    width: '100%',
    maxWidth: '580px',
    backdropFilter: 'blur(20px)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#a78bfa',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  title: {
    color: 'white',
    fontSize: '20px',
    fontWeight: '700',
    margin: 0
  },
  voiceBtn: {
    display: 'block',
    width: '100%',
    padding: '12px',
    borderRadius: '12px',
    border: '1px solid',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '12px',
    transition: 'all 0.2s'
  },
  textareaWrap: {
    marginBottom: '20px'
  },
  textarea: {
    width: '100%',
    height: '160px',
    padding: '14px 16px',
    borderRadius: '12px 12px 0 0',
    border: '1px solid rgba(255,255,255,0.1)',
    borderBottom: 'none',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    fontSize: '15px',
    resize: 'none',
    outline: 'none',
    lineHeight: '1.6'
  },
  charCountWrap: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderTop: 'none',
    borderRadius: '0 0 12px 12px',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  charBarBg: {
    flex: 1,
    height: '4px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '2px',
    overflow: 'hidden'
  },
  charBar: {
    height: '4px',
    borderRadius: '2px',
    transition: 'width 0.2s, background 0.3s'
  },
  charCount: {
    fontSize: '12px',
    fontWeight: '600',
    flexShrink: 0
  },
  label: {
    color: '#a0a0b0',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  moodRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '20px'
  },
  moodBtn: {
    padding: '8px 14px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  fieldWrap: {
    marginBottom: '16px'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    marginBottom: '6px'
  },
  fieldHint: {
    color: '#6b7280',
    fontSize: '12px',
    margin: 0,
    lineHeight: '1.5'
  },
  imageBox: {
    marginBottom: '16px'
  },
  imageLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    background: 'rgba(255,255,255,0.05)',
    color: '#a78bfa',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    border: '1px dashed rgba(108,99,255,0.4)'
  },
  previewBox: {
    marginTop: '12px',
    position: 'relative',
    display: 'inline-block',
    width: '100%'
  },
  previewImg: {
    width: '100%',
    maxHeight: '250px',
    objectFit: 'cover',
    borderRadius: '12px',
    display: 'block'
  },
  removeBtn: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    background: 'rgba(0,0,0,0.7)',
    color: 'white',
    border: 'none',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '14px'
  },
  anonRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    cursor: 'pointer'
  },
  toggle: {
    width: '44px',
    height: '24px',
    borderRadius: '12px',
    position: 'relative',
    cursor: 'pointer',
    transition: 'all 0.3s',
    flexShrink: 0
  },
  toggleDot: {
    position: 'absolute',
    top: '2px',
    width: '20px',
    height: '20px',
    background: 'white',
    borderRadius: '50%',
    transition: 'transform 0.3s'
  },
  anonText: {
    fontSize: '14px',
    color: 'white',
    fontWeight: '600',
    display: 'block'
  },
  anonSub: {
    fontSize: '12px',
    color: '#6b7280',
    margin: '2px 0 0'
  },
  errorBox: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: '#fca5a5',
    fontSize: '14px',
    marginBottom: '16px'
  },
  postBtn: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }
};

export default CreateDream;