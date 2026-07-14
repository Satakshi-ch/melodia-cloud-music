import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { 
  FiUpload, 
  FiTrash2, 
  FiEdit3, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiMusic, 
  FiFileText, 
  FiFolder,
  FiSliders
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Admin = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Fields
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [genre, setGenre] = useState('');
  const [mood, setMood] = useState('');
  const [duration, setDuration] = useState('');

  // File Upload Fields
  const [audioFile, setAudioFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  
  // URL pasting fallbacks (very helpful for testing and seeding)
  const [audioUrl, setAudioUrl] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [useUrlInput, setUseUrlInput] = useState(false);

  // UI States
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [editingSong, setEditingSong] = useState(null); // When editing, holds song object
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchSongs = async () => {
    try {
      const res = await API.get('/songs');
      if (res.data && res.data.success) {
        setSongs(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploading(true);

    try {
      let res;
      if (useUrlInput) {
        // Direct URL payload (JSON)
        res = await API.post('/songs', {
          title,
          artist,
          genre,
          mood,
          duration: duration || 210,
          coverImage: coverImageUrl,
          audioUrl,
        });
      } else {
        // Multipart form payload
        const formData = new FormData();
        formData.append('title', title);
        formData.append('artist', artist);
        formData.append('genre', genre);
        formData.append('mood', mood);
        if (duration) formData.append('duration', duration);
        
        if (audioFile) formData.append('audioFile', audioFile);
        if (coverImageFile) formData.append('coverImage', coverImageFile);

        res = await API.post('/songs', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      if (res.data && res.data.success) {
        setSuccess('Track uploaded successfully!');
        // Reset form
        setTitle('');
        setArtist('');
        setGenre('');
        setMood('');
        setDuration('');
        setAudioFile(null);
        setCoverImageFile(null);
        setAudioUrl('');
        setCoverImageUrl('');
        
        // Refresh catalog list
        fetchSongs();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred during track upload.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteSong = async (id) => {
    if (window.confirm('Are you sure you want to delete this song from the catalog?')) {
      try {
        const res = await API.delete(`/songs/${id}`);
        if (res.data && res.data.success) {
          setSongs(songs.filter(s => s._id !== id));
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete song.');
      }
    }
  };

  const handleEditClick = (song) => {
    setEditingSong(song);
    setShowEditModal(true);
  };

  const handleUpdateSong = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('title', editingSong.title);
      formData.append('artist', editingSong.artist);
      formData.append('genre', editingSong.genre);
      formData.append('mood', editingSong.mood);
      formData.append('duration', editingSong.duration);
      formData.append('coverImage', editingSong.coverImage);
      formData.append('audioUrl', editingSong.audioUrl);

      if (audioFile) formData.append('audioFile', audioFile);
      if (coverImageFile) formData.append('coverImage', coverImageFile);

      const res = await API.put(`/songs/${editingSong._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data && res.data.success) {
        setSuccess('Track updated successfully!');
        setShowEditModal(false);
        setEditingSong(null);
        setAudioFile(null);
        setCoverImageFile(null);
        fetchSongs();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update song.');
    } finally {
      setUploading(false);
    }
  };

  const genres = ['Pop', 'Rock', 'Electronic', 'Lofi', 'Chill'];
  const moods = ['Chill', 'Energetic', 'Happy', 'Dark', 'Calm', 'Relaxed', 'Dreamy', 'Hype'];

  return (
    <div className="flex-1 bg-black p-6 md:p-8 overflow-y-auto pb-32">
      <h2 className="font-display font-extrabold text-3xl text-white mb-8">Admin Catalog Control</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form Box */}
        <div className="glass-panel p-6 rounded-2xl border border-dark-500 lg:col-span-1 h-fit">
          <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
            <FiUpload className="text-brand-purple" /> Upload New Track
          </h3>

          {error && (
            <div className="bg-rose-950/40 border border-rose-800/40 text-rose-300 p-3.5 rounded-xl text-xs mb-4 flex items-center gap-2">
              <FiAlertCircle className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 p-3.5 rounded-xl text-xs mb-4 flex items-center gap-2">
              <FiCheckCircle className="flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Upload Method Toggle */}
          <div className="flex bg-dark-600 rounded-xl p-1 mb-6 border border-dark-500">
            <button
              type="button"
              onClick={() => setUseUrlInput(false)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${!useUrlInput ? 'bg-brand-gradient text-white shadow' : 'text-gray-400'}`}
            >
              Files Upload (Cloudinary)
            </button>
            <button
              type="button"
              onClick={() => setUseUrlInput(true)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${useUrlInput ? 'bg-brand-gradient text-white shadow' : 'text-gray-400'}`}
            >
              Paste URLs
            </button>
          </div>

          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Track Title</label>
              <input
                type="text" required placeholder="E.g., Moonlight Vibe" value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Artist</label>
              <input
                type="text" required placeholder="E.g., Helix Project" value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Genre</label>
                <select
                  required value={genre} onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-dark-600 border border-dark-500 rounded-xl text-xs text-gray-300 px-3.5 py-2 focus:outline-none focus:border-brand-purple"
                >
                  <option value="">Select Genre</option>
                  {genres.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Mood</label>
                <select
                  required value={mood} onChange={(e) => setMood(e.target.value)}
                  className="w-full bg-dark-600 border border-dark-500 rounded-xl text-xs text-gray-300 px-3.5 py-2 focus:outline-none focus:border-brand-purple"
                >
                  <option value="">Select Mood</option>
                  {moods.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Duration (Seconds)</label>
              <input
                type="number" placeholder="Default 210" value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
              />
            </div>

            {!useUrlInput ? (
              /* Cloudinary Multer File Uploads */
              <div className="space-y-4 pt-2">
                <div className="border border-dashed border-dark-500 hover:border-brand-purple rounded-xl p-4 transition-colors relative flex flex-col items-center justify-center text-center cursor-pointer">
                  <input
                    type="file" required accept="audio/*"
                    onChange={(e) => setAudioFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <FiMusic className="text-purple-400 w-6 h-6 mb-2" />
                  <p className="text-[10px] font-bold text-gray-300 truncate max-w-full">
                    {audioFile ? audioFile.name : 'Choose Audio File (.mp3/.wav)'}
                  </p>
                </div>

                <div className="border border-dashed border-dark-500 hover:border-brand-pink rounded-xl p-4 transition-colors relative flex flex-col items-center justify-center text-center cursor-pointer">
                  <input
                    type="file" required accept="image/*"
                    onChange={(e) => setCoverImageFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <FiUpload className="text-pink-400 w-6 h-6 mb-2" />
                  <p className="text-[10px] font-bold text-gray-300 truncate max-w-full">
                    {coverImageFile ? coverImageFile.name : 'Choose Cover Image (.jpg/.png)'}
                  </p>
                </div>
              </div>
            ) : (
              /* Direct Pasted URL Inputs */
              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Audio MP3 URL</label>
                  <input
                    type="text" required placeholder="https://example.com/song.mp3" value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Cover Image URL</label>
                  <input
                    type="text" required placeholder="https://unsplash.com/photo-..." value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
                  />
                </div>
              </div>
            )}

            <button
              type="submit" disabled={uploading}
              className="w-full btn-primary py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase mt-4 disabled:opacity-50"
            >
              {uploading ? 'Processing upload...' : 'Upload Track'}
            </button>
          </form>
        </div>

        {/* Catalog List Table Box */}
        <div className="glass-panel p-6 rounded-2xl border border-dark-500 lg:col-span-2">
          <h3 className="font-display font-bold text-lg text-white mb-6 flex items-center gap-2">
            <FiFolder className="text-brand-pink" /> Manage Catalog ({songs.length} Tracks)
          </h3>

          {loading ? (
            <p className="text-gray-500 text-xs italic">Loading catalog list...</p>
          ) : songs.length === 0 ? (
            <p className="text-gray-500 text-xs italic">No tracks in library yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-dark-500 text-gray-500 uppercase tracking-widest text-[9px] font-bold">
                    <th className="py-2.5 px-3">Title</th>
                    <th className="py-2.5 px-3">Genre</th>
                    <th className="py-2.5 px-3">Plays</th>
                    <th className="py-2.5 px-3">Likes</th>
                    <th className="py-2.5 px-3 w-20 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {songs.map((song) => (
                    <tr key={song._id} className="border-b border-dark-500/25 hover:bg-dark-600/20 text-gray-400">
                      <td className="py-3 px-3 flex items-center gap-2.5">
                        <img src={song.coverImage} className="w-7 h-7 rounded object-cover flex-shrink-0" alt="" />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-200 truncate">{song.title}</p>
                          <p className="text-[10px] text-gray-500 truncate mt-0.5">{song.artist}</p>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-300 font-semibold capitalize">{song.genre}</td>
                      <td className="py-3 px-3">{song.playCount}</td>
                      <td className="py-3 px-3">{song.likes}</td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(song)}
                            className="p-1.5 hover:bg-dark-600 text-gray-500 hover:text-white rounded"
                            title="Edit Track Details"
                          >
                            <FiEdit3 />
                          </button>
                          <button
                            onClick={() => handleDeleteSong(song._id)}
                            className="p-1.5 hover:bg-rose-950/40 text-gray-500 hover:text-rose-400 rounded"
                            title="Delete Track"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Track details Modal */}
      <AnimatePresence>
        {showEditModal && editingSong && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel max-w-md w-full p-8 rounded-3xl border border-dark-500"
            >
              <h2 className="font-display font-bold text-xl mb-4 bg-brand-gradient bg-clip-text text-transparent">
                Edit Track Details
              </h2>
              <form onSubmit={handleUpdateSong} className="space-y-4">
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Track Title</label>
                  <input
                    type="text" required value={editingSong.title}
                    onChange={(e) => setEditingSong({...editingSong, title: e.target.value})}
                    className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Artist</label>
                  <input
                    type="text" required value={editingSong.artist}
                    onChange={(e) => setEditingSong({...editingSong, artist: e.target.value})}
                    className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Genre</label>
                    <select
                      required value={editingSong.genre}
                      onChange={(e) => setEditingSong({...editingSong, genre: e.target.value})}
                      className="w-full bg-dark-600 border border-dark-500 rounded-xl text-xs text-gray-300 px-3.5 py-2 focus:outline-none"
                    >
                      {genres.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Mood</label>
                    <select
                      required value={editingSong.mood}
                      onChange={(e) => setEditingSong({...editingSong, mood: e.target.value})}
                      className="w-full bg-dark-600 border border-dark-500 rounded-xl text-xs text-gray-300 px-3.5 py-2 focus:outline-none"
                    >
                      {moods.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Duration (Seconds)</label>
                  <input
                    type="number" required value={editingSong.duration}
                    onChange={(e) => setEditingSong({...editingSong, duration: Number(e.target.value)})}
                    className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Cover Image URL</label>
                  <input
                    type="text" required value={editingSong.coverImage}
                    onChange={(e) => setEditingSong({...editingSong, coverImage: e.target.value})}
                    className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Audio MP3 URL</label>
                  <input
                    type="text" required value={editingSong.audioUrl}
                    onChange={(e) => setEditingSong({...editingSong, audioUrl: e.target.value})}
                    className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
                  />
                </div>

                {/* Optional Cloudinary replacement */}
                <div className="pt-2 border-t border-dark-500/40">
                  <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-2">Or replace files on Cloudinary</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-dashed border-dark-500 hover:border-brand-purple rounded-lg p-2.5 relative flex flex-col items-center justify-center text-center cursor-pointer">
                      <input
                        type="file" accept="audio/*"
                        onChange={(e) => setAudioFile(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <FiMusic className="text-purple-400 w-4 h-4 mb-1" />
                      <p className="text-[9px] text-gray-300 truncate max-w-full">
                        {audioFile ? audioFile.name : 'Audio File'}
                      </p>
                    </div>

                    <div className="border border-dashed border-dark-500 hover:border-brand-pink rounded-lg p-2.5 relative flex flex-col items-center justify-center text-center cursor-pointer">
                      <input
                        type="file" accept="image/*"
                        onChange={(e) => setCoverImageFile(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <FiUpload className="text-pink-400 w-4 h-4 mb-1" />
                      <p className="text-[9px] text-gray-300 truncate max-w-full">
                        {coverImageFile ? coverImageFile.name : 'Cover Art'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingSong(null);
                      setAudioFile(null);
                      setCoverImageFile(null);
                    }}
                    className="flex-1 px-4 py-3 rounded-xl border border-dark-500 text-gray-400 hover:text-white font-semibold text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary text-xs py-3"
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

export default Admin;
