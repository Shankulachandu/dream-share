import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:5000/login', { username, password });
      localStorage.setItem('user_id', res.data.user_id);
      localStorage.setItem('username', res.data.username);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>🌙</div>
        <h2 style={styles.title}>Welcome back</h2>
        <p style={styles.subtitle}>Sign in to Dream Share</p>

        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={styles.input}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}

        <button onClick={handleLogin} style={styles.btn} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p style={styles.bottom}>
          Don't have an account?{' '}
          <a href="/register" style={styles.link}>Create one free</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px'
  },
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    backdropFilter: 'blur(20px)',
    textAlign: 'center'
  },
  logo: {
    fontSize: '48px',
    marginBottom: '16px'
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
    marginBottom: '28px'
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '14px 16px',
    margin: '10px 0',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    fontSize: '15px',
    outline: 'none'
  },
  btn: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px'
  },
  error: {
    color: '#ef4444',
    fontSize: '13px',
    marginTop: '8px'
  },
  bottom: {
    marginTop: '20px',
    fontSize: '13px',
    color: '#6b7280'
  },
  link: {
    color: '#a78bfa',
    fontWeight: '600'
  }
};

export default Login;