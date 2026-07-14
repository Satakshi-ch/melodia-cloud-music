import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiCompass, 
  FiSearch, 
  FiHeart, 
  FiMusic, 
  FiPlus, 
  FiGrid, 
  FiFolder 
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { usePlaylists } from '../context/PlaylistContext';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { playlists, createPlaylist } = usePlaylists();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

  const isActive = (path) => location.pathname === path;

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    const res = await createPlaylist(newPlaylistName, newPlaylistDesc);
    if (res.success) {
      setNewPlaylistName('');
      setNewPlaylistDesc('');
      setShowAddModal(false);
    }
  };

  const menuItems = [
    { name: 'Home', path: '/home', icon: <FiHome className="w-5 h-5" /> },
    { name: 'Explore', path: '/explore', icon: <FiCompass className="w-5 h-5" /> },
    { name: 'Search', path: '/search', icon: <FiSearch className="w-5 h-5" /> },
    { name: 'My Library', path: '/library', icon: <FiFolder className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-dark-900 border-r border-dark-500 h-[calc(100vh-90px)] p-6 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center shadow-brand-neon">
            <span className="text-xl">🎵</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-lg leading-tight tracking-wider bg-brand-gradient bg-clip-text text-transparent">
              MELODIA
            </h1>
            <p className="text-[10px] text-gray-500 tracking-widest font-semibold uppercase">
              Cloud Streaming
            </p>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="space-y-1 mb-8">
          <p className="text-[11px] text-gray-500 font-semibold tracking-wider uppercase mb-3 px-2">
            Discover
          </p>
          {menuItems.map((item) => (
            <Link key={item.name} to={item.path}>
              <span
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group font-medium ${
                  isActive(item.path)
                    ? 'bg-brand-gradient text-white shadow-brand-neon'
                    : 'text-gray-400 hover:text-white hover:bg-dark-600'
                }`}
              >
                {item.icon}
                <span className="font-display text-sm">{item.name}</span>
              </span>
            </Link>
          ))}
        </div>

        {/* Library & Playlists */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4 px-2">
            <p className="text-[11px] text-gray-500 font-semibold tracking-wider uppercase">
              Playlists
            </p>
            {user && (
              <button
                onClick={() => setShowAddModal(true)}
                className="text-gray-400 hover:text-white p-1 hover:bg-dark-600 rounded-lg transition-colors"
                title="Create Playlist"
              >
                <FiPlus className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-1 overflow-y-auto flex-1 pr-1">
            {/* Liked Songs Shortcut */}
            <Link to="/library?tab=liked">
              <span className="flex items-center gap-4 px-4 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-dark-600 transition-colors font-medium">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-700 to-pink-500 flex items-center justify-center">
                  <FiHeart className="w-3.5 h-3.5 text-white fill-current" />
                </div>
                <span className="text-sm truncate">Liked Songs</span>
              </span>
            </Link>

            {/* Custom Playlists list */}
            {playlists.map((playlist) => (
              <Link key={playlist._id} to={`/playlist/${playlist._id}`}>
                <span className="flex items-center gap-4 px-4 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-dark-600 transition-colors font-medium">
                  <div className="w-6 h-6 rounded-md overflow-hidden bg-dark-600 flex items-center justify-center">
                    {playlist.coverImage ? (
                      <img src={playlist.coverImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <FiMusic className="w-3 h-3 text-purple-400" />
                    )}
                  </div>
                  <span className="text-sm truncate">{playlist.name}</span>
                </span>
              </Link>
            ))}

            {user && user.role === 'admin' && (
              <div className="pt-4 border-t border-dark-600 mt-4">
                <Link to="/admin">
                  <span
                    className={`flex items-center gap-4 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                      isActive('/admin')
                        ? 'bg-purple-900/50 text-brand-purple border border-purple-800/30'
                        : 'text-gray-400 hover:text-white hover:bg-dark-600'
                    }`}
                  >
                    <FiGrid className="w-4 h-4 text-purple-400" />
                    <span className="text-sm">Admin Panel</span>
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation (Adaptable bottom deck) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-dark-800 border-t border-dark-500 z-50 flex items-center justify-around px-4">
        {menuItems.map((item) => (
          <Link key={item.name} to={item.path} className="flex flex-col items-center">
            <span
              className={`p-2 rounded-xl transition-all duration-200 ${
                isActive(item.path)
                  ? 'text-brand-glow scale-115'
                  : 'text-gray-400'
              }`}
            >
              {item.icon}
            </span>
            <span className={`text-[10px] ${isActive(item.path) ? 'text-brand-glow font-bold' : 'text-gray-500'}`}>
              {item.name}
            </span>
          </Link>
        ))}
        {user && user.role === 'admin' && (
          <Link to="/admin" className="flex flex-col items-center">
            <span className={`p-2 rounded-xl transition-all duration-200 ${isActive('/admin') ? 'text-brand-glow scale-115' : 'text-gray-400'}`}>
              <FiGrid className="w-5 h-5" />
            </span>
            <span className={`text-[10px] ${isActive('/admin') ? 'text-brand-glow font-bold' : 'text-gray-500'}`}>
              Admin
            </span>
          </Link>
        )}
      </nav>

      {/* Create Playlist Overlay Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel max-w-md w-full p-8 rounded-3xl border border-dark-500"
            >
              <h2 className="font-display font-bold text-xl mb-4 bg-brand-gradient bg-clip-text text-transparent">
                Create Playlist
              </h2>
              <form onSubmit={handleCreatePlaylist} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2 block">
                    Playlist Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Smooth Jazz, Late Night Coding"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    className="w-full glass-input px-4 py-3 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2 block">
                    Description (Optional)
                  </label>
                  <textarea
                    placeholder="Give your playlist a cool description..."
                    value={newPlaylistDesc}
                    onChange={(e) => setNewPlaylistDesc(e.target.value)}
                    className="w-full glass-input px-4 py-3 rounded-xl text-sm h-24 resize-none"
                  />
                </div>
                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-dark-500 text-gray-400 hover:text-white font-semibold text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary text-sm py-3"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
