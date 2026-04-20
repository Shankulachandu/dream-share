import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function Messages() {
  const { userId }            = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText]       = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const myId                  = localStorage.getItem('user_id');
  const navigate              = useNavigate();
  const bottomRef             = useRef(null);

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
    const res = await axios.get(
      `http://127.0.0.1:5000/messages/${myId}/${userId}`
    );
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
        <span style={styles.headerName}>@{otherUser?.username}</span>
      </div>

      {/* Messages */}
      <div style={styles.messagesBox}>
        {messages.length === 0 && (
          <p style={styles.empty}>No messages yet. Say hello! 👋</p>
        )}
        {messages.map(m => {
          const isMine = m.sender_id === parseInt(myId);
          return (
            <div
              key={m.id}
              style={{
                ...styles.bubble,
                alignSelf:       isMine ? 'flex-end' : 'flex-start',
                background:      isMine ? '#6c63ff' : '#f0f0f5',
                color:           isMine ? 'white' : '#222',
                borderRadius:    isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px'
              }}
            >
              {m.text}
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
    flexDirection: 'column',
    background: '#fff'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    borderBottom: '1px solid #eee',
    background: '#fff',
    position: 'sticky',
    top: 0
  },
  backBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#6c63ff'
  },
  headerAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#6c63ff',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  headerName: {
    fontWeight: '600',
    fontSize: '16px',
    color: '#1a1a2e'
  },
  messagesBox: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    background: '#f9f9ff'
  },
  empty: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: '40px'
  },
  bubble: {
    maxWidth: '70%',
    padding: '10px 14px',
    fontSize: '14px',
    lineHeight: '1.5',
    wordBreak: 'break-word'
  },
  inputRow: {
    display: 'flex',
    gap: '10px',
    padding: '12px 16px',
    borderTop: '1px solid #eee',
    background: '#fff'
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '24px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none'
  },
  sendBtn: {
    padding: '10px 20px',
    background: '#6c63ff',
    color: 'white',
    border: 'none',
    borderRadius: '24px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px'
  }
};

export default Messages;