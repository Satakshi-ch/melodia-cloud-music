import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import { usePlaylists } from '../context/PlaylistContext';
import SongCard from '../components/SongCard';
import API from '../services/api';
import { FiMusic, FiPlay, FiSmile, FiHeart, FiFolder } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Home = () => {
  const { user } = useAuth();
  const { playTrack } = usePlayer();
  const { generateSmartPlaylist } = usePlaylists();
  
  const [songs, setSongs] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [smartCreating, setSmartCreating] = useState(false);

  // Dynamic Time-of-Day Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const res = await API.get('/songs');
        if (res.data && res.data.success) {
          setSongs(res.data.data);
          
          // Select 4 random songs for recommendations
          const shuffled = [...res.data.data].sort(() => 0.5 - Math.random());
          setRecommendations(shuffled.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to load songs for home view:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const handleQuickPlayAll = () => {
    if (songs.length > 0) {
      playTrack(songs[0], songs);
    }
  };

  const handleCreateSmartMix = async (type) => {
    setSmartCreating(true);
    const res = await generateSmartPlaylist(type);
    setSmartCreating(false);
    if (res.success) {
      alert(`AI Smart Mix '${res.data.name}' generated! Play it in your library.`);
    } else {
      alert(res.message);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-black p-8 flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-t-brand-purple border-dark-600 animate-spin" />
          <p className="text-gray-400 font-display text-sm tracking-wider">Curation engines warming up...</p>
        </div>
      </div>
    );
  }

  // Extract recently played from user object
  // listeningHistory format: [{ song: { _id, title, ... }, playedAt }]
  const recentlyPlayed = user?.listeningHistory || [];

  return (
    <div className="flex-1 bg-black p-6 md:p-8 overflow-y-auto pb-32">
      {/* Hero Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-8 md:p-10 mb-8 border border-dark-500/40 bg-gradient-to-r from-dark-700 via-dark-800 to-black"
      >
        <div className="absolute top-[-30%] right-[-10%] w-[300px] h-[300px] rounded-full bg-brand-purple/20 blur-[80px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-white tracking-tight flex items-center gap-3">
              {getGreeting()}, {user?.username} <FiSmile className="text-brand-glow animate-bounce" />
            </h2>
            <p className="text-gray-400 max-w-md text-sm font-medium">
              Start your streaming day with customized audio recommendations and intelligent playlist mixes.
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleQuickPlayAll}
              className="btn-primary py-3 px-6 text-sm flex items-center gap-2"
            >
              <FiPlay className="fill-current w-4 h-4" /> Play Mix
            </button>
          </div>
        </div>
      </motion.div>

      {/* User Stats Grid */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="glass-panel p-5 rounded-2xl border border-dark-500/60 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-900/30 flex items-center justify-center border border-purple-800/20 text-brand-purple">
            <FiHeart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Liked Tracks</p>
            <h4 className="text-xl font-bold text-white mt-0.5">{user?.likedSongs?.length || 0}</h4>
          </div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-dark-500/60 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-pink-900/30 flex items-center justify-center border border-pink-800/20 text-brand-pink">
            <FiFolder className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Playlists</p>
            <h4 className="text-xl font-bold text-white mt-0.5">{user?.playlists?.length || 0}</h4>
          </div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-dark-500/60 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-fuchsia-900/30 flex items-center justify-center border border-fuchsia-800/20 text-brand-glow">
            <FiMusic className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Catalog Size</p>
            <h4 className="text-xl font-bold text-white mt-0.5">{songs.length}</h4>
          </div>
        </div>
      </div>

      {/* Quick AI Smart Mix Prompt */}
      <div className="glass-panel p-6 rounded-2xl border border-dark-500 mb-10">
        <h3 className="font-display font-bold text-lg text-white mb-2">Need a custom vibe?</h3>
        <p className="text-xs text-gray-400 mb-4">Generate instant playlists using our AI preference filter.</p>
        <div className="flex flex-wrap gap-3">
          {['Chill Vibes', 'Workout Mix', 'Night Drive', 'Top Picks For You'].map((type) => (
            <button
              key={type}
              disabled={smartCreating}
              onClick={() => handleCreateSmartMix(type)}
              className="bg-dark-600 hover:bg-dark-500 text-gray-300 hover:text-white px-4 py-2.5 rounded-xl text-xs font-semibold border border-dark-500 transition-colors"
            >
              ⚡ {type}
            </button>
          ))}
        </div>
      </div>

      {/* Recently Played */}
      {recentlyPlayed.length > 0 && (
        <section className="mb-10">
          <h3 className="font-display font-bold text-xl text-white mb-6">Recently Played</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {recentlyPlayed.slice(0, 6).map((item) => {
              const song = item.song;
              if (!song) return null;
              return (
                <SongCard
                  key={item._id}
                  song={song}
                  trackList={recentlyPlayed.map((historyItem) => historyItem.song).filter(Boolean)}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Personalized Recommendations */}
      <section>
        <h3 className="font-display font-bold text-xl text-white mb-6">Recommended for You</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {recommendations.map((song) => (
            <SongCard key={song._id} song={song} trackList={recommendations} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
