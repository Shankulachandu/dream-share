import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function Messages() {
  const { userId }              = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText]         = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const myId     = localStorage.getItem('user_id');
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!myId) { navigate('/login'); return; }
    loadMessages();
    loadOtherUser();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    const res = await axios.get(`http://127.0.0.1:5000/messages/${myId}/${userId}`);
    setMessages(res.data);
  };

  const loadOtherUser = async () => {
    const res = await axios.get(`http://127.0.0.1:5000/profile/${userId}`);
    setOtherUser(res.data);
  };

  const sendMessage = async () => {
    if (!text.trim()) return;
    await axios.post('http://127.0.0.1:5000/message/send', {
      sender_id:   parseInt(myId),
      receiver_id: parseInt(userId),
      text
    });
    setText('');
    loadMessages();
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
        <div style={styles.headerAvatar}>
          {otherUser?.username[0].toUpperCase()}
        </div>
        <div>
          <p style={styles.headerName}>@{otherUser?.username}</p>
          <p style={styles.headerSub}>Dream Share</p>
        </div>
      </div>

      {/* Messages */}
      <div style={styles.messagesBox}>
        {messages.length === 0 && (
          <div style={styles.empty}>
            <p style={styles.emptyIcon}>💬</p>
            <p style={styles.emptyText}>No messages yet</p>
            <p style={styles.emptySub}>Say hello! 👋</p>
          </div>
        )}
        {messages.map(m => {
          const isMine = m.sender_id === parseInt(myId);
          return (
            <div key={m.id} style={{
              ...styles.bubbleWrap,
              justifyContent: isMine ? 'flex-end' : 'flex-start'
            }}>
              <div style={{
                ...styles.bubble,
                background: isMine
                  ? 'linear-gradient(135deg, #6c63ff, #a78bfa)'
                  : 'rgba(255,255,255,0.08)',
                color: isMine ? 'white' : '#e0e0e0',
                borderRadius: isMine
                  ? '18px 18px 4px 18px'
                  : '18px 18px 18px 4px'
              }}>
                {m.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={styles.inputRow}>
        <input
          placeholder="Type a message..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.sendBtn}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: 'rgba(15, 15, 26, 0.95)',
    borderBottom: '1px solid rgba(108, 99, 255, 0.2)',
    backdropFilter: 'blur(20px)',
    position: 'sticky',
    top: 0
  },
  backBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#a78bfa',
    fontWeight: '600'
  },
  headerAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '16px'
  },
  headerName: {
    fontWeight: '600',
    fontSize: '15px',
    color: 'white',
    margin: 0
  },
  headerSub: {
    fontSize: '11px',
    color: '#6b7280',
    margin: 0
  },
  messagesBox: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
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
    fontSize: '16px',
    fontWeight: '600'
  },
  emptySub: {
    color: '#6b7280',
    fontSize: '13px',
    marginTop: '6px'
  },
  bubbleWrap: {
    display: 'flex',
    width: '100%'
  },
  bubble: {
    maxWidth: '70%',
    padding: '10px 16px',
    fontSize: '14px',
    lineHeight: '1.5',
    wordBreak: 'break-word'
  },
  inputRow: {
    display: 'flex',
    gap: '10px',
    padding: '12px 16px',
    background: 'rgba(15, 15, 26, 0.95)',
    borderTop: '1px solid rgba(108, 99, 255, 0.2)',
    backdropFilter: 'blur(20px)'
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '24px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    fontSize: '14px',
    outline: 'none'
  },
  sendBtn: {
    padding: '12px 22px',
    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
    color: 'white',
    border: 'none',
    borderRadius: '24px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  }
};

export default Messages;