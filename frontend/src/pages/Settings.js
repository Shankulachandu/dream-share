import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config';

const getMediaSrc = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `${API_URL}${url}`;
};

function Settings() {
  const navigate   = useNavigate();
  const myId       = localStorage.getItem('user_id');
  const myUsername = localStorage.getItem('username');

  const [darkMode, setDarkMode]           = useState(true);
  const [profile, setProfile]             = useState(null);
  const [newBio, setNewBio]               = useState('');
  const [newPic, setNewPic]               = useState(null);
  const [picPreview, setPicPreview]       = useState(null);
  const [saving, setSaving]               = useState(false);
  const [saved, setSaved]                 = useState(false);
  const [showLogout, setShowLogout]       = useState(false);
  const [showDelete, setShowDelete]       = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting]           = useState(false);
  const [deleteError, setDeleteError]     = useState('');
  const [activeTab, setActiveTab]         = useState('profile');

  useEffect(() => {
    if (!myId) { navigate('/login'); return; }
    loadProfile();
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) setDarkMode(savedMode === 'true');
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.style.background = 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)';
    } else {
      document.body.style.background = '#f5f5ff';
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const loadProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/profile/${myId}`);
      setProfile(res.data);
      setNewBio(res.data.bio || '');
    } catch (err) {
      console.error('Could not load profile');
    }
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) { setNewPic(file); setPicPreview(URL.createObjectURL(file)); }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('bio', newBio);
      if (newPic) formData.append('profile_pic', newPic);
      await axios.post(`${API_URL}/profile/${myId}/edit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSaved(true);
      setNewPic(null);
      setPicPreview(null);
      loadProfile();
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Could not save profile');
    }
    setSaving(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== myUsername) {
      setDeleteError(`Type your username "@${myUsername}" to confirm`);
      return;
    }
    setDeleting(true);
    try {
      await axios.delete(`${API_URL}/profile/${myId}/delete`);
      localStorage.clear();
      window.location.href = '/landing';
    } catch (err) {
      setDeleteError('Could not delete account. Please try again.');
    }
    setDeleting(false);
  };

  const tabs = [
    { id: 'profile',    label: '👤 Profile'   },
    { id: 'appearance', label: '🎨 Appearance' },
    { id: 'account',    label: '⚙️ Account'    },
  ];

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.topBar}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
        <h2 style={styles.title}>Settings</h2>
        <div style={{ width: '60px' }} />
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              ...styles.tab,
              background:  activeTab === t.id ? 'rgba(108,99,255,0.3)' : 'rgba(255,255,255,0.05)',
              color:       activeTab === t.id ? '#a78bfa' : '#6b7280',
              border:      activeTab === t.id ? '1px solid rgba(108,99,255,0.5)' : '1px solid rgba(255,255,255,0.08)'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── PROFILE TAB ── */}
      {activeTab === 'profile' && profile && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Edit Profile</h3>

          <div style={styles.avatarCenter}>
            <div style={styles.avatarWrap}>
              {picPreview ? (
                <img src={picPreview} alt="preview" style={styles.avatarImg} />
              ) : profile.profile_pic ? (
                <img src={getMediaSrc(profile.profile_pic)} alt="profile" style={styles.avatarImg} />
              ) : (
                <div style={styles.avatarPlaceholder}>
                  {profile.username[0].toUpperCase()}
                </div>
              )}
              <label style={styles.cameraOverlay}>
                📷
                <input type="file" accept="image/*" onChange={handlePicChange} style={{ display: 'none' }} />
              </label>
            </div>
            <p style={styles.avatarHint}>Tap photo to change</p>
          </div>

          <div style={styles.fieldWrap}>
            <p style={styles.fieldLabel}>Username</p>
            <div style={styles.fieldReadOnly}>@{profile.username}</div>
            <p style={styles.fieldHint}>Username cannot be changed</p>
          </div>

          <div style={styles.fieldWrap}>
            <p style={styles.fieldLabel}>Bio</p>
            <textarea
              placeholder="Tell people about yourself..."
              value={newBio}
              onChange={e => setNewBio(e.target.value)}
              maxLength={300}
              style={styles.textarea}
            />
            <p style={styles.charCount}>{newBio.length}/300</p>
          </div>

          {saved && (
            <div style={styles.savedBanner}>✅ Profile saved successfully!</div>
          )}

          <button onClick={handleSaveProfile} disabled={saving} style={styles.saveBtn}>
            {saving ? '⏳ Saving...' : '💾 Save Changes'}
          </button>
        </div>
      )}

      {/* ── APPEARANCE TAB ── */}
      {activeTab === 'appearance' && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Appearance</h3>

          <div style={styles.card}>
            <div style={styles.row}>
              <div>
                <p style={styles.rowTitle}>{darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}</p>
                <p style={styles.rowSub}>{darkMode ? 'Easy on eyes at night' : 'Bright and clean'}</p>
              </div>
              <div
                onClick={() => setDarkMode(!darkMode)}
                style={{ ...styles.toggle, background: darkMode ? 'linear-gradient(135deg, #6c63ff, #a78bfa)' : 'rgba(200,200,200,0.5)' }}
              >
                <div style={{ ...styles.toggleDot, left: darkMode ? '26px' : '3px' }} />
              </div>
            </div>
          </div>

          <div style={{ ...styles.card, marginTop: '12px', background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)' }}>
            <p style={{ color: darkMode ? '#a78bfa' : '#6c63ff', fontWeight: '700', marginBottom: '8px' }}>Preview</p>
            <div style={{ background: darkMode ? 'rgba(255,255,255,0.08)' : 'white', borderRadius: '12px', padding: '12px', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(108,99,255,0.2)'}` }}>
              <p style={{ color: darkMode ? 'white' : '#1a1a2e', fontSize: '14px', margin: 0, fontWeight: '600' }}>
                🌙 Dream Share looks like this
              </p>
              <p style={{ color: darkMode ? '#6b7280' : '#555', fontSize: '12px', margin: '4px 0 0' }}>
                {darkMode ? 'Dark mode active' : 'Light mode active'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── ACCOUNT TAB ── */}
      {activeTab === 'account' && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Account</h3>

          {/* Account info */}
          <div style={styles.card}>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Username</span>
              <span style={styles.infoValue}>@{myUsername}</span>
            </div>
            <div style={styles.divider} />
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Account type</span>
              <span style={styles.infoValue}>Free 🌙</span>
            </div>
            <div style={styles.divider} />
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>App version</span>
              <span style={styles.infoValue}>1.0.0</span>
            </div>
          </div>

          {/* View profile */}
          <div style={{ ...styles.card, marginTop: '12px' }}>
            <button onClick={() => navigate(`/profile/${myId}`)} style={styles.linkBtn}>
              <span>👤 View My Profile</span>
              <span style={styles.arrow}>→</span>
            </button>
          </div>

          {/* Logout */}
          <div style={{ ...styles.card, marginTop: '12px' }}>
            {!showLogout ? (
              <button onClick={() => setShowLogout(true)} style={styles.logoutBtn}>
                🚪 Logout
              </button>
            ) : (
              <div>
                <p style={{ color: 'white', textAlign: 'center', marginBottom: '16px', fontSize: '15px' }}>
                  Are you sure you want to logout?
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => setShowLogout(false)} style={styles.cancelBtn}>Cancel</button>
                  <button onClick={handleLogout} style={styles.confirmLogoutBtn}>Yes, Logout</button>
                </div>
              </div>
            )}
          </div>

          {/* Delete Account */}
          <div style={{ ...styles.card, marginTop: '12px', border: '1px solid rgba(239,68,68,0.2)' }}>
            {!showDelete ? (
              <div>
                <p style={styles.deleteTitle}>⚠️ Danger Zone</p>
                <p style={styles.deleteDesc}>
                  Permanently delete your account and all your dreams, messages and data. This cannot be undone.
                </p>
                <button onClick={() => setShowDelete(true)} style={styles.deleteBtn}>
                  🗑️ Delete My Account
                </button>
              </div>
            ) : (
              <div>
                <p style={styles.deleteTitle}>⚠️ Delete Account</p>
                <p style={styles.deleteDesc}>
                  This will permanently delete everything. Type your username to confirm:
                </p>
                <p style={styles.deleteUsername}>@{myUsername}</p>
                <input
                  placeholder={`Type ${myUsername} to confirm`}
                  value={deleteConfirm}
                  onChange={e => { setDeleteConfirm(e.target.value); setDeleteError(''); }}
                  style={styles.deleteInput}
                />
                {deleteError && (
                  <p style={styles.deleteError}>{deleteError}</p>
                )}
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <button
                    onClick={() => { setShowDelete(false); setDeleteConfirm(''); setDeleteError(''); }}
                    style={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    style={styles.confirmDeleteBtn}
                  >
                    {deleting ? '⏳ Deleting...' : '🗑️ Delete Forever'}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: '500px', margin: '0 auto', padding: '0 16px 100px' },
  topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', marginBottom: '8px' },
  backBtn: { background: 'none', border: 'none', color: '#a78bfa', fontSize: '14px', fontWeight: '600', cursor: 'pointer', padding: '8px 0' },
  title: { color: 'white', fontSize: '18px', fontWeight: '700', margin: 0 },
  tabs: { display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' },
  tab: { padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', flexShrink: 0 },
  section: { paddingBottom: '20px' },
  sectionTitle: { color: 'white', fontSize: '18px', fontWeight: '700', marginBottom: '16px' },
  avatarCenter: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' },
  avatarWrap: { position: 'relative', width: '100px', height: '100px' },
  avatarImg: { width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(108,99,255,0.5)' },
  avatarPlaceholder: { width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #6c63ff, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '40px', fontWeight: '700', border: '3px solid rgba(108,99,255,0.5)' },
  cameraOverlay: { position: 'absolute', bottom: 0, right: 0, width: '32px', height: '32px', background: 'linear-gradient(135deg, #6c63ff, #a78bfa)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', cursor: 'pointer', border: '2px solid #0f0f1a' },
  avatarHint: { color: '#6b7280', fontSize: '12px', marginTop: '8px' },
  fieldWrap: { marginBottom: '16px' },
  fieldLabel: { color: '#a0a0b0', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' },
  fieldReadOnly: { padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', color: '#6b7280', fontSize: '14px' },
  fieldHint: { color: '#4b5563', fontSize: '11px', marginTop: '4px' },
  textarea: { width: '100%', height: '100px', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(108,99,255,0.3)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '14px', resize: 'none', outline: 'none', lineHeight: '1.5' },
  charCount: { textAlign: 'right', fontSize: '11px', color: '#6b7280', marginTop: '4px' },
  savedBanner: { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '12px', color: '#10b981', fontSize: '14px', fontWeight: '600', textAlign: 'center', marginBottom: '12px' },
  saveBtn: { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #6c63ff, #a78bfa)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '15px', fontWeight: '700' },
  card: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px', backdropFilter: 'blur(10px)' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  rowTitle: { color: 'white', fontSize: '15px', fontWeight: '600', margin: 0 },
  rowSub: { color: '#6b7280', fontSize: '12px', margin: '3px 0 0' },
  toggle: { width: '52px', height: '28px', borderRadius: '14px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s', flexShrink: 0 },
  toggleDot: { position: 'absolute', top: '3px', width: '22px', height: '22px', background: 'white', borderRadius: '50%', transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' },
  infoLabel: { color: '#6b7280', fontSize: '14px' },
  infoValue: { color: 'white', fontSize: '14px', fontWeight: '600' },
  divider: { height: '1px', background: 'rgba(255,255,255,0.06)', margin: '12px 0' },
  linkBtn: { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', color: 'white', fontSize: '14px', cursor: 'pointer', padding: '4px 0', fontWeight: '500' },
  arrow: { color: '#6b7280', fontSize: '16px' },
  logoutBtn: { width: '100%', padding: '14px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', cursor: 'pointer', fontSize: '15px', fontWeight: '700' },
  cancelBtn: { flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#a0a0b0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  confirmLogoutBtn: { flex: 1, padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: '700' },

  // Delete Account styles
  deleteTitle: { color: '#ef4444', fontSize: '15px', fontWeight: '700', marginBottom: '8px' },
  deleteDesc: { color: '#9ca3af', fontSize: '13px', lineHeight: '1.5', marginBottom: '12px' },
  deleteUsername: { color: '#a78bfa', fontSize: '14px', fontWeight: '700', marginBottom: '10px', textAlign: 'center' },
  deleteInput: { width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)', color: 'white', fontSize: '14px', outline: 'none', marginBottom: '4px' },
  deleteError: { color: '#ef4444', fontSize: '12px', marginBottom: '8px' },
  deleteBtn: { width: '100%', padding: '12px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  confirmDeleteBtn: { flex: 1, padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: '700' }
};

export default Settings;