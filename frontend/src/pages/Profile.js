import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Profile() {
  const { userId }            = useParams();
  const [profile, setProfile] = useState(null);
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/profile/${userId}`)
         .then(res => setProfile(res.data));
    axios.get(`http://127.0.0.1:5000/insights/${userId}`)
         .then(res => setInsights(res.data));
  }, [userId]);

  if (!profile) return <p style={{ padding: '40px', textAlign: 'center' }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.avatar}>
          {profile.username[0].toUpperCase()}
        </div>
        <div>
          <h2 style={{ margin: 0 }}>@{profile.username}</h2>
          <p style={{ color: '#888', margin: '4px 0' }}>{profile.bio || 'No bio yet'}</p>

          <div style={styles.statsRow}>
            <div style={styles.stat}>
              <strong>{profile.post_count}</strong>
              <span>Dreams</span>
            </div>
            <div style={styles.stat}>
              <strong>{profile.followers}</strong>
              <span>Followers</span>
            </div>
            <div style={styles.stat}>
              <strong>{profile.following}</strong>
              <span>Following</span>
            </div>
            <div style={styles.streak}>
              🔥 {profile.streak} day streak
            </div>
          </div>
        </div>
      </div>

      {insights.length > 0 && (
        <div style={styles.insights}>
          <h3 style={{ marginBottom: '16px' }}>📊 Dream Themes</h3>
          {insights.map(i => (
            <div key={i.tag} style={styles.insightRow}>
              <span style={styles.tag}>{i.tag}</span>
              <div style={styles.barBg}>
                <div style={{
                  ...styles.bar,
                  width: `${Math.min(i.count * 20, 100)}%`
                }} />
              </div>
              <span style={styles.count}>{i.count}x</span>
            </div>
          ))}
        </div>
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
  header: {
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start',
    marginBottom: '32px',
    background: '#fff',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
  },
  avatar: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: '#6c63ff',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: 'bold',
    flexShrink: 0
  },
  statsRow: {
    display: 'flex',
    gap: '16px',
    marginTop: '12px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '13px',
    color: '#555'
  },
  streak: {
    background: '#fff3e0',
    color: '#e65100',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600'
  },
  insights: {
    background: '#fff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
  },
  insightRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px'
  },
  tag: {
    minWidth: '80px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#6c63ff'
  },
  barBg: {
    flex: 1,
    background: '#e0e0ff',
    borderRadius: '4px',
    height: '8px'
  },
  bar: {
    background: '#6c63ff',
    height: '8px',
    borderRadius: '4px',
    transition: 'width 0.5s'
  },
  count: {
    fontSize: '12px',
    color: '#888',
    minWidth: '24px'
  }
};

export default Profile;