import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Search() {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;
    const res = await axios.get(`http://127.0.0.1:5000/search?q=${query}`);
    setResults(res.data);
    setSearched(true);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔍 Find Dreamers</h2>

      <div style={styles.searchRow}>
        <input
          placeholder="Search by username..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.btn}>
          Search
        </button>
      </div>

      {searched && results.length === 0 && (
        <p style={styles.empty}>No users found for "{query}"</p>
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
          <div>
            <p style={styles.username}>@{user.username}</p>
            <p style={styles.bio}>{user.bio || 'No bio yet'}</p>
          </div>
          <button style={styles.viewBtn}>View Profile →</button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '32px auto',
    padding: '0 16px'
  },
  title: {
    marginBottom: '24px',
    color: '#1a1a2e'
  },
  searchRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '24px'
  },
  input: {
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '15px'
  },
  btn: {
    padding: '12px 24px',
    background: '#6c63ff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600'
  },
  empty: {
    color: '#888',
    textAlign: 'center',
    marginTop: '40px'
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    background: '#fff',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    cursor: 'pointer'
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: '#6c63ff',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    flexShrink: 0
  },
  username: {
    fontWeight: '600',
    color: '#6c63ff',
    margin: 0,
    fontSize: '15px'
  },
  bio: {
    color: '#888',
    margin: '2px 0 0',
    fontSize: '13px'
  },
  viewBtn: {
    marginLeft: 'auto',
    background: 'none',
    border: '1px solid #6c63ff',
    color: '#6c63ff',
    padding: '6px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px'
  }
};

export default Search;