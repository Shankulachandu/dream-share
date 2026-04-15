import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const userId = localStorage.getItem('user_id');

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>🌙 Dream Share</Link>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Feed</Link>

        {userId ? (
          <>
            <Link to="/create" style={styles.link}>+ Post Dream</Link>
            <Link to={`/profile/${userId}`} style={styles.link}>My Profile</Link>
            <button onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login"    style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: '#0f0f1a',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  logo: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '20px',
    fontWeight: 'bold'
  },
  links: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center'
  },
  link: {
    color: '#ccc',
    textDecoration: 'none',
    fontSize: '14px'
  },
  btn: {
    background: 'none',
    color: '#ccc',
    border: '1px solid #444',
    padding: '4px 12px',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};

export default Navbar;