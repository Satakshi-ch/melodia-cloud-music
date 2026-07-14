import React, { useState, useEffect, useRef } from 'react';
import { FiPlay, FiPause, FiHeart, FiPlus, FiMusic } from 'react-icons/fi';
import { usePlayer } from '../context/PlayerContext';
import { usePlaylists } from '../context/PlaylistContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const formatDuration = (secs) => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const SongCard = ({ song, trackList = [] }) => {
  const { user } = useAuth();
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const { toggleLikeSong, playlists, addSongToPlaylist } = usePlaylists();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isCurrent = currentTrack?._id === song._id;
  const isLiked = user?.likedSongs?.some(songId => 
    typeof songId === 'object' ? songId._id === song._id : songId === song._id
  );

  // Close dropdown on outside clicks
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handlePlayClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(song, trackList);
    }
  };

  const handleLikeToggle = async (e) => {
    e.stopPropagation();
    if (!user) return;
    await toggleLikeSong(song._id);
  };

  const handleAddToPlaylist = async (playlistId, e) => {
    e.stopPropagation();
    const res = await addSongToPlaylist(playlistId, song._id);
    if (res.success) {
      alert(res.message);
    } else {
      alert(res.message);
    }
    setDropdownOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-2xl p-4 flex flex-col relative group cursor-pointer"
      onClick={handlePlayClick}
    >
      {/* Cover Image Wrapper */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-4 bg-dark-600 border border-dark-500">
        <img
          src={song.coverImage}
          alt={song.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Play/Pause Hover Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePlayClick();
            }}
            className="w-12 h-12 rounded-full bg-brand-gradient text-white flex items-center justify-center shadow-brand-neon hover:scale-110 transition-transform"
          >
            {isCurrent && isPlaying ? (
              <FiPause className="w-5 h-5 fill-current" />
            ) : (
              <FiPlay className="w-5 h-5 fill-current translate-x-[1px]" />
            )}
          </button>
        </div>

        {/* Small Active Track Glow Badge */}
        {isCurrent && isPlaying && (
          <div className="absolute bottom-2.5 right-2.5 bg-brand-gradient px-2 py-0.5 rounded-md text-[9px] font-bold tracking-widest uppercase shadow-md flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            PLAYING
          </div>
        )}
      </div>

      {/* Details */}
      <div className="min-w-0 flex-1">
        <h4 className={`text-sm font-semibold truncate ${isCurrent ? 'bg-brand-gradient bg-clip-text text-transparent' : 'text-white'}`}>
          {song.title}
        </h4>
        <p className="text-xs text-gray-400 truncate mt-1">
          {song.artist}
        </p>
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-dark-500/40 text-[11px] text-gray-500">
          <span className="bg-dark-600 px-2 py-0.5 rounded font-medium text-gray-400 capitalize">
            {song.genre}
          </span>
          <span>
            {formatDuration(song.duration)}
          </span>
        </div>
      </div>

      {/* Heart Likes & Dropdown controls */}
      <div className="absolute top-6 right-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {user && (
          <>
            <button
              onClick={handleLikeToggle}
              className={`w-8 h-8 rounded-full bg-dark-900/80 backdrop-blur-md flex items-center justify-center border border-dark-500 text-sm transition-colors hover:border-brand-purple ${
                isLiked ? 'text-brand-pink' : 'text-gray-400 hover:text-white'
              }`}
            >
              <FiHeart className={isLiked ? 'fill-current' : ''} />
            </button>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
                className="w-8 h-8 rounded-full bg-dark-900/80 backdrop-blur-md flex items-center justify-center border border-dark-500 text-gray-400 hover:text-white text-sm transition-colors hover:border-brand-purple"
                title="Add to Playlist"
              >
                <FiPlus />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    className="absolute right-0 mt-1 w-44 bg-dark-700/90 backdrop-blur-xl border border-dark-500 rounded-xl shadow-lg py-1 z-30 max-h-48 overflow-y-auto"
                  >
                    <p className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase px-3 py-1 border-b border-dark-500">
                      Add to Playlist
                    </p>
                    {playlists.length === 0 ? (
                      <p className="text-[10px] text-gray-400 px-3 py-2 italic">
                        No playlists found. Create one in the sidebar!
                      </p>
                    ) : (
                      playlists.map((pl) => (
                        <button
                          key={pl._id}
                          onClick={(e) => handleAddToPlaylist(pl._id, e)}
                          className="w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-dark-600 transition-colors truncate flex items-center gap-2"
                        >
                          <FiMusic className="text-[10px] text-purple-400 flex-shrink-0" />
                          <span className="truncate">{pl.name}</span>
                        </button>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default SongCard;
