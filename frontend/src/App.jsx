import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home.jsx';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Settings from './pages/Settings.jsx';
import Profile from './pages/Profile.jsx';
import { useAuthStore } from './store/useAuthStore.js';

function App() {

  const { authUser, checkAuth } =  useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log(authUser);

  return (
    <div>

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />

      </Routes>

    </div>
  )
}

export default App;
