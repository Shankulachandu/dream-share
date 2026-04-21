import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm]       = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    if (!form.username || !form.email || !form.password) {
      setError('Please fill in all fields'); return;
    }
    setLoading(true);
    try {
      await axios.post('http://127.0.0.1:5000/register', form);
      setMessage('Account created! Redirecting...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>🌙</div>
        <h2 style={styles.title}>Join Dream Share</h2>
        <p style={styles.subtitle}>Share your dreams with the world</p>

        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="email"
          placeholder="Email address"
          type="email"
          onChange={handleChange}
          style={styles.input}
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
          onKeyDown={e => e.key === 'Enter' && handleRegister()}
          style={styles.input}
        />

        {error   && <p style={styles.error}>{error}</p>}
        {message && <p style={styles.success}>{message}</p>}

        <button onClick={handleRegister} style={styles.btn} disabled={loading}>
          {loading ? 'Creating account...' : 'Create Free Account'}
        </button>

        <p style={styles.bottom}>
          Already have an account?{' '}
          <a href="/login" style={styles.link}>Sign in</a>
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
  success: {
    color: '#10b981',
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

export default Register;