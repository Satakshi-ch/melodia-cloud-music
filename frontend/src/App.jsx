import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Player from './components/Player';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Search from './pages/Search';
import Library from './pages/Library';
import PlaylistDetails from './pages/PlaylistDetails';
import Admin from './pages/Admin';

import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();
  const location = useLocation();

  // Pages that should NOT display the global sidebar/header/player (e.g., auth & landing)
  const isAuthOrLandingPage = 
    location.pathname === '/' || 
    location.pathname === '/login' || 
    location.pathname === '/signup';

  return (
    <div className="bg-black text-white min-h-screen font-sans flex flex-col md:flex-row">
      {/* Show Sidebar navigation if not on Auth or Landing pages */}
      {!isAuthOrLandingPage && <Sidebar />}

      {/* Main content body viewport */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
        {/* Show Top Header search/profile controls if not on Auth or Landing pages */}
        {!isAuthOrLandingPage && <Header />}

        {/* Viewport page routes */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={user ? <Navigate to="/home" replace /> : <Landing />} />
            <Route path="/login" element={user ? <Navigate to="/home" replace /> : <Login />} />
            <Route path="/signup" element={user ? <Navigate to="/home" replace /> : <Signup />} />

            {/* Protected subscriber routes */}
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
            <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
            <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
            <Route path="/playlist/:id" element={<ProtectedRoute><PlaylistDetails /></ProtectedRoute>} />

            {/* Administrative control routes */}
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />

            {/* Fallback routing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Show Fixed Player deck if not on Auth or Landing pages */}
        {!isAuthOrLandingPage && <Player />}
      </div>
    </div>
  );
}

export default App;
