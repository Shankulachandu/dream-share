import React, { useEffect, useState } from 'react';

function SkeletonCard() {
  const [opacity, setOpacity] = useState(0.4);

  useEffect(() => {
    let increasing = true;
    const interval = setInterval(() => {
      setOpacity(prev => {
        if (prev >= 0.8) increasing = false;
        if (prev <= 0.3) increasing = true;
        return increasing ? prev + 0.05 : prev - 0.05;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const skeletonBg = `rgba(255,255,255,${opacity})`;

  return (
    <div style={styles.card}>
      <div style={styles.moodBar} />
      <div style={styles.header}>
        <div style={{ ...styles.avatar, background: skeletonBg }} />
        <div style={styles.headerInfo}>
          <div style={{ ...styles.line, width: '120px', background: skeletonBg }} />
          <div style={{ ...styles.line, width: '80px', marginTop: '6px', background: skeletonBg }} />
        </div>
      </div>
      <div style={styles.content}>
        <div style={{ ...styles.line, width: '100%', background: skeletonBg }} />
        <div style={{ ...styles.line, width: '90%', marginTop: '8px', background: skeletonBg }} />
        <div style={{ ...styles.line, width: '75%', marginTop: '8px', background: skeletonBg }} />
      </div>
      <div style={styles.footer}>
        <div style={{ ...styles.line, width: '60px', height: '24px', borderRadius: '12px', background: skeletonBg }} />
        <div style={{ ...styles.line, width: '60px', height: '24px', borderRadius: '12px', background: skeletonBg }} />
        <div style={{ ...styles.line, width: '100px', height: '24px', borderRadius: '12px', marginLeft: 'auto', background: skeletonBg }} />
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    marginBottom: '20px',
    overflow: 'hidden'
  },
  moodBar: {
    height: '3px',
    width: '100%',
    background: 'rgba(255,255,255,0.1)'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px'
  },
  avatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    flexShrink: 0
  },
  headerInfo: { flex: 1 },
  line: {
    height: '12px',
    borderRadius: '6px'
  },
  content: {
    padding: '0 16px 16px'
  },
  footer: {
    display: 'flex',
    gap: '8px',
    padding: '12px 16px',
    borderTop: '1px solid rgba(255,255,255,0.04)',
    alignItems: 'center'
  }
};

export default SkeletonCard;