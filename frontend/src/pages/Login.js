import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://127.0.0.1:5000/login', {
        username,
        password
      });
      localStorage.setItem('user_id', res.data.user_id);
      localStorage.setItem('username', res.data.username);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🌙 Login to Dream Share</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={styles.input}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={styles.input}
      />

      {error && <p style={styles.error}>{error}</p>}

      <button onClick={handleLogin} style={styles.btn}>Login</button>

      <p style={styles.bottom}>
        Don't have an account?{' '}
        <a href="/register" style={styles.link}>Register here</a>
      </p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '400px',
    margin: '80px auto',
    padding: '32px',
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  title: {
    textAlign: 'center',
    marginBottom: '24px',
    color: '#1a1a2e'
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '15px'
  },
  btn: {
    width: '100%',
    padding: '12px',
    background: '#6c63ff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '8px'
  },
  error: {
    color: 'red',
    fontSize: '13px',
    marginTop: '4px'
  },
  bottom: {
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '13px',
    color: '#888'
  },
  link: {
    color: '#6c63ff'
  }
};

export default Login;