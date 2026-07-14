import Song from '../models/Song.js';
import User from '../models/User.js';
import { mockDb } from '../utils/mockDb.js';

// @desc    Get all songs
// @route   GET /api/songs
// @access  Public
export const getSongs = async (req, res) => {
  try {
    if (global.useMockDB) {
      const mockSongs = mockDb.getSongs();
      return res.json({ success: true, data: mockSongs });
    }

    const songs = await Song.find({});
    res.json({ success: true, data: songs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get song by ID
// @route   GET /api/songs/:id
// @access  Public
export const getSongById = async (req, res) => {
  try {
    const id = req.targetId || req.params.id;

    if (global.useMockDB) {
      const mockSong = mockDb.getSongById(id);
      if (!mockSong) {
        return res.status(404).json({ success: false, message: 'Song not found in mock DB' });
      }
      return res.json({ success: true, data: mockSong });
    }

    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }
    res.json({ success: true, data: song });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new song
// @route   POST /api/songs
// @access  Private/Admin
export const createSong = async (req, res) => {
  try {
    let { title, artist, genre, mood, duration, coverImage, audioUrl } = req.body;

    // Handle Cloudinary upload if files exist
    if (req.files) {
      if (req.files.coverImage && req.files.coverImage[0]) {
        coverImage = req.files.coverImage[0].path;
      }
      if (req.files.audioFile && req.files.audioFile[0]) {
        audioUrl = req.files.audioFile[0].path;
      }
    }

    if (!title || !artist || !genre || !mood || !audioUrl) {
      return res.status(400).json({ success: false, message: 'Title, artist, genre, mood and audio URL are required' });
    }

    if (!duration) {
      duration = 210; // Default fallback to 3.5 minutes
    }

    if (!coverImage) {
      coverImage = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop';
    }

    if (global.useMockDB) {
      const newMockSong = mockDb.createSong({
        title,
        artist,
        genre,
        mood,
        duration: Number(duration),
        coverImage,
        audioUrl,
      });
      return res.status(201).json({ success: true, data: newMockSong });
    }

    const song = new Song({
      title,
      artist,
      genre,
      mood,
      duration: Number(duration),
      coverImage,
      audioUrl,
    });

    const savedSong = await song.save();
    res.status(201).json({ success: true, data: savedSong });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update song
// @route   PUT /api/songs/:id
// @access  Private/Admin
export const updateSong = async (req, res) => {
  try {
    const { title, artist, genre, mood, duration, coverImage, audioUrl } = req.body;

    if (global.useMockDB) {
      const existing = mockDb.getSongById(req.params.id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Song not found in mock DB' });
      }

      let updatedFields = {
        title: title || existing.title,
        artist: artist || existing.artist,
        genre: genre || existing.genre,
        mood: mood || existing.mood,
        duration: duration ? Number(duration) : existing.duration,
        coverImage: coverImage || existing.coverImage,
        audioUrl: audioUrl || existing.audioUrl,
      };

      if (req.files) {
        if (req.files.coverImage && req.files.coverImage[0]) {
          updatedFields.coverImage = req.files.coverImage[0].path;
        }
        if (req.files.audioFile && req.files.audioFile[0]) {
          updatedFields.audioUrl = req.files.audioFile[0].path;
        }
      }

      const updatedMock = mockDb.updateSong(req.params.id, updatedFields);
      return res.json({ success: true, data: updatedMock });
    }

    // Standard MongoDB path
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }

    song.title = title || song.title;
    song.artist = artist || song.artist;
    song.genre = genre || song.genre;
    song.mood = mood || song.mood;
    song.duration = duration ? Number(duration) : song.duration;
    song.coverImage = coverImage || song.coverImage;
    song.audioUrl = audioUrl || song.audioUrl;

    if (req.files) {
      if (req.files.coverImage && req.files.coverImage[0]) {
        song.coverImage = req.files.coverImage[0].path;
      }
      if (req.files.audioFile && req.files.audioFile[0]) {
        song.audioUrl = req.files.audioFile[0].path;
      }
    }

    const updatedSong = await song.save();
    res.json({ success: true, data: updatedSong });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete song
// @route   DELETE /api/songs/:id
// @access  Private/Admin
export const deleteSong = async (req, res) => {
  try {
    if (global.useMockDB) {
      const existing = mockDb.getSongById(req.params.id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Song not found in mock DB' });
      }
      mockDb.deleteSong(req.params.id);
      
      // Clean likes from mock users
      const users = mockDb.getUsers();
      users.forEach(u => {
        if (u.likedSongs.includes(req.params.id)) {
          u.likedSongs = u.likedSongs.filter(sid => sid !== req.params.id);
          mockDb.updateUser(u._id, { likedSongs: u.likedSongs });
        }
      });

      return res.json({ success: true, message: 'Song removed from mock DB' });
    }

    // Standard MongoDB path
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }

    await Song.deleteOne({ _id: req.params.id });

    await User.updateMany({ likedSongs: req.params.id }, { $pull: { likedSongs: req.params.id } });

    res.json({ success: true, message: 'Song removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Like/Unlike song
// @route   POST /api/songs/like/:songId
// @access  Private
export const toggleLikeSong = async (req, res) => {
  try {
    const songId = req.params.songId;
    const userId = req.user._id;

    if (global.useMockDB) {
      const song = mockDb.getSongById(songId);
      if (!song) {
        return res.status(404).json({ success: false, message: 'Song not found in mock DB' });
      }

      const user = mockDb.getUserById(userId);
      user.likedSongs = user.likedSongs || [];
      const isLiked = user.likedSongs.includes(songId);

      if (isLiked) {
        user.likedSongs = user.likedSongs.filter(id => id !== songId);
        song.likes = Math.max(0, (song.likes || 0) - 1);
      } else {
        user.likedSongs.push(songId);
        song.likes = (song.likes || 0) + 1;
      }

      // Update in files
      mockDb.updateSong(songId, { likes: song.likes });
      
      // Calculate mock favorite genres
      const allSongs = mockDb.getSongs();
      const likedSongsObjs = user.likedSongs.map(id => allSongs.find(s => s._id === id)).filter(Boolean);
      user.favoriteGenres = [...new Set(likedSongsObjs.map(s => s.genre))];

      mockDb.updateUser(userId, { 
        likedSongs: user.likedSongs,
        favoriteGenres: user.favoriteGenres
      });

      return res.json({
        success: true,
        message: isLiked ? 'Song unliked in mock DB' : 'Song liked in mock DB',
        data: {
          isLiked: !isLiked,
          likesCount: song.likes,
          likedSongs: likedSongsObjs,
          favoriteGenres: user.favoriteGenres
        }
      });
    }

    // Standard MongoDB path
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }

    const user = await User.findById(userId);
    const isLiked = user.likedSongs.includes(song._id);

    if (isLiked) {
      user.likedSongs.pull(song._id);
      song.likes = Math.max(0, song.likes - 1);
    } else {
      user.likedSongs.push(song._id);
      song.likes += 1;
    }

    await user.save();
    await song.save();

    const populatedUser = await User.findById(userId).populate('likedSongs');
    const genres = populatedUser.likedSongs.map(s => s.genre);
    const uniqueGenres = [...new Set(genres)];
    populatedUser.favoriteGenres = uniqueGenres;
    await populatedUser.save();

    res.json({
      success: true,
      message: isLiked ? 'Song unliked' : 'Song liked',
      data: {
        isLiked: !isLiked,
        likesCount: song.likes,
        likedSongs: populatedUser.likedSongs,
        favoriteGenres: populatedUser.favoriteGenres,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
