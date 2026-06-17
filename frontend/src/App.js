import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateDream from './pages/CreateDream';
import Profile from './pages/Profile';
import Search from './pages/Search';
import Messages from './pages/Messages';
import Conversations from './pages/Conversations';
import Notifications from './pages/Notifications';
import Explore from './pages/Explore';
import Settings from './pages/Settings';
import DreamConnections from './pages/DreamConnections';

function ProtectedRoute({ children }) {
  const userId = localStorage.getItem('user_id');
  if (!userId) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreateDream /></ProtectedRoute>} />
        <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/conversations" element={<ProtectedRoute><Conversations /></ProtectedRoute>} />
        <Route path="/messages/:userId" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/connections" element={<ProtectedRoute><DreamConnections /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;