import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlaylists } from '../context/PlaylistContext';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { 
  FiPlay, 
  FiPause, 
  FiEdit, 
  FiTrash2, 
  FiClock, 
  FiMusic, 
  FiXCircle, 
  FiHeart 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const formatTime = (secs) => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const PlaylistDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { updatePlaylist, deletePlaylist, removeSongFromPlaylist, toggleLikeSong } = usePlaylists();
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');

  const fetchPlaylistDetails = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/playlists/${id}`);
      if (res.data && res.data.success) {
        setPlaylist(res.data.data);
        setName(res.data.data.name);
        setDescription(res.data.data.description || '');
        setCoverImage(res.data.data.coverImage || '');
      }
    } catch (err) {
      console.error('Error loading playlist details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylistDetails();
  }, [id]);

  const handlePlayAll = () => {
    if (playlist && playlist.songs.length > 0) {
      playTrack(playlist.songs[0], playlist.songs);
    }
  };

  const handleTrackClick = (song) => {
    if (currentTrack?._id === song._id) {
      togglePlay();
    } else {
      playTrack(song, playlist.songs);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await updatePlaylist(playlist._id, name, description, coverImage);
    if (res.success) {
      setPlaylist(res.data);
      setShowEditModal(false);
    } else {
      alert(res.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      const res = await deletePlaylist(playlist._id);
      if (res.success) {
        navigate('/library?tab=playlists');
      }
    }
  };

  const handleRemoveSong = async (songId, e) => {
    e.stopPropagation();
    const res = await removeSongFromPlaylist(playlist._id, songId);
    if (res.success) {
      setPlaylist(res.data);
    } else {
      alert(res.message);
    }
  };

  const handleLikeToggle = async (songId, e) => {
    e.stopPropagation();
    await toggleLikeSong(songId);
  };

  if (loading) {
    return (
      <div className="flex-1 bg-black p-8 flex items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-t-brand-purple border-dark-600 animate-spin" />
          <p className="text-gray-400 font-display text-sm tracking-wider">Unrolling track deck...</p>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="flex-1 bg-black p-8 flex flex-col items-center justify-center text-center">
        <FiXCircle className="w-14 h-14 text-rose-500 mb-4 animate-bounce" />
        <h3 className="text-xl font-bold text-white mb-2">Playlist Not Found</h3>
        <p className="text-gray-400 text-sm max-w-sm mb-6">
          The playlist you are trying to view does not exist or you do not have permission to view it.
        </p>
        <button onClick={() => navigate('/library?tab=playlists')} className="btn-primary py-2.5 px-6 text-xs">
          Back to Library
        </button>
      </div>
    );
  }

  const isOwner = user && (playlist.owner._id === user._id || playlist.owner === user._id);
  const isSmart = playlist.name.endsWith('Smart Mix');

  return (
    <div className="flex-1 bg-black overflow-y-auto pb-32">
      {/* Banner Area */}
      <div className="relative p-6 md:p-8 pt-8 md:pt-12 bg-gradient-to-b from-purple-900/35 via-dark-800/10 to-black border-b border-dark-500/20 flex flex-col sm:flex-row items-center sm:items-end gap-6 md:gap-8">
        <div className="absolute top-0 left-0 right-0 h-full bg-radial-glow pointer-events-none opacity-40" />

        {/* Cover image */}
        <div className="w-44 h-44 sm:w-48 sm:h-48 md:w-52 md:h-52 rounded-2xl overflow-hidden bg-dark-600 border border-dark-500/80 shadow-2xl relative group-hover:scale-105 transition-transform flex-shrink-0">
          <img
            src={playlist.coverImage}
            alt={playlist.name}
            className="w-full h-full object-cover"
          />
          {isSmart && (
            <div className="absolute top-3 left-3 bg-brand-gradient text-white text-[9px] font-extrabold px-2 py-0.5 rounded shadow shadow-brand-neon">
              AI SMART MIX
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="text-center sm:text-left flex-1 min-w-0">
          <span className="text-[10px] text-brand-purple font-bold tracking-widest uppercase mb-2 block">
            {isSmart ? 'AI Recommendations' : 'Playlist'}
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-5xl lg:text-6xl text-white tracking-tight leading-none truncate max-w-full">
            {playlist.name}
          </h2>
          <p className="text-gray-400 text-xs md:text-sm mt-3 font-medium leading-relaxed max-w-2xl line-clamp-2">
            {playlist.description || 'Custom mix created on Melodia.'}
          </p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 mt-4 text-xs text-gray-500 font-semibold">
            <span>By <span className="text-gray-300">{playlist.owner.username || 'You'}</span></span>
            <span className="w-1.5 h-1.5 rounded-full bg-dark-500 hidden sm:inline" />
            <span className="text-brand-pink">{playlist.songs?.length || 0} songs</span>
          </div>
        </div>
      </div>

      {/* Playlist Actions Deck */}
      <div className="px-6 md:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {playlist.songs?.length > 0 ? (
            <button
              onClick={handlePlayAll}
              className="btn-primary py-3 px-6 text-sm flex items-center gap-2"
            >
              <FiPlay className="fill-current" /> Play All
            </button>
          ) : (
            <button disabled className="bg-dark-600 text-gray-500 py-3 px-6 text-sm font-semibold rounded-full cursor-not-allowed">
              Play All
            </button>
          )}

          {isOwner && !isSmart && (
            <>
              <button
                onClick={() => setShowEditModal(true)}
                className="w-10 h-10 rounded-full bg-dark-600 hover:bg-dark-500 text-gray-300 hover:text-white flex items-center justify-center border border-dark-500 transition-colors"
                title="Edit Playlist Details"
              >
                <FiEdit />
              </button>
              <button
                onClick={handleDelete}
                className="w-10 h-10 rounded-full bg-dark-600 hover:bg-rose-900/40 text-gray-300 hover:text-rose-400 flex items-center justify-center border border-dark-500 transition-colors"
                title="Delete Playlist"
              >
                <FiTrash2 />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Song list table */}
      <div className="px-6 md:px-8">
        {playlist.songs?.length === 0 ? (
          <div className="text-center py-20 bg-dark-700/20 rounded-2xl border border-dark-500/20 italic text-gray-500 text-sm">
            This playlist has no songs yet. Go to explore or search and start adding some!
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-left text-sm text-gray-400">
              <thead>
                <tr className="border-b border-dark-500 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Genre</th>
                  <th className="py-3 px-4">Mood</th>
                  <th className="py-3 px-4 w-16 text-center">
                    <FiClock className="w-4 h-4 mx-auto" />
                  </th>
                  <th className="py-3 px-4 w-28 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {playlist.songs.map((song, index) => {
                  const isCurrent = currentTrack?._id === song._id;
                  const isSongLiked = user?.likedSongs?.some(likedId => 
                    typeof likedId === 'object' ? likedId._id === song._id : likedId === song._id
                  );
                  return (
                    <tr
                      key={song._id}
                      onClick={() => handleTrackClick(song)}
                      className={`hover:bg-dark-600/40 border-b border-dark-500/20 transition-colors group cursor-pointer ${
                        isCurrent ? 'bg-dark-600/20' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center font-medium text-gray-500">
                        {isCurrent && isPlaying ? (
                          <div className="flex items-center justify-center gap-0.5 w-4 h-4 mx-auto">
                            <span className="w-0.5 bg-brand-purple h-2 animate-[pulse_1s_infinite]" />
                            <span className="w-0.5 bg-brand-pink h-3 animate-[pulse_0.8s_infinite_0.2s]" />
                            <span className="w-0.5 bg-brand-glow h-1.5 animate-[pulse_1.2s_infinite_0.4s]" />
                          </div>
                        ) : (
                          index + 1
                        )}
                      </td>
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded bg-dark-600 overflow-hidden flex-shrink-0">
                          <img src={song.coverImage} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className={`font-semibold truncate text-sm ${isCurrent ? 'bg-brand-gradient bg-clip-text text-transparent' : 'text-gray-200 group-hover:text-white'}`}>
                            {song.title}
                          </p>
                          <p className="text-xs text-gray-500 group-hover:text-gray-400 truncate mt-0.5">
                            {song.artist}
                          </p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-semibold capitalize text-gray-400">
                        {song.genre}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-gray-400 capitalize">
                        {song.mood}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-center text-gray-500">
                        {formatTime(song.duration)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          {user && (
                            <button
                              onClick={(e) => handleLikeToggle(song._id, e)}
                              className={`p-1.5 hover:bg-dark-600 rounded-full transition-colors ${isSongLiked ? 'text-brand-pink' : 'text-gray-500 hover:text-white'}`}
                              title={isSongLiked ? 'Unlike' : 'Like'}
                            >
                              <FiHeart className={isSongLiked ? 'fill-current' : ''} />
                            </button>
                          )}
                          {isOwner && (
                            <button
                              onClick={(e) => handleRemoveSong(song._id, e)}
                              className="p-1.5 hover:bg-rose-950/40 text-gray-500 hover:text-rose-400 rounded-full transition-colors"
                              title="Remove from Playlist"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Details Overlay Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel max-w-md w-full p-8 rounded-3xl border border-dark-500"
            >
              <h2 className="font-display font-bold text-xl mb-4 bg-brand-gradient bg-clip-text text-transparent">
                Edit Playlist Details
              </h2>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2 block">
                    Playlist Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Playlist name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full glass-input px-4 py-3 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2 block">
                    Description (Optional)
                  </label>
                  <textarea
                    placeholder="Give your playlist a cool description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full glass-input px-4 py-3 rounded-xl text-sm h-24 resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2 block">
                    Cover Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="w-full glass-input px-4 py-3 rounded-xl text-sm"
                  />
                </div>
                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl border border-dark-500 text-gray-400 hover:text-white font-semibold text-sm transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary text-sm py-3"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlaylistDetails;
