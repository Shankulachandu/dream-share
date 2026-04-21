import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import DreamCard from '../components/DreamCard';

function Profile() {
  const { userId }                    = useParams();
  const [profile, setProfile]         = useState(null);
  const [insights, setInsights]       = useState([]);
  const [dreams, setDreams]           = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate                      = useNavigate();

  const myId        = localStorage.getItem('user_id');
  const isMyProfile = myId === userId;

  useEffect(() => { loadProfile(); }, [userId]);

  const loadProfile = async () => {
    const [profileRes, insightsRes, dreamsRes] = await Promise.all([
      axios.get(`http://127.0.0.1:5000/profile/${userId}`),
      axios.get(`http://127.0.0.1:5000/insights/${userId}`),
      axios.get(`http://127.0.0.1:5000/profile/${userId}/dreams`)
    ]);
    setProfile(profileRes.data);
    setInsights(insightsRes.data);
    setDreams(dreamsRes.data);
    if (myId && !isMyProfile) {
      const followRes = await axios.get(
        `http://127.0.0.1:5000/is_following?follower_id=${myId}&following_id=${userId}`
      );
      setIsFollowing(followRes.data.is_following);
    }
  };

  const handleFollow = async () => {
    if (!myId) { navigate('/login'); return; }
    if (isFollowing) {
      await axios.post('http://127.0.0.1:5000/unfollow', {
        follower_id: parseInt(myId), following_id: parseInt(userId)
      });
      setIsFollowing(false);
    } else {
      await axios.post('http://127.0.0.1:5000/follow', {
        follower_id: parseInt(myId), following_id: parseInt(userId)
      });
      setIsFollowing(true);
    }
    loadProfile();
  };

  if (!profile) return (
    <div style={styles.loading}>
      <p>Loading profile...</p>
    </div>
  );

  return (
    <div style={styles.container}>

      {/* Profile header */}
      <div style={styles.header}>
        <div style={styles.avatarWrap}>
          <div style={styles.avatar}>
            {profile.username[0].toUpperCase()}
          </div>
          <div style={styles.streakBadge}>
            🔥 {profile.streak}
          </div>
        </div>

        <div style={styles.headerInfo}>
          <h2 style={styles.username}>@{profile.username}</h2>
          <p style={styles.bio}>{profile.bio || 'No bio yet'}</p>

          <div style={styles.statsRow}>
            <div style={styles.stat}>
              <strong style={styles.statNum}>{profile.post_count}</strong>
              <span style={styles.statLabel}>Dreams</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.stat}>
              <strong style={styles.statNum}>{profile.followers}</strong>
              <span style={styles.statLabel}>Followers</span>
            </div>
            <div style={styles.statDivider} />
            <div style={styles.stat}>
              <strong style={styles.statNum}>{profile.following}</strong>
              <span style={styles.statLabel}>Following</span>
            </div>
          </div>

          {!isMyProfile && (
            <div style={styles.btnRow}>
              <button
                onClick={handleFollow}
                style={isFollowing ? styles.unfollowBtn : styles.followBtn}
              >
                {isFollowing ? 'Unfollow' : '+ Follow'}
              </button>
              <button
                onClick={() => navigate(`/messages/${userId}`)}
                style={styles.msgBtn}
              >
                💬 Message
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dream Insights */}
      {insights.length > 0 && (
        <div style={styles.insightsBox}>
          <h3 style={styles.sectionTitle}>📊 Dream Themes</h3>
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

      {/* Dreams */}
      <h3 style={styles.sectionTitle}>🌙 Dreams</h3>
      {dreams.length === 0 ? (
        <p style={styles.noDreams}>No dreams posted yet.</p>
      ) : (
        dreams.map(d => (
          <DreamCard key={d.id} dream={d} onLike={loadProfile} />
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '32px 16px'
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    color: '#6b7280'
  },
  header: {
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '24px',
    marginBottom: '24px',
    backdropFilter: 'blur(10px)'
  },
  avatarWrap: {
    position: 'relative',
    flexShrink: 0
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    fontWeight: '700',
    border: '3px solid rgba(108, 99, 255, 0.4)'
  },
  streakBadge: {
    position: 'absolute',
    bottom: '-4px',
    right: '-4px',
    background: '#f59e0b',
    color: 'white',
    fontSize: '11px',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '10px',
    border: '2px solid #0f0f1a'
  },
  headerInfo: {
    flex: 1
  },
  username: {
    color: 'white',
    fontSize: '20px',
    fontWeight: '700',
    margin: '0 0 4px'
  },
  bio: {
    color: '#6b7280',
    fontSize: '13px',
    margin: '0 0 16px'
  },
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px'
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  statNum: {
    color: 'white',
    fontSize: '18px',
    fontWeight: '700'
  },
  statLabel: {
    color: '#6b7280',
    fontSize: '11px',
    marginTop: '2px'
  },
  statDivider: {
    width: '1px',
    height: '30px',
    background: 'rgba(255,255,255,0.1)'
  },
  btnRow: {
    display: 'flex',
    gap: '10px'
  },
  followBtn: {
    padding: '8px 20px',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  unfollowBtn: {
    padding: '8px 20px',
    background: 'rgba(255,255,255,0.05)',
    color: '#a0a0b0',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  msgBtn: {
    padding: '8px 20px',
    background: 'rgba(108, 99, 255, 0.15)',
    color: '#a78bfa',
    border: '1px solid rgba(108, 99, 255, 0.3)',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  insightsBox: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '24px',
    marginBottom: '24px',
    backdropFilter: 'blur(10px)'
  },
  sectionTitle: {
    color: 'white',
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '16px'
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
    color: '#a78bfa'
  },
  barBg: {
    flex: 1,
    background: 'rgba(108, 99, 255, 0.15)',
    borderRadius: '4px',
    height: '8px'
  },
  bar: {
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    height: '8px',
    borderRadius: '4px',
    transition: 'width 0.5s'
  },
  count: {
    fontSize: '12px',
    color: '#6b7280',
    minWidth: '24px'
  },
  noDreams: {
    color: '#6b7280',
    textAlign: 'center',
    padding: '40px 0'
  }
};

export default Profile;