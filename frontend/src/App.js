import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"                 element={<Home />} />
        <Route path="/login"            element={<Login />} />
        <Route path="/register"         element={<Register />} />
        <Route path="/create"           element={<CreateDream />} />
        <Route path="/profile/:userId"  element={<Profile />} />
        <Route path="/search"           element={<Search />} />
        <Route path="/conversations"    element={<Conversations />} />
        <Route path="/messages/:userId" element={<Messages />} />
        <Route path="/notifications"    element={<Notifications />} />
        <Route path="/explore"          element={<Explore />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;