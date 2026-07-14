import React from 'react';
import { 
  FiPlay, 
  FiPause, 
  FiSkipBack, 
  FiSkipForward, 
  FiShuffle, 
  FiRepeat, 
  FiVolume2, 
  FiVolumeX, 
  FiHeart 
} from 'react-icons/fi';
import { usePlayer } from '../context/PlayerContext';
import { usePlaylists } from '../context/PlaylistContext';
import { useAuth } from '../context/AuthContext';

// Helper to format track timings (e.g., 212 -> 3:32)
const formatTime = (secs) => {
  if (isNaN(secs)) return '0:00';
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const Player = () => {
  const { user } = useAuth();
  const { toggleLikeSong } = usePlaylists();
  const {
    currentTrack,
    isPlaying,
    volume,
    progress,
    duration,
    isMuted,
    isShuffle,
    repeatMode,
    togglePlay,
    nextTrack,
    prevTrack,
    seekTo,
    changeVolume,
    toggleMute,
    setIsShuffle,
    setRepeatMode,
  } = usePlayer();

  if (!currentTrack) {
    return (
      <div className="h-[90px] bg-dark-900 border-t border-dark-500 fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center text-gray-500 font-display text-sm tracking-wider">
        Select a song and start streaming your vibes 🎵
      </div>
    );
  }

  const isLiked = user?.likedSongs?.some(songId => {
    // likedSongs could be loaded as an array of IDs or populated objects, check both
    return typeof songId === 'object' 
      ? songId._id === currentTrack._id 
      : songId === currentTrack._id;
  });

  const handleLikeClick = async () => {
    if (!user) return;
    await toggleLikeSong(currentTrack._id);
  };

  const handleSeekChange = (e) => {
    seekTo(parseFloat(e.target.value));
  };

  const handleVolumeChange = (e) => {
    changeVolume(parseFloat(e.target.value));
  };

  const toggleRepeat = () => {
    if (repeatMode === 'none') {
      setRepeatMode('all');
    } else if (repeatMode === 'all') {
      setRepeatMode('one');
    } else {
      setRepeatMode('none');
    }
  };

  return (
    <div className="h-[90px] bg-dark-900/90 backdrop-blur-2xl border-t border-dark-500 fixed bottom-16 md:bottom-0 left-0 right-0 z-50 px-6 flex items-center justify-between">
      {/* Left Area: Album details */}
      <div className="flex items-center gap-4 w-1/3 min-w-[200px]">
        <div className="w-14 h-14 rounded-lg overflow-hidden bg-dark-600 flex-shrink-0 shadow-lg border border-dark-500">
          <img
            src={currentTrack.coverImage}
            alt={currentTrack.title}
            className="w-full h-full object-cover animate-pulse-slow"
          />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-white truncate hover:underline cursor-pointer">
            {currentTrack.title}
          </h4>
          <p className="text-xs text-gray-400 truncate hover:text-white cursor-pointer mt-0.5">
            {currentTrack.artist}
          </p>
        </div>
        {user && (
          <button
            onClick={handleLikeClick}
            className={`p-2 hover:bg-dark-600/50 rounded-full transition-colors flex-shrink-0 ${
              isLiked ? 'text-brand-pink' : 'text-gray-400 hover:text-white'
            }`}
          >
            <FiHeart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      {/* Middle Area: Play deck controls */}
      <div className="flex flex-col items-center w-1/3 max-w-[600px]">
        <div className="flex items-center gap-6 mb-1.5">
          {/* Shuffle */}
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`p-1.5 rounded-md transition-colors ${
              isShuffle ? 'text-brand-glow text-glow' : 'text-gray-400 hover:text-white'
            }`}
            title="Shuffle"
          >
            <FiShuffle className="w-4 h-4" />
          </button>

          {/* Skip backward */}
          <button
            onClick={prevTrack}
            className="text-gray-400 hover:text-white transition-colors"
            title="Previous"
          >
            <FiSkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <FiPause className="w-4.5 h-4.5 fill-current" />
            ) : (
              <FiPlay className="w-4.5 h-4.5 fill-current translate-x-[1px]" />
            )}
          </button>

          {/* Skip forward */}
          <button
            onClick={nextTrack}
            className="text-gray-400 hover:text-white transition-colors"
            title="Next"
          >
            <FiSkipForward className="w-5 h-5 fill-current" />
          </button>

          {/* Repeat */}
          <button
            onClick={toggleRepeat}
            className={`p-1.5 rounded-md transition-colors relative ${
              repeatMode !== 'none' ? 'text-brand-glow text-glow' : 'text-gray-400 hover:text-white'
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            <FiRepeat className="w-4 h-4" />
            {repeatMode === 'one' && (
              <span className="absolute top-[2px] right-[2px] bg-brand-glow text-black font-extrabold text-[8px] rounded-full w-3 h-3 flex items-center justify-center scale-75">
                1
              </span>
            )}
          </button>
        </div>

        {/* Progress Slider */}
        <div className="flex items-center gap-3 w-full">
          <span className="text-[10px] text-gray-500 font-mono w-8 text-right">
            {formatTime(progress)}
          </span>
          <div className="flex-1 relative group flex items-center">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={progress}
              onChange={handleSeekChange}
              className="w-full h-1 bg-dark-500 rounded-lg appearance-none cursor-pointer accent-brand-purple hover:bg-dark-600 transition-colors"
            />
          </div>
          <span className="text-[10px] text-gray-500 font-mono w-8 text-left">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right Area: Volume and auxiliary */}
      <div className="flex items-center justify-end gap-3 w-1/3 min-w-[150px]">
        <button
          onClick={toggleMute}
          className="text-gray-400 hover:text-white transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <FiVolumeX className="w-4.5 h-4.5" /> : <FiVolume2 className="w-4.5 h-4.5" />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-20 h-1 bg-dark-500 rounded-lg appearance-none cursor-pointer accent-brand-purple"
          title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
        />
      </div>
    </div>
  );
};

export default Player;
