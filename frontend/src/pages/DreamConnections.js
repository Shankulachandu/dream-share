import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

const getMediaSrc = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `${API_URL}${url}`;
};

const moodEmoji = {
  happy: '😊', scary: '😱', weird: '🤯',
  neutral: '😶', romantic: '💕', lucid: '✨'
};

function DreamConnections() {
  const [connections, setConnections] = useState([]);
  const [myTags, setMyTags]           = useState([]);
  const [todayThemes, setTodayThemes] = useState([]);
  const [message, setMessage]         = useState('');
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState('connections');

  const myId     = localStorage.getItem('user_id');
  const navigate = useNavigate();

  useEffect(() => {
    if (!myId) { navigate('/login'); return; }
    loadConnections();
    loadTodayThemes();
  }, []);

  const loadConnections = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/dream/connections/${myId}`);
      setConnections(res.data.connections);
      setMyTags(res.data.my_tags || []);
      setMessage(res.data.message);
    } catch (err) {
      setMessage('Could not load connections');
    }
    setLoading(false);
  };

  const loadTodayThemes = async () => {
    try {
      const res = await axios.get(`${API_URL}/dream/themes/today`);
      setTodayThemes(res.data);
    } catch (err) {}
  };

  const maxCount = todayThemes.length > 0
    ? Math.max(...todayThemes.map(t => t.count))
    : 1;

  return (
    <div style={styles.page}>

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroIcon}>🌀</div>
        <h1 style={styles.heroTitle}>Dream Connections</h1>
        <p style={styles.heroSub}>
          Find people who dreamed the same things as you last night
        </p>
      </div>

      {/* My tags */}
      {myTags.length > 0 && (
        <div style={styles.myTagsBox}>
          <p style={styles.myTagsLabel}>🌙 Your dream themes today</p>
          <div style={styles.tagsRow}>
            {myTags.map(tag => (
              <span key={tag} style={styles.myTag}>#{tag}</span>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('connections')}
          style={{
            ...styles.tab,
            background:  activeTab === 'connections' ? 'rgba(108,99,255,0.3)' : 'rgba(255,255,255,0.05)',
            color:       activeTab === 'connections' ? '#a78bfa' : '#6b7280',
            borderColor: activeTab === 'connections' ? 'rgba(108,99,255,0.5)' : 'rgba(255,255,255,0.08)'
          }}
        >
          🌀 My Connections
          {connections.length > 0 && (
            <span style={styles.tabBadge}>{connections.length}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('world')}
          style={{
            ...styles.tab,
            background:  activeTab === 'world' ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)',
            color:       activeTab === 'world' ? '#f59e0b' : '#6b7280',
            borderColor: activeTab === 'world' ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.08)'
          }}
        >
          🌍 World Dreaming
        </button>
      </div>

      {/* CONNECTIONS TAB */}
      {activeTab === 'connections' && (
        <>
          {loading ? (
            <div style={styles.loadingBox}>
              <div style={styles.loadingSpinner}>🌀</div>
              <p style={styles.loadingText}>Searching for your dream twins...</p>
            </div>
          ) : connections.length === 0 ? (
            <div style={styles.emptyBox}>
              <p style={styles.emptyIcon}>🌙</p>
              <p style={styles.emptyTitle}>{message}</p>
              <p style={styles.emptySub}>
                Post a dream with tags like "flying, ocean, school" and we will find
                others who dreamed the same things!
              </p>
              <button
                onClick={() => navigate('/create')}
                style={styles.postDreamBtn}
              >
                + Post a Dream Now
              </button>
            </div>
          ) : (
            <>
              {/* Connection count banner */}
              <div style={styles.connectionBanner}>
                <span style={styles.connectionBannerIcon}>🌀</span>
                <p style={styles.connectionBannerText}>{message}</p>
              </div>

              {/* Connection cards */}
              {connections.map((conn, i) => (
                <div key={conn.user_id} style={styles.connectionCard}>

                  {/* Rank badge */}
                  {i === 0 && (
                    <div style={styles.topBadge}>⭐ Strongest Connection</div>
                  )}

                  {/* User info */}
                  <div style={styles.connHeader}>
                    <div style={styles.connAvatarWrap}>
                      {conn.profile_pic ? (
                        <img
                          src={getMediaSrc(conn.profile_pic)}
                          alt="profile"
                          style={styles.connAvatar}
                        />
                      ) : (
                        <div style={styles.connAvatarPlaceholder}>
                          {conn.username[0].toUpperCase()}
                        </div>
                      )}
                      <div style={styles.connGlow} />
                    </div>

                    <div style={styles.connInfo}>
                      <p style={styles.connUsername}>@{conn.username}</p>
                      <p style={styles.connSub}>
                        Dreamed about{' '}
                        <strong style={{ color: '#a78bfa' }}>
                          {conn.shared_tags.length} same thing{conn.shared_tags.length !== 1 ? 's' : ''}
                        </strong>{' '}
                        as you last night!
                      </p>
                    </div>

                    <button
                      onClick={() => navigate(`/profile/${conn.user_id}`)}
                      style={styles.viewBtn}
                    >
                      View →
                    </button>
                  </div>

                  {/* Shared tags */}
                  <div style={styles.sharedTagsBox}>
                    <p style={styles.sharedTagsLabel}>🌀 Shared dream themes:</p>
                    <div style={styles.tagsRow}>
                      {conn.shared_tags.map(tag => (
                        <span key={tag} style={styles.sharedTag}>#{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Their dream preview */}
                  <div style={styles.dreamPreview}>
                    <span style={styles.dreamPreviewMood}>
                      {moodEmoji[conn.dream.mood]} {conn.dream.mood}
                    </span>
                    <p style={styles.dreamPreviewText}>
                      "{conn.dream.content}..."
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div style={styles.connActions}>
                    <button
                      onClick={() => navigate(`/messages/${conn.user_id}`)}
                      style={styles.messageBtn}
                    >
                      💬 Send Message
                    </button>
                    <button
                      onClick={() => navigate(`/profile/${conn.user_id}`)}
                      style={styles.profileBtn}
                    >
                      👤 View Profile
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </>
      )}

      {/* WORLD DREAMING TAB */}
      {activeTab === 'world' && (
        <div>
          <div style={styles.worldHeader}>
            <p style={styles.worldTitle}>🌍 What the world dreamed about tonight</p>
            <p style={styles.worldSub}>Most common dream themes in the last 24 hours</p>
          </div>

          {todayThemes.length === 0 ? (
            <div style={styles.emptyBox}>
              <p style={styles.emptyIcon}>🌍</p>
              <p style={styles.emptyTitle}>No dream themes yet today</p>
              <p style={styles.emptySub}>Be the first to post a dream with tags!</p>
              <button
                onClick={() => navigate('/create')}
                style={styles.postDreamBtn}
              >
                + Post a Dream Now
              </button>
            </div>
          ) : (
            <>
              {todayThemes.map((theme, i) => (
                <div key={theme.tag} style={styles.themeCard}>
                  <div style={styles.themeRank}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                  </div>
                  <div style={styles.themeInfo}>
                    <p style={styles.themeTag}>#{theme.tag}</p>
                    <div style={styles.themeBarBg}>
                      <div style={{
                        ...styles.themeBar,
                        width: `${(theme.count / maxCount) * 100}%`
                      }} />
                    </div>
                  </div>
                  <div style={styles.themeCount}>
                    <p style={styles.themeCountNum}>{theme.count}</p>
                    <p style={styles.themeCountLabel}>dreamers</p>
                  </div>
                </div>
              ))}

              <div style={styles.worldFooter}>
                <p style={styles.worldFooterText}>
                  🌙 Updated every hour · Based on dreams posted today
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Refresh button */}
      <button onClick={loadConnections} style={styles.refreshBtn}>
        🔄 Refresh Connections
      </button>

    </div>
  );
}

const styles = {
  page: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '16px 16px 100px'
  },
  hero: {
    textAlign: 'center',
    padding: '24px 0 16px'
  },
  heroIcon: {
    fontSize: '56px',
    marginBottom: '12px',
    animation: 'spin 3s linear infinite'
  },
  heroTitle: {
    color: 'white',
    fontSize: '28px',
    fontWeight: '800',
    marginBottom: '8px',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa, #f59e0b)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  heroSub: {
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '1.5',
    maxWidth: '320px',
    margin: '0 auto'
  },
  myTagsBox: {
    background: 'rgba(108,99,255,0.1)',
    border: '1px solid rgba(108,99,255,0.2)',
    borderRadius: '16px',
    padding: '14px 16px',
    marginBottom: '16px'
  },
  myTagsLabel: {
    color: '#a78bfa',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  tagsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  myTag: {
    background: 'rgba(108,99,255,0.2)',
    color: '#a78bfa',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    border: '1px solid rgba(108,99,255,0.3)'
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px'
  },
  tab: {
    flex: 1,
    padding: '10px 16px',
    borderRadius: '20px',
    border: '1px solid',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
  },
  tabBadge: {
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: 'white',
    fontSize: '10px',
    fontWeight: '700',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingBox: {
    textAlign: 'center',
    padding: '60px 0'
  },
  loadingSpinner: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  loadingText: {
    color: '#a78bfa',
    fontSize: '15px',
    fontWeight: '500'
  },
  emptyBox: {
    textAlign: 'center',
    padding: '40px 20px'
  },
  emptyIcon: {
    fontSize: '56px',
    marginBottom: '16px'
  },
  emptyTitle: {
    color: 'white',
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '10px'
  },
  emptySub: {
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '24px',
    maxWidth: '300px',
    margin: '0 auto 24px'
  },
  postDreamBtn: {
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '700'
  },
  connectionBanner: {
    background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(167,139,250,0.1))',
    border: '1px solid rgba(108,99,255,0.3)',
    borderRadius: '16px',
    padding: '14px 16px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  connectionBannerIcon: {
    fontSize: '28px',
    flexShrink: 0
  },
  connectionBannerText: {
    color: '#a78bfa',
    fontSize: '15px',
    fontWeight: '600',
    margin: 0
  },
  connectionCard: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(108,99,255,0.2)',
    borderRadius: '20px',
    padding: '20px',
    marginBottom: '16px',
    backdropFilter: 'blur(10px)',
    position: 'relative',
    overflow: 'hidden'
  },
  topBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
    color: 'white',
    fontSize: '11px',
    fontWeight: '700',
    padding: '3px 10px',
    borderRadius: '20px'
  },
  connHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px'
  },
  connAvatarWrap: {
    position: 'relative',
    flexShrink: 0
  },
  connAvatar: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid rgba(108,99,255,0.5)'
  },
  connAvatarPlaceholder: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '20px',
    fontWeight: '700',
    border: '2px solid rgba(108,99,255,0.5)'
  },
  connGlow: {
    position: 'absolute',
    top: '-4px',
    left: '-4px',
    right: '-4px',
    bottom: '-4px',
    borderRadius: '50%',
    background: 'transparent',
    border: '2px solid rgba(108,99,255,0.4)',
    animation: 'pulse 2s infinite'
  },
  connInfo: {
    flex: 1
  },
  connUsername: {
    color: 'white',
    fontWeight: '700',
    fontSize: '16px',
    margin: '0 0 4px'
  },
  connSub: {
    color: '#6b7280',
    fontSize: '13px',
    margin: 0
  },
  viewBtn: {
    background: 'rgba(108,99,255,0.15)',
    color: '#a78bfa',
    border: '1px solid rgba(108,99,255,0.3)',
    padding: '8px 14px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    flexShrink: 0
  },
  sharedTagsBox: {
    background: 'rgba(108,99,255,0.08)',
    borderRadius: '12px',
    padding: '12px',
    marginBottom: '12px'
  },
  sharedTagsLabel: {
    color: '#a78bfa',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  sharedTag: {
    background: 'rgba(108,99,255,0.25)',
    color: '#c4b5fd',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid rgba(108,99,255,0.4)'
  },
  dreamPreview: {
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '12px',
    padding: '12px',
    marginBottom: '14px'
  },
  dreamPreviewMood: {
    fontSize: '12px',
    color: '#6b7280',
    display: 'block',
    marginBottom: '4px'
  },
  dreamPreviewText: {
    color: '#d0d0d0',
    fontSize: '13px',
    lineHeight: '1.5',
    margin: 0,
    fontStyle: 'italic'
  },
  connActions: {
    display: 'flex',
    gap: '10px'
  },
  messageBtn: {
    flex: 1,
    padding: '10px',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600'
  },
  profileBtn: {
    flex: 1,
    padding: '10px',
    background: 'rgba(255,255,255,0.05)',
    color: '#a0a0b0',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600'
  },
  worldHeader: {
    marginBottom: '20px'
  },
  worldTitle: {
    color: 'white',
    fontSize: '18px',
    fontWeight: '700',
    margin: '0 0 4px'
  },
  worldSub: {
    color: '#6b7280',
    fontSize: '13px',
    margin: 0
  },
  themeCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '10px',
    backdropFilter: 'blur(10px)'
  },
  themeRank: {
    fontSize: '20px',
    width: '32px',
    textAlign: 'center',
    flexShrink: 0
  },
  themeInfo: {
    flex: 1
  },
  themeTag: {
    color: '#a78bfa',
    fontWeight: '700',
    fontSize: '15px',
    margin: '0 0 8px'
  },
  themeBarBg: {
    background: 'rgba(108,99,255,0.15)',
    borderRadius: '4px',
    height: '6px',
    overflow: 'hidden'
  },
  themeBar: {
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    height: '6px',
    borderRadius: '4px',
    transition: 'width 0.8s ease'
  },
  themeCount: {
    textAlign: 'center',
    flexShrink: 0
  },
  themeCountNum: {
    color: 'white',
    fontSize: '20px',
    fontWeight: '800',
    margin: 0
  },
  themeCountLabel: {
    color: '#6b7280',
    fontSize: '10px',
    margin: 0
  },
  worldFooter: {
    textAlign: 'center',
    padding: '16px 0'
  },
  worldFooterText: {
    color: '#4b5563',
    fontSize: '12px'
  },
  refreshBtn: {
    width: '100%',
    padding: '14px',
    background: 'rgba(255,255,255,0.05)',
    color: '#6b7280',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    marginTop: '8px'
  }
};

export default DreamConnections;