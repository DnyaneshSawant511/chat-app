import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import { Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home.jsx';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Settings from './pages/Settings.jsx';
import Profile from './pages/Profile.jsx';
import { useAuthStore } from './store/useAuthStore.js';
import { useThemeStore } from './store/useThemeStore.js';
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

function App() {

  const { authUser, checkAuth, isCheckingAuth, onlineUsers } =  useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if(isCheckingAuth && !authUser){
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>

      <Navbar />

      <Routes>

        <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" /> } />
        <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/" /> } />
        <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" /> } />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" /> } />

      </Routes>

      <Toaster />

    </div>
  )
}

export default App;
