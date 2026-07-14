import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePlaylists } from '../context/PlaylistContext';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/SongCard';
import { FiHeart, FiFolder, FiClock, FiCpu, FiPlay, FiPlus, FiMusic, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Library = () => {
  const { user } = useAuth();
  const { playlists, generateSmartPlaylist } = usePlaylists();
  const { playTrack } = usePlayer();
  const location = useLocation();
  const navigate = useNavigate();

  // Tab state (default to liked or sync with URL)
  const [activeTab, setActiveTab] = useState('liked');
  const [smartLoading, setSmartLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['liked', 'playlists', 'history', 'smart'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    navigate(`/library?tab=${tabName}`);
  };

  const handlePlayLikedAll = () => {
    if (user?.likedSongs?.length > 0) {
      playTrack(user.likedSongs[0], user.likedSongs);
    }
  };

  const handleGenerateSmart = async (type) => {
    setSmartLoading(true);
    const res = await generateSmartPlaylist(type);
    setSmartLoading(false);
    if (res.success) {
      alert(`AI Smart Mix '${res.data.name}' generated! Go to 'Created Playlists' to stream it.`);
      handleTabChange('playlists');
    } else {
      alert(res.message);
    }
  };

  // Filter smart playlists vs custom ones
  const smartPlaylists = playlists.filter(p => p.name.endsWith('Smart Mix'));
  const customPlaylists = playlists.filter(p => !p.name.endsWith('Smart Mix'));

  return (
    <div className="flex-1 bg-black p-6 md:p-8 overflow-y-auto pb-32">
      <h2 className="font-display font-extrabold text-3xl text-white mb-6">My Library</h2>

      {/* Tabs Headers */}
      <div className="flex gap-4 border-b border-dark-500 mb-8 overflow-x-auto scrollbar-none">
        <button
          onClick={() => handleTabChange('liked')}
          className={`flex items-center gap-2 pb-4 text-sm font-semibold border-b-2 px-1 transition-all ${
            activeTab === 'liked'
              ? 'border-brand-purple text-white'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <FiHeart className="w-4 h-4" /> Liked Songs
        </button>
        <button
          onClick={() => handleTabChange('playlists')}
          className={`flex items-center gap-2 pb-4 text-sm font-semibold border-b-2 px-1 transition-all ${
            activeTab === 'playlists'
              ? 'border-brand-purple text-white'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <FiFolder className="w-4 h-4" /> Playlists
        </button>
        <button
          onClick={() => handleTabChange('history')}
          className={`flex items-center gap-2 pb-4 text-sm font-semibold border-b-2 px-1 transition-all ${
            activeTab === 'history'
              ? 'border-brand-purple text-white'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <FiClock className="w-4 h-4" /> History
        </button>
        <button
          onClick={() => handleTabChange('smart')}
          className={`flex items-center gap-2 pb-4 text-sm font-semibold border-b-2 px-1 transition-all ${
            activeTab === 'smart'
              ? 'border-brand-purple text-white'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <FiCpu className="w-4 h-4" /> Smart Assistant
        </button>
      </div>

      {/* Tab Panel Contents */}
      <div>
        {activeTab === 'liked' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {user?.likedSongs?.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">
                    {user.likedSongs.length} Liked Tracks
                  </span>
                  <button
                    onClick={handlePlayLikedAll}
                    className="btn-primary flex items-center gap-2 text-xs py-2 px-4"
                  >
                    <FiPlay className="fill-current" /> Play Liked
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                  {user.likedSongs.map((song) => (
                    <SongCard key={song._id} song={song} trackList={user.likedSongs} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-20 glass-panel rounded-2xl border border-dark-500/40 max-w-xl mx-auto">
                <FiHeart className="w-10 h-10 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-sm font-semibold">No liked songs yet</p>
                <p className="text-xs text-gray-500 mt-2">Browse the explore feed or search for tracks to build your library.</p>
                <Link to="/explore" className="btn-primary inline-block text-xs py-2 px-5 mt-6">
                  Explore Songs
                </Link>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'playlists' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
            {/* Custom/Created Playlists */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-lg text-white">Your Playlists</h3>
              </div>
              {customPlaylists.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                  {customPlaylists.map((pl) => (
                    <Link key={pl._id} to={`/playlist/${pl._id}`}>
                      <div className="glass-card rounded-2xl p-4 flex flex-col group h-full">
                        <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-4 bg-dark-600 border border-dark-500">
                          <img src={pl.coverImage} alt={pl.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                              <FiChevronRight className="w-5 h-5 translate-x-[1px]" />
                            </div>
                          </div>
                        </div>
                        <h4 className="text-sm font-semibold text-white truncate">{pl.name}</h4>
                        <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-wider">{pl.songs?.length || 0} songs</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-xs italic">No custom playlists created. Create one from the sidebar!</p>
              )}
            </div>

            {/* Smart/AI Playlists */}
            {smartPlaylists.length > 0 && (
              <div className="pt-6 border-t border-dark-500">
                <h3 className="font-display font-bold text-lg text-white mb-6">AI Smart Playlists</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                  {smartPlaylists.map((pl) => (
                    <Link key={pl._id} to={`/playlist/${pl._id}`}>
                      <div className="glass-card rounded-2xl p-4 flex flex-col group border border-purple-900/20 bg-dark-700/30">
                        <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-4 bg-dark-600 border border-dark-500">
                          <img src={pl.coverImage} alt={pl.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-purple-950/20 z-0" />
                          <div className="absolute top-2 left-2 bg-brand-gradient text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded shadow">AI</div>
                        </div>
                        <h4 className="text-sm font-semibold text-white truncate">{pl.name}</h4>
                        <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-wider">{pl.songs?.length || 0} songs</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {user?.listeningHistory?.length > 0 ? (
              <div>
                <h3 className="font-display font-bold text-lg text-white mb-6">Streaming History</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
                  {user.listeningHistory.map((item) => {
                    const song = item.song;
                    if (!song) return null;
                    return (
                      <SongCard
                        key={item._id}
                        song={song}
                        trackList={user.listeningHistory.map(h => h.song).filter(Boolean)}
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500 text-xs italic">
                Your play history is empty. Play some tunes!
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'smart' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
            <div className="glass-panel p-8 rounded-3xl border border-dark-500 flex flex-col items-center text-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-brand-neon animate-pulse">
                <FiCpu className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-bold text-xl text-white">AI Playlist Generator</h3>
                <p className="text-xs text-gray-400 leading-relaxed max-w-md mx-auto">
                  Melodia analyzes your listening logs, liked genres, and mood signals to generate customized playlist mixes instantly.
                </p>
              </div>

              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <button
                  disabled={smartLoading}
                  onClick={() => handleGenerateSmart('Chill Vibes')}
                  className="glass-card p-4 rounded-xl border border-dark-500 text-left hover:scale-[1.02] flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-white">☕ Chill Vibes</h4>
                    <p className="text-[10px] text-gray-500 mt-1">Acoustic, lofi, calm ambient sounds</p>
                  </div>
                  <FiChevronRight className="text-brand-purple" />
                </button>

                <button
                  disabled={smartLoading}
                  onClick={() => handleGenerateSmart('Workout Mix')}
                  className="glass-card p-4 rounded-xl border border-dark-500 text-left hover:scale-[1.02] flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-white">⚡ Workout Mix</h4>
                    <p className="text-[10px] text-gray-500 mt-1">Energetic rock, electronic beats</p>
                  </div>
                  <FiChevronRight className="text-brand-pink" />
                </button>

                <button
                  disabled={smartLoading}
                  onClick={() => handleGenerateSmart('Night Drive')}
                  className="glass-card p-4 rounded-xl border border-dark-500 text-left hover:scale-[1.02] flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-white">🌃 Night Drive</h4>
                    <p className="text-[10px] text-gray-500 mt-1">Synthwave, dark keys, late night feels</p>
                  </div>
                  <FiChevronRight className="text-brand-purple" />
                </button>

                <button
                  disabled={smartLoading}
                  onClick={() => handleGenerateSmart('Top Picks For You')}
                  className="glass-card p-4 rounded-xl border border-dark-500 text-left hover:scale-[1.02] flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-white">✨ Top Picks For You</h4>
                    <p className="text-[10px] text-gray-500 mt-1">A custom blend of your favorite genres</p>
                  </div>
                  <FiChevronRight className="text-brand-pink" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Library;
