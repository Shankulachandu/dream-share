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
  const [showEdit, setShowEdit]       = useState(false);
  const [newBio, setNewBio]           = useState('');
  const [newPic, setNewPic]           = useState(null);
  const [picPreview, setPicPreview]   = useState(null);
  const [saving, setSaving]           = useState(false);
  const navigate                      = useNavigate();

  const myId        = localStorage.getItem('user_id');
  const isMyProfile = myId === userId;

  useEffect(() => { loadProfile(); }, [userId]);

  const loadProfile = async () => {
    const [profileRes, insightsRes, dreamsRes] = await Promise.all([
      axios.get(`http://127.0.0.1:5000/profile/${userId}`),
      axios.get(`http://127.0.0.1:5000/insights/${userId}`),
      axios.get(`http://127.0.0.1:5000/profile/${userId}/dreams?viewer_id=${myId}`)
    ]);
    setProfile(profileRes.data);
    setInsights(insightsRes.data);
    setDreams(dreamsRes.data);
    setNewBio(profileRes.data.bio || '');

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
        follower_id:  parseInt(myId),
        following_id: parseInt(userId)
      });
      setIsFollowing(false);
    } else {
      await axios.post('http://127.0.0.1:5000/follow', {
        follower_id:  parseInt(myId),
        following_id: parseInt(userId)
      });
      setIsFollowing(true);
    }
    loadProfile();
  };

  const handlePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPic(file);
      setPicPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    const formData = new FormData();
    formData.append('bio', newBio);
    if (newPic) formData.append('profile_pic', newPic);

    const res = await axios.post(
      `http://127.0.0.1:5000/profile/${myId}/edit`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    setShowEdit(false);
    setNewPic(null);
    setPicPreview(null);
    setSaving(false);
    loadProfile();
  };

  if (!profile) return (
    <div style={styles.loading}>Loading profile...</div>
  );

  return (
    <div style={styles.container}>

      {/* Edit Profile Modal */}
      {showEdit && (
        <div style={styles.modal}>
          <div style={styles.modalCard}>
            <h3 style={styles.modalTitle}>✏️ Edit Profile</h3>

            {/* Profile pic upload */}
            <div style={styles.picUploadWrap}>
              <div style={styles.picPreviewCircle}>
                {picPreview ? (
                  <img src={picPreview} alt="preview" style={styles.picPreviewImg} />
                ) : profile.profile_pic ? (
                  <img
                    src={`http://127.0.0.1:5000${profile.profile_pic}`}
                    alt="profile"
                    style={styles.picPreviewImg}
                  />
                ) : (
                  <span style={styles.picPreviewLetter}>
                    {profile.username[0].toUpperCase()}
                  </span>
                )}
              </div>
              <label style={styles.changePicBtn}>
                📸 Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePicChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {/* Bio input */}
            <p style={styles.modalLabel}>Bio</p>
            <textarea
              placeholder="Write something about yourself..."
              value={newBio}
              onChange={e => setNewBio(e.target.value)}
              style={styles.bioInput}
              maxLength={300}
            />
            <p style={styles.charCount}>{newBio.length}/300</p>

            {/* Buttons */}
            <div style={styles.modalBtns}>
              <button
                onClick={() => { setShowEdit(false); setNewPic(null); setPicPreview(null); }}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
              <button onClick={handleSaveProfile} style={styles.saveBtn} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile header */}
      <div style={styles.header}>
        <div style={styles.avatarWrap}>
          {profile.profile_pic ? (
            <img
              src={`http://127.0.0.1:5000${profile.profile_pic}`}
              alt="profile"
              style={styles.avatarImg}
            />
          ) : (
            <div style={styles.avatar}>
              {profile.username[0].toUpperCase()}
            </div>
          )}
          <div style={styles.streakBadge}>🔥 {profile.streak}</div>
        </div>

        <div style={styles.headerInfo}>
          <div style={styles.nameRow}>
            <h2 style={styles.username}>@{profile.username}</h2>
            {isMyProfile && (
              <button onClick={() => setShowEdit(true)} style={styles.editBtn}>
                ✏️ Edit
              </button>
            )}
          </div>
          <p style={styles.bio}>{profile.bio || 'No bio yet'}</p>

          {/* Stats */}
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

          {/* Follow and Message buttons */}
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

          {isMyProfile && (
            <p style={styles.anonNote}>
              🕶️ Anonymous dreams are only visible to you
            </p>
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
          <div key={d.id} style={{ position: 'relative' }}>
            {isMyProfile && d.is_anonymous && (
              <div style={styles.anonBadge}>🕶️ Anonymous</div>
            )}
            <DreamCard dream={d} onLike={loadProfile} />
          </div>
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
  modal: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalCard: {
    background: '#1a1a2e',
    border: '1px solid rgba(108,99,255,0.3)',
    borderRadius: '24px',
    padding: '32px',
    width: '90%',
    maxWidth: '420px'
  },
  modalTitle: {
    color: 'white',
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '24px',
    textAlign: 'center'
  },
  picUploadWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '12px'
  },
  picPreviewCircle: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '3px solid rgba(108,99,255,0.4)'
  },
  picPreviewImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  picPreviewLetter: {
    color: 'white',
    fontSize: '32px',
    fontWeight: '700'
  },
  changePicBtn: {
    padding: '8px 18px',
    background: 'rgba(108,99,255,0.15)',
    color: '#a78bfa',
    border: '1px solid rgba(108,99,255,0.3)',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600'
  },
  modalLabel: {
    color: '#a0a0b0',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px'
  },
  bioInput: {
    width: '100%',
    height: '100px',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    fontSize: '14px',
    resize: 'none',
    outline: 'none',
    lineHeight: '1.5'
  },
  charCount: {
    textAlign: 'right',
    fontSize: '11px',
    color: '#6b7280',
    marginTop: '4px',
    marginBottom: '20px'
  },
  modalBtns: {
    display: 'flex',
    gap: '10px'
  },
  cancelBtn: {
    flex: 1,
    padding: '12px',
    background: 'rgba(255,255,255,0.05)',
    color: '#a0a0b0',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  saveBtn: {
    flex: 1,
    padding: '12px',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
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
  avatarImg: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
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
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '4px'
  },
  username: {
    color: 'white',
    fontSize: '20px',
    fontWeight: '700',
    margin: 0
  },
  editBtn: {
    background: 'rgba(108,99,255,0.15)',
    color: '#a78bfa',
    border: '1px solid rgba(108,99,255,0.3)',
    padding: '4px 12px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600'
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
  anonNote: {
    fontSize: '12px',
    color: '#a78bfa',
    marginTop: '10px',
    background: 'rgba(108, 99, 255, 0.1)',
    padding: '6px 12px',
    borderRadius: '8px',
    display: 'inline-block'
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
  },
  anonBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'rgba(108, 99, 255, 0.3)',
    color: '#a78bfa',
    fontSize: '11px',
    fontWeight: '600',
    padding: '3px 10px',
    borderRadius: '20px',
    zIndex: 10,
    border: '1px solid rgba(108, 99, 255, 0.4)'
  }
};

export default Profile;