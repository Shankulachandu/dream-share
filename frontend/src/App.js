import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateDream from './pages/CreateDream';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create"   element={<CreateDream />} />
        <Route path="/profile/:userId" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;