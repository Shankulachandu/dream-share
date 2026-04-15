import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm]       = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/register', form);
      setMessage('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🌙 Join Dream Share</h2>

      <input
        name="username"
        placeholder="Username"
        onChange={handleChange}
        style={styles.input}
      />
      <input
        name="email"
        placeholder="Email"
        type="email"
        onChange={handleChange}
        style={styles.input}
      />
      <input
        name="password"
        placeholder="Password"
        type="password"
        onChange={handleChange}
        style={styles.input}
      />

      {message && <p style={styles.message}>{message}</p>}

      <button onClick={handleRegister} style={styles.btn}>
        Create Account
      </button>

      <p style={styles.bottom}>
        Already have an account?{' '}
        <a href="/login" style={styles.link}>Login here</a>
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
  message: {
    color: '#6c63ff',
    fontSize: '13px',
    marginTop: '4px',
    textAlign: 'center'
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

export default Register;