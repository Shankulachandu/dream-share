import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate          = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // If already logged in go to feed
    const userId = localStorage.getItem('user_id');
    if (userId) { navigate('/'); return; }
    setTimeout(() => setVisible(true), 100);
  }, []);

  const features = [
    {
      icon: '🌙',
      title: 'Share Your Dreams',
      desc: 'Post your sleep dreams every morning. Text, images, videos — capture every detail.'
    },
    {
      icon: '🌀',
      title: 'Dream Connections',
      desc: 'Our AI finds people who dreamed about the same things as you. Meet your Dream Twins!'
    },
    {
      icon: '🤖',
      title: 'AI Interpretation',
      desc: 'Get instant AI-powered analysis of what your dreams might mean.'
    },
    {
      icon: '🕶️',
      title: 'Anonymous Posting',
      desc: 'Share your most private dreams anonymously. Only you know it was you.'
    },
    {
      icon: '📸',
      title: 'Stories',
      desc: '24-hour dream stories. Share a photo or video from your dream world.'
    },
    {
      icon: '🔥',
      title: 'Dream Streaks',
      desc: 'Build a daily dream journaling habit. Keep your streak alive!'
    }
  ];

  const testimonials = [
    {
      username: '@dreamchaser',
      text: 'I found someone who dreamed about the exact same ocean as me. We are Dream Twins now! 🌀',
      mood: '😊'
    },
    {
      username: '@nightowl',
      text: 'The AI interpretation of my flying dream was surprisingly accurate. This app is magical.',
      mood: '✨'
    },
    {
      username: '@sleepwalker',
      text: 'Finally an app where I can share my weird dreams without being judged. Love the anonymous mode!',
      mood: '🤯'
    }
  ];

  return (
    <div style={styles.page}>

      {/* Navbar */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          <span style={styles.navMoon}>🌙</span>
          <span style={styles.navText}>Dream Share</span>
        </div>
        <div style={styles.navBtns}>
          <button onClick={() => navigate('/login')} style={styles.loginBtn}>
            Login
          </button>
          <button onClick={() => navigate('/register')} style={styles.joinBtn}>
            Join Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        ...styles.hero,
        opacity:   visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.8s ease'
      }}>
        <div style={styles.heroBadge}>
          🌀 World's First Dream Connection App
        </div>

        <h1 style={styles.heroTitle}>
          Share Your Dreams,<br />
          <span style={styles.heroGradient}>Find Your Dream Twins</span>
        </h1>

        <p style={styles.heroSub}>
          Every morning billions of people wake up from incredible dreams
          and forget them by noon. Dream Share helps you capture, share,
          and connect with others who dreamed the same things as you.
        </p>

        <div style={styles.heroBtns}>
          <button
            onClick={() => navigate('/register')}
            style={styles.heroJoinBtn}
          >
            🌙 Start Sharing Dreams — Free
          </button>
          <button
            onClick={() => navigate('/login')}
            style={styles.heroLoginBtn}
          >
            Already have an account →
          </button>
        </div>

        <div style={styles.heroStats}>
          <div style={styles.heroStat}>
            <p style={styles.heroStatNum}>🌙</p>
            <p style={styles.heroStatLabel}>Dream every night</p>
          </div>
          <div style={styles.heroStatDiv} />
          <div style={styles.heroStat}>
            <p style={styles.heroStatNum}>🌀</p>
            <p style={styles.heroStatLabel}>Find Dream Twins</p>
          </div>
          <div style={styles.heroStatDiv} />
          <div style={styles.heroStat}>
            <p style={styles.heroStatNum}>🤖</p>
            <p style={styles.heroStatLabel}>AI Interpretation</p>
          </div>
        </div>
      </div>

      {/* Dream Connection Feature Highlight */}
      <div style={styles.featureHighlight}>
        <div style={styles.featureHighlightInner}>
          <div style={styles.connectionDemo}>
            <div style={styles.connectionUser}>
              <div style={styles.connectionAvatar}>A</div>
              <p style={styles.connectionName}>@alex</p>
              <p style={styles.connectionDream}>"I was flying over the ocean..."</p>
              <div style={styles.connectionTags}>
                <span style={styles.connectionTag}>#flying</span>
                <span style={styles.connectionTag}>#ocean</span>
              </div>
            </div>

            <div style={styles.connectionMiddle}>
              <div style={styles.connectionLine} />
              <div style={styles.connectionBadge}>🌀</div>
              <div style={styles.connectionLine} />
              <p style={styles.connectionLabel}>Dream Twins!</p>
            </div>

            <div style={styles.connectionUser}>
              <div style={{ ...styles.connectionAvatar, background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}>S</div>
              <p style={styles.connectionName}>@sara</p>
              <p style={styles.connectionDream}>"I flew above the sea..."</p>
              <div style={styles.connectionTags}>
                <span style={styles.connectionTag}>#flying</span>
                <span style={styles.connectionTag}>#sea</span>
              </div>
            </div>
          </div>

          <div style={styles.featureHighlightText}>
            <h2 style={styles.featureHighlightTitle}>
              🌀 Dream Connections
            </h2>
            <p style={styles.featureHighlightDesc}>
              The world's first feature that connects people who dreamed about
              the same things. Post your dream with tags, and we automatically
              find your Dream Twins from around the world.
            </p>
            <p style={styles.featureHighlightSub}>
              This feature has never existed in any app before. Ever.
            </p>
            <button
              onClick={() => navigate('/register')}
              style={styles.featureHighlightBtn}
            >
              Find My Dream Twins →
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Everything you need to explore your dream world</h2>
        <p style={styles.sectionSub}>Built for dreamers, by dreamers</p>

        <div style={styles.featuresGrid}>
          {features.map((f, i) => (
            <div key={i} style={styles.featureCard}>
              <div style={styles.featureIcon}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={styles.testimonialsSection}>
        <h2 style={styles.sectionTitle}>What dreamers are saying</h2>
        <div style={styles.testimonialsGrid}>
          {testimonials.map((t, i) => (
            <div key={i} style={styles.testimonialCard}>
              <p style={styles.testimonialMood}>{t.mood}</p>
              <p style={styles.testimonialText}>"{t.text}"</p>
              <p style={styles.testimonialUser}>{t.username}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Start sharing your dreams tonight 🌙</h2>
        <p style={styles.ctaSub}>
          Free forever. No credit card needed.
        </p>
        <button
          onClick={() => navigate('/register')}
          style={styles.ctaBtn}
        >
          🌙 Create Free Account
        </button>
        <p style={styles.ctaLogin}>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            style={styles.ctaLoginLink}
          >
            Sign in
          </span>
        </p>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.footerLogo}>
          <span>🌙</span>
          <span style={styles.footerLogoText}>Dream Share</span>
        </div>
        <p style={styles.footerText}>
          The world's first dream social network with Dream Connections
        </p>
        <p style={styles.footerCopy}>© 2026 Dream Share. Made with 🌙</p>
      </div>

    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)',
    overflowX: 'hidden'
  },

  // Navbar
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    background: 'rgba(15,15,26,0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(108,99,255,0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  navLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  navMoon: { fontSize: '24px' },
  navText: {
    fontSize: '20px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  navBtns: { display: 'flex', gap: '10px', alignItems: 'center' },
  loginBtn: {
    background: 'none',
    border: '1px solid rgba(255,255,255,0.2)',
    color: 'white',
    padding: '8px 18px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  joinBtn: {
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    border: 'none',
    color: 'white',
    padding: '8px 18px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },

  // Hero
  hero: {
    textAlign: 'center',
    padding: '80px 24px 60px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  heroBadge: {
    display: 'inline-block',
    background: 'rgba(108,99,255,0.15)',
    border: '1px solid rgba(108,99,255,0.3)',
    color: '#a78bfa',
    padding: '8px 20px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '24px'
  },
  heroTitle: {
    fontSize: '52px',
    fontWeight: '800',
    color: 'white',
    lineHeight: '1.2',
    marginBottom: '20px'
  },
  heroGradient: {
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa, #f59e0b)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  heroSub: {
    fontSize: '18px',
    color: '#9ca3af',
    lineHeight: '1.7',
    marginBottom: '36px',
    maxWidth: '600px',
    margin: '0 auto 36px'
  },
  heroBtns: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '48px'
  },
  heroJoinBtn: {
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    borderRadius: '20px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 8px 30px rgba(108,99,255,0.4)'
  },
  heroLoginBtn: {
    background: 'rgba(255,255,255,0.05)',
    color: '#a78bfa',
    border: '1px solid rgba(108,99,255,0.3)',
    padding: '16px 32px',
    borderRadius: '20px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  heroStats: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '32px',
    flexWrap: 'wrap'
  },
  heroStat: { textAlign: 'center' },
  heroStatNum: { fontSize: '32px', margin: '0 0 4px' },
  heroStatLabel: { color: '#6b7280', fontSize: '13px', margin: 0 },
  heroStatDiv: { width: '1px', height: '40px', background: 'rgba(255,255,255,0.1)' },

  // Feature Highlight
  featureHighlight: {
    background: 'rgba(108,99,255,0.05)',
    border: '1px solid rgba(108,99,255,0.15)',
    margin: '0 24px 60px',
    borderRadius: '24px',
    padding: '40px',
    maxWidth: '1100px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  featureHighlightInner: {
    display: 'flex',
    gap: '48px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  connectionDemo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1,
    minWidth: '280px'
  },
  connectionUser: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '16px',
    flex: 1,
    textAlign: 'center'
  },
  connectionAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '20px',
    margin: '0 auto 8px'
  },
  connectionName: { color: '#a78bfa', fontWeight: '600', fontSize: '13px', margin: '0 0 6px' },
  connectionDream: { color: '#9ca3af', fontSize: '12px', margin: '0 0 8px', fontStyle: 'italic' },
  connectionTags: { display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' },
  connectionTag: {
    background: 'rgba(108,99,255,0.2)',
    color: '#a78bfa',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '11px'
  },
  connectionMiddle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    flexShrink: 0
  },
  connectionLine: { width: '2px', height: '24px', background: 'rgba(108,99,255,0.3)' },
  connectionBadge: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px'
  },
  connectionLabel: { color: '#a78bfa', fontSize: '10px', fontWeight: '700', margin: 0 },
  featureHighlightText: { flex: 1, minWidth: '280px' },
  featureHighlightTitle: {
    color: 'white',
    fontSize: '28px',
    fontWeight: '800',
    marginBottom: '16px'
  },
  featureHighlightDesc: {
    color: '#9ca3af',
    fontSize: '15px',
    lineHeight: '1.7',
    marginBottom: '12px'
  },
  featureHighlightSub: {
    color: '#a78bfa',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '20px'
  },
  featureHighlightBtn: {
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },

  // Features Grid
  featuresSection: {
    padding: '60px 24px',
    maxWidth: '1100px',
    margin: '0 auto',
    textAlign: 'center'
  },
  sectionTitle: {
    color: 'white',
    fontSize: '32px',
    fontWeight: '800',
    marginBottom: '8px'
  },
  sectionSub: {
    color: '#6b7280',
    fontSize: '16px',
    marginBottom: '40px'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px'
  },
  featureCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '28px',
    textAlign: 'left',
    backdropFilter: 'blur(10px)'
  },
  featureIcon: { fontSize: '36px', marginBottom: '16px' },
  featureTitle: {
    color: 'white',
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '8px'
  },
  featureDesc: {
    color: '#6b7280',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: 0
  },

  // Testimonials
  testimonialsSection: {
    padding: '60px 24px',
    maxWidth: '1100px',
    margin: '0 auto',
    textAlign: 'center'
  },
  testimonialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginTop: '40px'
  },
  testimonialCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '28px',
    textAlign: 'left'
  },
  testimonialMood: { fontSize: '32px', marginBottom: '12px' },
  testimonialText: {
    color: '#e0e0e0',
    fontSize: '15px',
    lineHeight: '1.7',
    fontStyle: 'italic',
    marginBottom: '16px'
  },
  testimonialUser: {
    color: '#a78bfa',
    fontSize: '13px',
    fontWeight: '600',
    margin: 0
  },

  // CTA
  ctaSection: {
    textAlign: 'center',
    padding: '80px 24px',
    background: 'rgba(108,99,255,0.05)',
    borderTop: '1px solid rgba(108,99,255,0.15)',
    borderBottom: '1px solid rgba(108,99,255,0.15)'
  },
  ctaTitle: {
    color: 'white',
    fontSize: '36px',
    fontWeight: '800',
    marginBottom: '12px'
  },
  ctaSub: {
    color: '#6b7280',
    fontSize: '16px',
    marginBottom: '32px'
  },
  ctaBtn: {
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: 'white',
    border: 'none',
    padding: '18px 40px',
    borderRadius: '20px',
    fontSize: '18px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 8px 30px rgba(108,99,255,0.4)',
    display: 'block',
    margin: '0 auto 20px'
  },
  ctaLogin: { color: '#6b7280', fontSize: '14px' },
  ctaLoginLink: { color: '#a78bfa', cursor: 'pointer', fontWeight: '600' },

  // Footer
  footer: {
    textAlign: 'center',
    padding: '40px 24px',
    borderTop: '1px solid rgba(255,255,255,0.06)'
  },
  footerLogo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '12px',
    fontSize: '24px'
  },
  footerLogoText: {
    fontSize: '20px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  footerText: { color: '#6b7280', fontSize: '14px', marginBottom: '8px' },
  footerCopy: { color: '#4b5563', fontSize: '12px', margin: 0 }
};

export default Landing;