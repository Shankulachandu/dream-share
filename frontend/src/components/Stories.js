import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

function Stories() {
  const [userStories, setUserStories]       = useState([]);
  const [selectedUser, setSelectedUser]     = useState(null);
  const [storyIndex, setStoryIndex]         = useState(0);
  const [showViewer, setShowViewer]         = useState(false);
  const [showUpload, setShowUpload]         = useState(false);
  const [caption, setCaption]               = useState('');
  const [mediaFile, setMediaFile]           = useState(null);
  const [mediaPreview, setMediaPreview]     = useState(null);
  const [mediaType, setMediaType]           = useState('image');
  const [progress, setProgress]             = useState(0);
  const myId       = localStorage.getItem('user_id');
  const myUsername = localStorage.getItem('username');
  const fileRef    = useRef(null);
  const cameraRef  = useRef(null);
  const timerRef   = useRef(null);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/stories${myId ? `?viewer_id=${myId}` : ''}`
      );
      setUserStories(res.data);
    } catch (err) {
      console.error('Could not load stories');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    setMediaType(isVideo ? 'video' : 'image');
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
    setShowUpload(true);
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (cameraRef.current) {
        cameraRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Could not access camera. Please allow camera permission.');
    }
  };

  const uploadStory = async () => {
    if (!mediaFile || !myId) return;
    const formData = new FormData();
    formData.append('user_id', myId);
    formData.append('media', mediaFile);
    formData.append('caption', caption);
    await axios.post('http://127.0.0.1:5000/story/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setShowUpload(false);
    setMediaFile(null);
    setMediaPreview(null);
    setCaption('');
    loadStories();
  };

  const openStory = (userStory) => {
    setSelectedUser(userStory);
    setStoryIndex(0);
    setShowViewer(true);
    setProgress(0);
    markViewed(userStory.stories[0].id);
    startProgress(userStory.stories[0]);
  };

  const markViewed = async (storyId) => {
    if (!myId) return;
    await axios.post('http://127.0.0.1:5000/story/view', {
      story_id:  storyId,
      viewer_id: parseInt(myId)
    });
  };

  const startProgress = (story) => {
    clearInterval(timerRef.current);
    setProgress(0);
    const duration = story.media_type === 'video' ? 15000 : 5000;
    const interval = 100;
    let elapsed    = 0;
    timerRef.current = setInterval(() => {
      elapsed += interval;
      setProgress((elapsed / duration) * 100);
      if (elapsed >= duration) {
        clearInterval(timerRef.current);
        nextStory();
      }
    }, interval);
  };

  const nextStory = () => {
    if (!selectedUser) return;
    const next = storyIndex + 1;
    if (next < selectedUser.stories.length) {
      setStoryIndex(next);
      setProgress(0);
      markViewed(selectedUser.stories[next].id);
      startProgress(selectedUser.stories[next]);
    } else {
      closeViewer();
    }
  };

  const prevStory = () => {
    if (storyIndex > 0) {
      const prev = storyIndex - 1;
      setStoryIndex(prev);
      setProgress(0);
      startProgress(selectedUser.stories[prev]);
    }
  };

  const closeViewer = () => {
    clearInterval(timerRef.current);
    setShowViewer(false);
    setSelectedUser(null);
    setStoryIndex(0);
    loadStories();
  };

  const currentStory = selectedUser?.stories[storyIndex];
  const allViewed    = (us) => us.stories.every(s => s.viewed);

  return (
    <>
      {/* Stories bar */}
      <div style={styles.storiesBar}>

        {/* Add story button */}
        {myId && (
          <div style={styles.storyItem}>
            <label style={styles.addStoryBtn}>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                ref={fileRef}
              />
              <div style={styles.addStoryCircle}>
                <span style={styles.plusIcon}>+</span>
              </div>
            </label>
            <span style={styles.storyUsername}>Your story</span>
          </div>
        )}

        {/* User stories */}
        {userStories.map(us => (
          <div
            key={us.user_id}
            style={styles.storyItem}
            onClick={() => openStory(us)}
          >
            <div style={{
              ...styles.storyRing,
              background: allViewed(us)
                ? 'rgba(255,255,255,0.2)'
                : 'linear-gradient(135deg, #6c63ff, #f59e0b, #ec4899)'
            }}>
              <div style={styles.storyAvatarInner}>
                {us.username[0].toUpperCase()}
              </div>
            </div>
            <span style={styles.storyUsername}>
              {us.username.length > 8
                ? us.username.slice(0, 8) + '...'
                : us.username}
            </span>
          </div>
        ))}
      </div>

      {/* Story Upload Modal */}
      {showUpload && (
        <div style={styles.modal}>
          <div style={styles.modalCard}>
            <h3 style={styles.modalTitle}>📸 Add Story</h3>

            {mediaPreview && (
              <div style={styles.uploadPreview}>
                {mediaType === 'video' ? (
                  <video
                    src={mediaPreview}
                    style={styles.previewMedia}
                    controls
                  />
                ) : (
                  <img
                    src={mediaPreview}
                    alt="preview"
                    style={styles.previewMedia}
                  />
                )}
              </div>
            )}

            <input
              placeholder="Add a caption..."
              value={caption}
              onChange={e => setCaption(e.target.value)}
              style={styles.captionInput}
            />

            <div style={styles.modalBtns}>
              <button
                onClick={() => { setShowUpload(false); setMediaPreview(null); }}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
              <button onClick={uploadStory} style={styles.uploadBtn}>
                Share Story
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Story Viewer */}
      {showViewer && selectedUser && currentStory && (
        <div style={styles.viewer}>

          {/* Progress bars */}
          <div style={styles.progressBars}>
            {selectedUser.stories.map((s, i) => (
              <div key={s.id} style={styles.progressBar}>
                <div style={{
                  ...styles.progressFill,
                  width: i < storyIndex ? '100%'
                       : i === storyIndex ? `${progress}%`
                       : '0%'
                }} />
              </div>
            ))}
          </div>

          {/* Header */}
          <div style={styles.viewerHeader}>
            <div style={styles.viewerUser}>
              <div style={styles.viewerAvatar}>
                {selectedUser.username[0].toUpperCase()}
              </div>
              <div>
                <p style={styles.viewerUsername}>@{selectedUser.username}</p>
                <p style={styles.viewerTime}>
                  {new Date(currentStory.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <button onClick={closeViewer} style={styles.closeBtn}>✕</button>
          </div>

          {/* Media */}
          <div style={styles.viewerMedia} onClick={nextStory}>
            {currentStory.media_type === 'video' ? (
              <video
                src={`http://127.0.0.1:5000${currentStory.media_url}`}
                style={styles.storyMedia}
                autoPlay
                muted
                playsInline
              />
            ) : (
              <img
                src={`http://127.0.0.1:5000${currentStory.media_url}`}
                alt="story"
                style={styles.storyMedia}
              />
            )}
          </div>

          {/* Caption */}
          {currentStory.caption && (
            <div style={styles.caption}>
              <p style={styles.captionText}>{currentStory.caption}</p>
            </div>
          )}

          {/* Tap zones */}
          <div style={styles.tapLeft}  onClick={prevStory} />
          <div style={styles.tapRight} onClick={nextStory} />
        </div>
      )}
    </>
  );
}

const styles = {
  storiesBar: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    overflowX: 'auto',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '16px',
    marginBottom: '24px',
    scrollbarWidth: 'none'
  },
  storyItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    flexShrink: 0
  },
  addStoryBtn: {
    cursor: 'pointer'
  },
  addStoryCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'rgba(108, 99, 255, 0.2)',
    border: '2px dashed rgba(108, 99, 255, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  plusIcon: {
    fontSize: '28px',
    color: '#a78bfa',
    fontWeight: '300'
  },
  storyRing: {
    width: '68px',
    height: '68px',
    borderRadius: '50%',
    padding: '2.5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  storyAvatarInner: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1a1a2e, #2d2d4e)',
    border: '2px solid #0f0f1a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '22px'
  },
  storyUsername: {
    fontSize: '11px',
    color: '#a0a0b0',
    textAlign: 'center',
    maxWidth: '68px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
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
    borderRadius: '20px',
    padding: '28px',
    width: '90%',
    maxWidth: '420px'
  },
  modalTitle: {
    color: 'white',
    fontSize: '18px',
    fontWeight: '700',
    marginBottom: '16px',
    textAlign: 'center'
  },
  uploadPreview: {
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '16px'
  },
  previewMedia: {
    width: '100%',
    maxHeight: '300px',
    objectFit: 'cover',
    display: 'block',
    borderRadius: '12px'
  },
  captionInput: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    marginBottom: '16px'
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
  uploadBtn: {
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
  viewer: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'black',
    zIndex: 2000,
    display: 'flex',
    flexDirection: 'column'
  },
  progressBars: {
    display: 'flex',
    gap: '4px',
    padding: '12px 12px 0',
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 10
  },
  progressBar: {
    flex: 1,
    height: '3px',
    background: 'rgba(255,255,255,0.3)',
    borderRadius: '2px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'white',
    borderRadius: '2px',
    transition: 'width 0.1s linear'
  },
  viewerHeader: {
    position: 'absolute',
    top: '20px', left: 0, right: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 16px',
    zIndex: 10
  },
  viewerUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  viewerAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '14px'
  },
  viewerUsername: {
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
    margin: 0
  },
  viewerTime: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '11px',
    margin: 0
  },
  closeBtn: {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: 'white',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewerMedia: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  storyMedia: {
    maxWidth: '100%',
    maxHeight: '100vh',
    objectFit: 'contain'
  },
  caption: {
    position: 'absolute',
    bottom: '40px',
    left: 0, right: 0,
    padding: '0 24px',
    textAlign: 'center',
    zIndex: 10
  },
  captionText: {
    color: 'white',
    fontSize: '16px',
    fontWeight: '500',
    textShadow: '0 2px 8px rgba(0,0,0,0.8)',
    background: 'rgba(0,0,0,0.4)',
    padding: '8px 16px',
    borderRadius: '20px',
    display: 'inline-block'
  },
  tapLeft: {
    position: 'absolute',
    top: '60px', left: 0,
    width: '35%', bottom: '80px',
    zIndex: 9,
    cursor: 'pointer'
  },
  tapRight: {
    position: 'absolute',
    top: '60px', right: 0,
    width: '35%', bottom: '80px',
    zIndex: 9,
    cursor: 'pointer'
  }
};

export default Stories;