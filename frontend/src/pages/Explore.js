import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DreamCard from '../components/DreamCard';

const MOODS = [
  { name: 'all',      emoji: '🌙' },
  { name: 'happy',    emoji: '😊' },
  { name: 'scary',    emoji: '😱' },
  { name: 'weird',    emoji: '🤯' },
  { name: 'neutral',  emoji: '😶' },
  { name: 'romantic', emoji: '💕' },
  { name: 'lucid',    emoji: '✨' }
];

function Explore() {
  const [dreams, setDreams]         = useState([]);
  const [trending, setTrending]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeMood, setActiveMood] = useState('all');
  const [activeTag, setActiveTag]   = useState('');
  const [activeTab, setActiveTab]   = useState('explore');
  const [searchQ, setSearchQ]       = useState('');
  const [loading, setLoading]       = useState(false);

  useEffect(() => {
    loadCategories();
    loadDreams();
    loadTrending();
  }, []);

  useEffect(() => {
    loadDreams();
  }, [activeMood, activeTag]);

  const loadDreams = async () => {
    setLoading(true);
    const params = [];
    if (activeMood && activeMood !== 'all') params.push(`mood=${activeMood}`);
    if (activeTag) params.push(`category=${activeTag}`);
    const query = params.length > 0 ? `?${params.join('&')}` : '';
    const res   = await axios.get(`http://127.0.0.1:5000/dream/explore${query}`);
    setDreams(res.data);
    setLoading(false);
  };

  const loadTrending = async () => {
    const res = await axios.get('http://127.0.0.1:5000/dream/trending');
    setTrending(res.data);
  };

  const loadCategories = async () => {
    const res = await axios.get('http://127.0.0.1:5000/dream/categories');
    setCategories(res.data);
  };

  const handleSearch = async () => {
    if (!searchQ.trim()) return;
    setLoading(true);
    const res = await axios.get(`http://127.0.0.1:5000/dream/search?q=${searchQ}`);
    setDreams(res.data);
    setActiveTab('explore');
    setLoading(false);
  };

  const displayDreams = activeTab === 'trending' ? trending : dreams;

  return (
    <div style={styles.container}>

      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.title}>🔭 Explore Dreams</h1>
        <p style={styles.subtitle}>Discover dreams from around the world</p>
      </div>

      {/* Search bar */}
      <div style={styles.searchRow}>
        <input
          placeholder="Search dreams..."
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          style={styles.searchInput}
        />
        <button onClick={handleSearch} style={styles.searchBtn}>Search</button>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          onClick={() => setActiveTab('explore')}
          style={{
            ...styles.tab,
            background:  activeTab === 'explore' ? 'rgba(108,99,255,0.3)' : 'transparent',
            color:       activeTab === 'explore' ? '#a78bfa' : '#6b7280',
            borderColor: activeTab === 'explore' ? 'rgba(108,99,255,0.5)' : 'transparent'
          }}
        >
          🔭 Explore
        </button>
        <button
          onClick={() => setActiveTab('trending')}
          style={{
            ...styles.tab,
            background:  activeTab === 'trending' ? 'rgba(245,158,11,0.2)' : 'transparent',
            color:       activeTab === 'trending' ? '#f59e0b' : '#6b7280',
            borderColor: activeTab === 'trending' ? 'rgba(245,158,11,0.4)' : 'transparent'
          }}
        >
          🔥 Trending
        </button>
      </div>

      {/* Mood filters */}
      {activeTab === 'explore' && (
        <>
          <div style={styles.filterRow}>
            {MOODS.map(m => (
              <button
                key={m.name}
                onClick={() => { setActiveMood(m.name); setActiveTag(''); }}
                style={{
                  ...styles.filterBtn,
                  background:  activeMood === m.name && !activeTag
                    ? 'rgba(108,99,255,0.3)' : 'rgba(255,255,255,0.05)',
                  color:       activeMood === m.name && !activeTag
                    ? '#a78bfa' : '#a0a0b0',
                  borderColor: activeMood === m.name && !activeTag
                    ? 'rgba(108,99,255,0.5)' : 'rgba(255,255,255,0.1)'
                }}
              >
                {m.emoji} {m.name}
              </button>
            ))}
          </div>

          {/* Categories / Tags */}
          {categories.length > 0 && (
            <div style={styles.categoriesBox}>
              <p style={styles.categoriesTitle}>🏷️ Categories</p>
              <div style={styles.tagsRow}>
                {categories.map(c => (
                  <button
                    key={c.tag}
                    onClick={() => { setActiveTag(c.tag); setActiveMood('all'); }}
                    style={{
                      ...styles.tagBtn,
                      background:  activeTag === c.tag
                        ? 'rgba(108,99,255,0.3)' : 'rgba(255,255,255,0.05)',
                      color:       activeTag === c.tag ? '#a78bfa' : '#a0a0b0',
                      borderColor: activeTag === c.tag
                        ? 'rgba(108,99,255,0.5)' : 'rgba(255,255,255,0.08)'
                    }}
                  >
                    #{c.tag}
                    <span style={styles.tagCount}>{c.count}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Trending badge */}
      {activeTab === 'trending' && (
        <div style={styles.trendingBanner}>
          🔥 Most liked dreams this week
        </div>
      )}

      {/* Dreams list */}
      {loading ? (
        <p style={styles.loading}>Loading dreams...</p>
      ) : displayDreams.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyIcon}>🌙</p>
          <p style={styles.emptyText}>No dreams found</p>
          <p style={styles.emptySub}>Try a different filter or search</p>
        </div>
      ) : (
        displayDreams.map(dream => (
          <DreamCard key={dream.id} dream={dream} onLike={loadDreams} />
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
    marginBottom: '24px',
    padding: '16px 0'
  },
  title: {
    color: 'white',
    fontSize: '28px',
    fontWeight: '800',
    marginBottom: '6px'
  },
  subtitle: {
    color: '#6b7280',
    fontSize: '14px'
  },
  searchRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  searchInput: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    fontSize: '14px',
    outline: 'none'
  },
  searchBtn: {
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px'
  },
  tab: {
    padding: '10px 20px',
    borderRadius: '20px',
    border: '1px solid',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s'
  },
  filterRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px'
  },
  filterBtn: {
    padding: '7px 14px',
    borderRadius: '20px',
    border: '1px solid',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  categoriesBox: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '20px'
  },
  categoriesTitle: {
    color: '#a0a0b0',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '12px'
  },
  tagsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  tagBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '20px',
    border: '1px solid',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  tagCount: {
    background: 'rgba(255,255,255,0.1)',
    padding: '1px 6px',
    borderRadius: '10px',
    fontSize: '11px'
  },
  trendingBanner: {
    background: 'rgba(245,158,11,0.1)',
    border: '1px solid rgba(245,158,11,0.3)',
    borderRadius: '12px',
    padding: '10px 16px',
    color: '#f59e0b',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '20px',
    textAlign: 'center'
  },
  loading: {
    textAlign: 'center',
    color: '#6c63ff',
    padding: '40px',
    fontSize: '14px'
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
    color: 'white',
    fontSize: '18px',
    fontWeight: '600'
  },
  emptySub: {
    color: '#6b7280',
    fontSize: '13px',
    marginTop: '6px'
  }
};

export default Explore;