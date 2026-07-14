import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const { user, refreshUser } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);

  // Load user playlists when user logs in
  useEffect(() => {
    if (user) {
      fetchPlaylists();
    } else {
      setPlaylists([]);
    }
  }, [user]);

  const fetchPlaylists = async () => {
    setLoadingPlaylists(true);
    try {
      const res = await API.get('/playlists');
      if (res.data && res.data.success) {
        setPlaylists(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching playlists:', err);
    } finally {
      setLoadingPlaylists(false);
    }
  };

  const createPlaylist = async (name, description, coverImage) => {
    try {
      const res = await API.post('/playlists', { name, description, coverImage });
      if (res.data && res.data.success) {
        setPlaylists([...playlists, res.data.data]);
        refreshUser();
        return { success: true, data: res.data.data };
      }
      return { success: false, message: 'Could not create playlist' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Error creating playlist.',
      };
    }
  };

  const updatePlaylist = async (id, name, description, coverImage) => {
    try {
      const res = await API.put(`/playlists/${id}`, { name, description, coverImage });
      if (res.data && res.data.success) {
        setPlaylists(playlists.map(p => p._id === id ? res.data.data : p));
        return { success: true, data: res.data.data };
      }
      return { success: false, message: 'Failed to update playlist' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Error updating playlist.',
      };
    }
  };

  const deletePlaylist = async (id) => {
    try {
      const res = await API.delete(`/playlists/${id}`);
      if (res.data && res.data.success) {
        setPlaylists(playlists.filter(p => p._id !== id));
        refreshUser();
        return { success: true };
      }
      return { success: false, message: 'Failed to delete playlist' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Error deleting playlist.',
      };
    }
  };

  const addSongToPlaylist = async (playlistId, songId) => {
    try {
      const res = await API.post(`/playlists/${playlistId}/songs`, { songId });
      if (res.data && res.data.success) {
        setPlaylists(playlists.map(p => p._id === playlistId ? res.data.data : p));
        return { success: true, message: 'Song added to playlist!' };
      }
      return { success: false, message: 'Could not add song' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Error adding song to playlist.',
      };
    }
  };

  const removeSongFromPlaylist = async (playlistId, songId) => {
    try {
      const res = await API.delete(`/playlists/${playlistId}/songs/${songId}`);
      if (res.data && res.data.success) {
        setPlaylists(playlists.map(p => p._id === playlistId ? res.data.data : p));
        return { success: true, message: 'Song removed from playlist!' };
      }
      return { success: false, message: 'Could not remove song' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Error removing song.',
      };
    }
  };

  const toggleLikeSong = async (songId) => {
    if (!user) return { success: false, message: 'Login required' };
    try {
      const res = await API.post(`/songs/like/${songId}`);
      if (res.data && res.data.success) {
        refreshUser(); // Re-fetch user profile (updating likedSongs)
        return { success: true, isLiked: res.data.data.isLiked };
      }
      return { success: false, message: 'Failed to like song' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Error toggling like.',
      };
    }
  };

  // Triggers backend Smart Playlist recommendation system
  const generateSmartPlaylist = async (type) => {
    try {
      const res = await API.post('/smart-playlist', { type });
      if (res.data && res.data.success) {
        // Refresh local playlist array
        await fetchPlaylists();
        refreshUser();
        return { success: true, data: res.data.data };
      }
      return { success: false, message: 'Failed to generate playlist' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Error generating smart playlist.',
      };
    }
  };

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        loadingPlaylists,
        fetchPlaylists,
        createPlaylist,
        updatePlaylist,
        deletePlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        toggleLikeSong,
        generateSmartPlaylist,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylists = () => useContext(PlaylistContext);
