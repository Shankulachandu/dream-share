import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DreamCard from '../components/DreamCard';

function Home() {
  const [dreams, setDreams]   = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDreams = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/dream/feed');
      setDreams(res.data);
    } catch (err) {
      console.error('Could not load dreams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDreams(); }, []);

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Dream Feed 🌙</h1>
        <p style={styles.heroSub}>Explore dreams from around the world</p>
      </div>

      {loading ? (
        <div style={styles.loadingBox}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Loading dreams...</p>
        </div>
      ) : dreams.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={styles.emptyIcon}>🌙</p>
          <p style={styles.emptyText}>No dreams yet.</p>
          <p style={styles.emptySub}>Be the first to share your dream!</p>
        </div>
      ) : (
        dreams.map(dream => (
          <DreamCard key={dream.id} dream={dream} onLike={fetchDreams} />
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '640px',
    margin: '0 auto',
    padding: '24px 16px'
  },
  hero: {
    textAlign: 'center',
    marginBottom: '32px',
    padding: '32px 0 16px'
  },
  heroTitle: {
    fontSize: '32px',
    fontWeight: '800',
    color: 'white',
    marginBottom: '8px'
  },
  heroSub: {
    fontSize: '15px',
    color: '#6c63ff',
    fontWeight: '500'
  },
  loadingBox: {
    textAlign: 'center',
    padding: '60px 0'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(108, 99, 255, 0.2)',
    borderTop: '3px solid #6c63ff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 16px'
  },
  loadingText: {
    color: '#6c63ff',
    fontSize: '14px'
  },
  emptyBox: {
    textAlign: 'center',
    padding: '60px 0'
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  emptyText: {
    fontSize: '18px',
    color: 'white',
    fontWeight: '600'
  },
  emptySub: {
    fontSize: '14px',
    color: '#6c63ff',
    marginTop: '8px'
  }
};

export default Home;