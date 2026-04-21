import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Use Chrome for voice input.'); return; }
    const rec = new SR();
    rec.lang = 'en-US';
    rec.start();
    setListening(true);
    rec.onresult = (e) => {
      setContent(p => p + ' ' + e.results[0][0].transcript);
      setListening(false);
    };
    rec.onerror = () => setListening(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const video = file.type.startsWith('video/');
      setIsVideo(video);
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlePost = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) { navigate('/login'); return; }
    if (!content.trim()) { alert('Write your dream first!'); return; }
    setLoading(true);

    const formData = new FormData();
    formData.append('user_id',      userId);
    formData.append('content',      content);
    formData.append('mood',         mood);
    formData.append('is_anonymous', isAnonymous);
    formData.append('tags',         tags);
    if (image) {
      if (isVideo) {
        formData.append('video', image);
      } else {
        formData.append('image', image);
      }
    }

    await axios.post('http://127.0.0.1:5000/dream/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    setLoading(false);
    navigate('/');
  };

  const moods = [
    { name: 'happy',    emoji: '😊' },
    { name: 'scary',    emoji: '😱' },
    { name: 'weird',    emoji: '🤯' },
    { name: 'neutral',  emoji: '😶' },
    { name: 'romantic', emoji: '💕' },
    { name: 'lucid',    emoji: '✨' }
  ];

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>🌙 Share Your Dream</h2>
        <p style={styles.subtitle}>What did you dream about last night?</p>

        {/* Voice button */}
        <button onClick={startVoice} style={{
          ...styles.voiceBtn,
          background:   listening ? 'rgba(239, 68, 68, 0.2)' : 'rgba(108, 99, 255, 0.15)',
          borderColor:  listening ? '#ef4444' : 'rgba(108, 99, 255, 0.4)',
          color:        listening ? '#ef4444' : '#a78bfa'
        }}>
          {listening ? '🔴 Listening... speak now' : '🎤 Speak your dream'}
        </button>

        {/* Text area */}
        <textarea
          placeholder="Describe your dream in detail..."
          value={content}
          onChange={e => setContent(e.target.value)}
          style={styles.textarea}
        />

        {/* Mood selector */}
        <p style={styles.label}>How was it?</p>
        <div style={styles.moodRow}>
          {moods.map(m => (
            <button
              key={m.name}
              onClick={() => setMood(m.name)}
              style={{
                ...styles.moodBtn,
                background: mood === m.name
                  ? 'rgba(108, 99, 255, 0.3)'
                  : 'rgba(255,255,255,0.05)',
                border: mood === m.name
                  ? '1px solid rgba(108, 99, 255, 0.6)'
                  : '1px solid rgba(255,255,255,0.1)',
                color: mood === m.name ? '#a78bfa' : '#a0a0b0'
              }}
            >
              {m.emoji} {m.name}
            </button>
          ))}
        </div>

        {/* Tags */}
        <input
          placeholder="Tags: flying, water, school (comma separated)"
          value={tags}
          onChange={e => setTags(e.target.value)}
          style={styles.input}
        />

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
          <span style={styles.anonText}>🕶️ Post anonymously</span>
        </label>

        {/* Post button */}
        <button onClick={handlePost} style={styles.postBtn} disabled={loading}>
          {loading ? 'Posting...' : '🌙 Post Dream'}
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
    padding: '32px 16px'
  },
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    padding: '32px',
    width: '100%',
    maxWidth: '580px',
    backdropFilter: 'blur(20px)'
  },
  title: {
    color: 'white',
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '6px'
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '14px',
    marginBottom: '24px'
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
  textarea: {
    width: '100%',
    height: '140px',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    fontSize: '15px',
    resize: 'vertical',
    marginBottom: '20px',
    outline: 'none',
    lineHeight: '1.6'
  },
  label: {
    color: '#a0a0b0',
    fontSize: '13px',
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
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    fontSize: '14px',
    marginBottom: '16px',
    outline: 'none'
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
    border: '1px dashed rgba(108, 99, 255, 0.4)'
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
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  anonRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
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
    color: '#a0a0b0',
    fontWeight: '500'
  },
  postBtn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer'
  }
};

export default CreateDream;