import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DreamCard from '../components/DreamCard';

function Home() {
  const [dreams, setDreams] = useState([]);
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

  useEffect(() => {
    fetchDreams();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🌙 Dream Feed</h2>

      {loading ? (
        <p>Loading dreams...</p>
      ) : dreams.length === 0 ? (
        <p style={styles.empty}>No dreams yet. Be the first to post!</p>
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
    maxWidth: '600px',
    margin: '32px auto',
    padding: '0 16px'
  },
  heading: {
    marginBottom: '24px',
    color: '#1a1a2e'
  },
  empty: {
    color: '#888',
    textAlign: 'center',
    marginTop: '40px'
  }
};

export default Home;