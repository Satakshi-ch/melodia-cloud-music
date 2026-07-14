import React, { useEffect, useState } from 'react';
import API from '../services/api';
import SongCard from '../components/SongCard';
import { FiTrendingUp, FiCalendar, FiMusic, FiUsers } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Explore = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState('All');

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await API.get('/songs');
        if (res.data && res.data.success) {
          setSongs(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching catalog in explore page:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 bg-black p-8 flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-t-brand-purple border-dark-600 animate-spin" />
          <p className="text-gray-400 font-display text-sm tracking-wider">Browsing catalogs...</p>
        </div>
      </div>
    );
  }

  // Filter lists
  const genres = ['All', 'Pop', 'Rock', 'Electronic', 'Lofi', 'Chill'];
  
  const filteredSongs = activeGenre === 'All' 
    ? songs 
    : songs.filter(s => s.genre.toLowerCase() === activeGenre.toLowerCase());

  // Trending Songs: sorted by playCount desc
  const trendingSongs = [...songs]
    .sort((a, b) => b.playCount - a.playCount)
    .slice(0, 6);

  // New Releases: sorted by createdAt desc (or default order reversed)
  const newReleases = [...songs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  // Extract distinct artists
  const distinctArtists = [...new Set(songs.map(s => s.artist))].slice(0, 8);

  const artistAvatars = {
    "Broke For Free": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=250&auto=format&fit=crop",
    "Tours": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop",
    "Jahzzar": "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?q=80&w=250&auto=format&fit=crop",
    "Kai Engel": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=250&auto=format&fit=crop",
    "Meydän": "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=250&auto=format&fit=crop",
    "Ketsa": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=250&auto=format&fit=crop",
    "Audiobinger": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop",
    "Jesse Spillane": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=250&auto=format&fit=crop",
    "Scott Holmes": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=250&auto=format&fit=crop",
  };

  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop";

  return (
    <div className="flex-1 bg-black p-6 md:p-8 overflow-y-auto pb-32">
      <h2 className="font-display font-extrabold text-3xl text-white mb-6">Explore Music</h2>

      {/* Genre Filters Row */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setActiveGenre(genre)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              activeGenre === genre
                ? 'bg-brand-gradient text-white border-transparent shadow-brand-neon'
                : 'bg-dark-600 text-gray-400 border-dark-500 hover:text-white hover:bg-dark-500'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {activeGenre === 'All' ? (
        <>
          {/* Section: Trending Songs */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <FiTrendingUp className="text-brand-purple w-5 h-5" />
              <h3 className="font-display font-bold text-xl text-white">Trending Now</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {trendingSongs.map((song) => (
                <SongCard key={song._id} song={song} trackList={trendingSongs} />
              ))}
            </div>
          </section>

          {/* Section: New Releases */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <FiCalendar className="text-brand-pink w-5 h-5" />
              <h3 className="font-display font-bold text-xl text-white">New Releases</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {newReleases.map((song) => (
                <SongCard key={song._id} song={song} trackList={newReleases} />
              ))}
            </div>
          </section>

          {/* Section: Popular Artists */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <FiUsers className="text-brand-glow w-5 h-5" />
              <h3 className="font-display font-bold text-xl text-white">Popular Artists</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-6">
              {distinctArtists.map((artist) => (
                <div
                  key={artist}
                  className="glass-card rounded-2xl p-4 flex flex-col items-center text-center cursor-pointer group"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-3 bg-dark-600 border border-dark-500 shadow-md">
                    <img
                      src={artistAvatars[artist] || defaultAvatar}
                      alt={artist}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h4 className="text-xs font-bold text-white truncate max-w-full">{artist}</h4>
                  <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-wider">Artist</p>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        /* Section: Genre Filter Results */
        <section>
          <div className="flex items-center gap-3 mb-6">
            <FiMusic className="text-brand-purple w-5 h-5" />
            <h3 className="font-display font-bold text-xl text-white capitalize">{activeGenre} Tracks</h3>
          </div>
          {filteredSongs.length === 0 ? (
            <div className="text-center py-20 text-gray-500 text-sm italic">
              No songs found in the '{activeGenre}' category.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {filteredSongs.map((song) => (
                <SongCard key={song._id} song={song} trackList={filteredSongs} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Explore;
