import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Search() {
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const res = await axios.get(`http://127.0.0.1:5000/search?q=${query}`);
    setResults(res.data);
    setSearched(true);
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h2 style={styles.title}>🔍 Find Dreamers</h2>
        <p style={styles.subtitle}>Discover people who share their dreams</p>
      </div>

      <div style={styles.searchBox}>
        <input
          placeholder="Search by username..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.btn}>
          {loading ? '...' : 'Search'}
        </button>
      </div>

      {searched && results.length === 0 && (
        <div style={styles.empty}>
          <p style={styles.emptyIcon}>🔍</p>
          <p style={styles.emptyText}>No users found for "{query}"</p>
        </div>
      )}

      {results.map(user => (
        <div
          key={user.id}
          style={styles.userCard}
          onClick={() => navigate(`/profile/${user.id}`)}
        >
          <div style={styles.avatar}>
            {user.username[0].toUpperCase()}
          </div>
          <div style={styles.info}>
            <p style={styles.username}>@{user.username}</p>
            <p style={styles.bio}>{user.bio || 'No bio yet'}</p>
          </div>
          <span style={styles.arrow}>→</span>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '32px 16px'
  },
  hero: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  title: {
    color: 'white',
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '6px'
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '14px'
  },
  searchBox: {
    display: 'flex',
    gap: '10px',
    marginBottom: '24px'
  },
  input: {
    flex: 1,
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    fontSize: '15px',
    outline: 'none'
  },
  btn: {
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600'
  },
  empty: {
    textAlign: 'center',
    padding: '60px 0'
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '12px'
  },
  emptyText: {
    color: '#6b7280',
    fontSize: '15px'
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '16px',
    borderRadius: '16px',
    marginBottom: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backdropFilter: 'blur(10px)'
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '700',
    flexShrink: 0
  },
  info: {
    flex: 1
  },
  username: {
    fontWeight: '600',
    color: '#a78bfa',
    margin: 0,
    fontSize: '15px'
  },
  bio: {
    color: '#6b7280',
    margin: '3px 0 0',
    fontSize: '13px'
  },
  arrow: {
    color: '#6c63ff',
    fontSize: '18px'
  }
};

export default Search;