import Playlist from '../models/Playlist.js';
import User from '../models/User.js';
import { mockDb } from '../utils/mockDb.js';

// @desc    Create a playlist
// @route   POST /api/playlists
// @access  Private
export const createPlaylist = async (req, res) => {
  try {
    const { name, description, coverImage } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Playlist name is required' });
    }

    if (global.useMockDB) {
      const mockPlaylist = mockDb.createPlaylist({
        name,
        description,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop',
        owner: req.user._id,
        songs: [],
      });

      // Update user playlists
      const user = mockDb.getUserById(req.user._id);
      user.playlists = user.playlists || [];
      user.playlists.push(mockPlaylist._id);
      mockDb.updateUser(req.user._id, { playlists: user.playlists });

      return res.status(201).json({ success: true, data: mockPlaylist });
    }

    const playlist = new Playlist({
      name,
      description,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop',
      owner: req.user._id,
      songs: [],
    });

    const savedPlaylist = await playlist.save();

    await User.findByIdAndUpdate(req.user._id, {
      $push: { playlists: savedPlaylist._id },
    });

    res.status(201).json({ success: true, data: savedPlaylist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all playlists belonging to current user
// @route   GET /api/playlists
// @access  Private
export const getPlaylists = async (req, res) => {
  try {
    if (global.useMockDB) {
      const playlists = mockDb.getPlaylists().filter(p => p.owner === req.user._id);
      const songs = mockDb.getSongs();

      const populated = playlists.map(p => ({
        ...p,
        songs: (p.songs || []).map(sid => songs.find(s => s._id === sid)).filter(Boolean)
      }));

      return res.json({ success: true, data: populated });
    }

    const playlists = await Playlist.find({ owner: req.user._id }).populate('songs');
    res.json({ success: true, data: playlists });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get playlist by ID
// @route   GET /api/playlists/:id
// @access  Private
export const getPlaylistById = async (req, res) => {
  try {
    if (global.useMockDB) {
      const playlist = mockDb.getPlaylistById(req.params.id);
      if (!playlist) {
        return res.status(404).json({ success: false, message: 'Playlist not found in mock DB' });
      }

      if (playlist.owner !== req.user._id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized to view this playlist' });
      }

      const songs = mockDb.getSongs();
      const ownerUser = mockDb.getUserById(playlist.owner);

      const populated = {
        ...playlist,
        owner: {
          _id: ownerUser._id,
          username: ownerUser.username,
          email: ownerUser.email,
          avatar: ownerUser.avatar
        },
        songs: (playlist.songs || []).map(sid => songs.find(s => s._id === sid)).filter(Boolean)
      };

      return res.json({ success: true, data: populated });
    }

    const playlist = await Playlist.findById(req.params.id)
      .populate('songs')
      .populate('owner', 'username email avatar');

    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    if (playlist.owner._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this playlist' });
    }

    res.json({ success: true, data: playlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update playlist info
// @route   PUT /api/playlists/:id
// @access  Private
export const updatePlaylist = async (req, res) => {
  try {
    const { name, description, coverImage } = req.body;

    if (global.useMockDB) {
      const playlist = mockDb.getPlaylistById(req.params.id);
      if (!playlist) {
        return res.status(404).json({ success: false, message: 'Playlist not found in mock DB' });
      }

      if (playlist.owner !== req.user._id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized to edit this playlist' });
      }

      const updated = mockDb.updatePlaylist(req.params.id, {
        name: name || playlist.name,
        description: description !== undefined ? description : playlist.description,
        coverImage: coverImage || playlist.coverImage
      });

      return res.json({ success: true, data: updated });
    }

    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    if (playlist.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this playlist' });
    }

    playlist.name = name || playlist.name;
    playlist.description = description !== undefined ? description : playlist.description;
    playlist.coverImage = coverImage || playlist.coverImage;

    const updatedPlaylist = await playlist.save();
    res.json({ success: true, data: updatedPlaylist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete playlist
// @route   DELETE /api/playlists/:id
// @access  Private
export const deletePlaylist = async (req, res) => {
  try {
    if (global.useMockDB) {
      const playlist = mockDb.getPlaylistById(req.params.id);
      if (!playlist) {
        return res.status(404).json({ success: false, message: 'Playlist not found in mock DB' });
      }

      if (playlist.owner !== req.user._id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      mockDb.deletePlaylist(req.params.id);

      const user = mockDb.getUserById(playlist.owner);
      user.playlists = (user.playlists || []).filter(pid => pid !== req.params.id);
      mockDb.updateUser(playlist.owner, { playlists: user.playlists });

      return res.json({ success: true, message: 'Playlist deleted successfully' });
    }

    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    if (playlist.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this playlist' });
    }

    await Playlist.deleteOne({ _id: req.params.id });

    await User.findByIdAndUpdate(playlist.owner, {
      $pull: { playlists: req.params.id },
    });

    res.json({ success: true, message: 'Playlist deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add song to playlist
// @route   POST /api/playlists/:id/songs
// @access  Private
export const addSongToPlaylist = async (req, res) => {
  try {
    const { songId } = req.body;

    if (global.useMockDB) {
      const playlist = mockDb.getPlaylistById(req.params.id);
      if (!playlist) {
        return res.status(404).json({ success: false, message: 'Playlist not found in mock DB' });
      }

      if (playlist.owner !== req.user._id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      playlist.songs = playlist.songs || [];
      if (playlist.songs.includes(songId)) {
        return res.status(400).json({ success: false, message: 'Song already exists in playlist' });
      }

      playlist.songs.push(songId);
      mockDb.updatePlaylist(req.params.id, { songs: playlist.songs });

      const songs = mockDb.getSongs();
      const populated = {
        ...playlist,
        songs: playlist.songs.map(sid => songs.find(s => s._id === sid)).filter(Boolean)
      };

      return res.json({ success: true, message: 'Song added in mock DB', data: populated });
    }

    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    if (playlist.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (playlist.songs.includes(songId)) {
      return res.status(400).json({ success: false, message: 'Song already exists in playlist' });
    }

    playlist.songs.push(songId);
    await playlist.save();

    const updatedPlaylist = await Playlist.findById(req.params.id).populate('songs');

    res.json({ success: true, message: 'Song added to playlist', data: updatedPlaylist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove song from playlist
// @route   DELETE /api/playlists/:id/songs/:songId
// @access  Private
export const removeSongFromPlaylist = async (req, res) => {
  try {
    if (global.useMockDB) {
      const playlist = mockDb.getPlaylistById(req.params.id);
      if (!playlist) {
        return res.status(404).json({ success: false, message: 'Playlist not found in mock DB' });
      }

      if (playlist.owner !== req.user._id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }

      playlist.songs = (playlist.songs || []).filter(sid => sid !== req.params.songId);
      mockDb.updatePlaylist(req.params.id, { songs: playlist.songs });

      const songs = mockDb.getSongs();
      const populated = {
        ...playlist,
        songs: playlist.songs.map(sid => songs.find(s => s._id === sid)).filter(Boolean)
      };

      return res.json({ success: true, message: 'Song removed in mock DB', data: populated });
    }

    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }

    if (playlist.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    playlist.songs.pull(req.params.songId);
    await playlist.save();

    const updatedPlaylist = await Playlist.findById(req.params.id).populate('songs');

    res.json({ success: true, message: 'Song removed from playlist', data: updatedPlaylist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
