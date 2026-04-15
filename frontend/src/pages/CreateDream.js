import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateDream() {
  const [content, setContent]         = useState('');
  const [mood, setMood]               = useState('neutral');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [tags, setTags]               = useState('');
  const [listening, setListening]     = useState(false);
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

  const handlePost = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) { navigate('/login'); return; }
    if (!content.trim()) { alert('Write your dream first!'); return; }

    const tagList = tags.split(',').map(t => t.trim()).filter(t => t);

    await axios.post('http://127.0.0.1:5000/dream/create', {
      user_id: parseInt(userId),
      content,
      mood,
      is_anonymous: isAnonymous,
      tags: tagList
    });

    navigate('/');
  };

  const moods = ['happy', 'scary', 'weird', 'neutral', 'romantic', 'lucid'];

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🌙 Share Your Dream</h2>

      <button onClick={startVoice} style={styles.voiceBtn}>
        {listening ? '🔴 Listening...' : '🎤 Speak your dream'}
      </button>

      <textarea
        placeholder="Describe your dream in detail..."
        value={content}
        onChange={e => setContent(e.target.value)}
        style={styles.textarea}
      />

      <p style={styles.label}>How was it?</p>
      <div style={styles.moodRow}>
        {moods.map(m => (
          <button
            key={m}
            onClick={() => setMood(m)}
            style={{
              ...styles.moodBtn,
              background: mood === m ? '#6c63ff' : '#eee',
              color: mood === m ? 'white' : '#333'
            }}
          >
            {m}
          </button>
        ))}
      </div>

      <input
        placeholder="Tags (comma separated): flying, water, school"
        value={tags}
        onChange={e => setTags(e.target.value)}
        style={styles.input}
      />

      <label style={styles.anonRow}>
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={e => setIsAnonymous(e.target.checked)}
        />
        <span> 🕶️ Post anonymously</span>
      </label>

      <button onClick={handlePost} style={styles.postBtn}>
        Post Dream
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '560px',
    margin: '40px auto',
    padding: '32px',
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  title: {
    marginBottom: '20px',
    color: '#1a1a2e'
  },
  voiceBtn: {
    background: '#1a1a2e',
    color: 'white',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '12px',
    fontSize: '14px'
  },
  textarea: {
    width: '100%',
    height: '140px',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '15px',
    resize: 'vertical',
    marginBottom: '16px'
  },
  label: {
    marginBottom: '8px',
    fontWeight: '600',
    color: '#444'
  },
  moodRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px'
  },
  moodBtn: {
    padding: '6px 14px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px'
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    marginBottom: '12px'
  },
  anonRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  postBtn: {
    background: '#6c63ff',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    width: '100%'
  }
};

export default CreateDream;