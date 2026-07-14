import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../services/api';
import SongCard from '../components/SongCard';
import { FiSearch, FiSliders, FiClock, FiActivity } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Search = () => {
  const location = useLocation();

  // Search Filter States
  const [q, setQ] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [mood, setMood] = useState('');
  const [duration, setDuration] = useState('');

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Sync general keyword search with URL param (?q=value)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q') || '';
    setQ(query);
  }, [location]);

  // Trigger search on parameter/filter changes
  useEffect(() => {
    const executeSearch = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (q) queryParams.append('q', q);
        if (artist) queryParams.append('artist', artist);
        if (genre) queryParams.append('genre', genre);
        if (mood) queryParams.append('mood', mood);
        if (duration) queryParams.append('duration', duration);

        const res = await API.get(`/search?${queryParams.toString()}`);
        if (res.data && res.data.success) {
          setResults(res.data.data);
        }
      } catch (err) {
        console.error('Error executing search query:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce keyword search slightly to prevent spamming queries
    const delayDebounce = setTimeout(() => {
      executeSearch();
    }, 150);

    return () => clearTimeout(delayDebounce);
  }, [q, artist, genre, mood, duration]);

  const clearFilters = () => {
    setArtist('');
    setGenre('');
    setMood('');
    setDuration('');
  };

  const genres = ['Pop', 'Rock', 'Electronic', 'Lofi', 'Chill'];
  const moods = ['Chill', 'Energetic', 'Happy', 'Dark', 'Calm', 'Relaxed', 'Dreamy', 'Hype'];

  return (
    <div className="flex-1 bg-black p-6 md:p-8 overflow-y-auto pb-32">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display font-extrabold text-3xl text-white">Search Music</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
            showFilters || artist || genre || mood || duration
              ? 'bg-purple-900/40 border-brand-purple text-white shadow-md'
              : 'bg-dark-600 border-dark-500 text-gray-400 hover:text-white'
          }`}
        >
          <FiSliders className="w-3.5 h-3.5" />
          Filters {artist || genre || mood || duration ? '(Active)' : ''}
        </button>
      </div>

      {/* Dynamic Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="glass-panel p-5 rounded-2xl border border-dark-500 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2 block">
                  Artist Name
                </label>
                <input
                  type="text"
                  placeholder="Filter by artist..."
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2 block">
                  Genre
                </label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-dark-600 border border-dark-500 rounded-xl text-xs text-gray-300 px-3.5 py-2 focus:outline-none focus:border-brand-purple"
                >
                  <option value="">All Genres</option>
                  {genres.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2 block">
                  Mood
                </label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full bg-dark-600 border border-dark-500 rounded-xl text-xs text-gray-300 px-3.5 py-2 focus:outline-none focus:border-brand-purple"
                >
                  <option value="">All Moods</option>
                  {moods.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2 block">
                  Song Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-dark-600 border border-dark-500 rounded-xl text-xs text-gray-300 px-3.5 py-2 focus:outline-none focus:border-brand-purple"
                >
                  <option value="">All Lengths</option>
                  <option value="short">Short (&lt; 3 mins)</option>
                  <option value="medium">Medium (3 - 5 mins)</option>
                  <option value="long">Long (&gt; 5 mins)</option>
                </select>
              </div>

              <div className="col-span-2 md:col-span-4 flex justify-end gap-3 pt-2">
                <button
                  onClick={clearFilters}
                  className="text-xs text-gray-500 hover:text-white font-semibold transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Search Input (for page-specific searching) */}
      <div className="relative group mb-8">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-purple transition-colors w-4.5 h-4.5" />
        <input
          type="text"
          placeholder="Search by keywords (e.g. title, artist, genre...)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full glass-input pl-12 pr-4 py-3.5 rounded-2xl text-sm font-medium focus:bg-dark-600/80 transition-colors border border-dark-500/80"
        />
      </div>

      {/* Results Header */}
      <h3 className="font-display font-bold text-lg text-white mb-6 flex items-center gap-2">
        {loading ? (
          <span className="w-4 h-4 rounded-full border-2 border-t-purple-500 border-dark-500 animate-spin inline-block" />
        ) : (
          <FiActivity className="text-purple-400" />
        )}
        {results.length} Search Results Found
      </h3>

      {/* Search Results Grid */}
      {loading && results.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-500 text-sm italic">Searching tracks...</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-2xl border border-dark-500/40">
          <p className="text-gray-400 text-sm">No songs match your query.</p>
          <p className="text-xs text-gray-500 mt-2">Try adjusting your filters or typing different keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 animate-fade-in">
          {results.map((song) => (
            <SongCard key={song._id} song={song} trackList={results} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
