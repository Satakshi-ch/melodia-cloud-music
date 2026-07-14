import Song from '../models/Song.js';
import { mockDb } from '../utils/mockDb.js';

// @desc    Search songs
// @route   GET /api/search
// @access  Public
export const searchSongs = async (req, res) => {
  try {
    const { q, artist, genre, mood, duration } = req.query;

    if (global.useMockDB) {
      let filtered = mockDb.getSongs();

      if (q) {
        const keyword = q.toLowerCase();
        filtered = filtered.filter(song => 
          song.title.toLowerCase().includes(keyword) ||
          song.artist.toLowerCase().includes(keyword) ||
          song.genre.toLowerCase().includes(keyword) ||
          song.mood.toLowerCase().includes(keyword)
        );
      }

      if (artist) {
        const keyword = artist.toLowerCase();
        filtered = filtered.filter(song => song.artist.toLowerCase().includes(keyword));
      }

      if (genre) {
        const keyword = genre.toLowerCase();
        filtered = filtered.filter(song => song.genre.toLowerCase().includes(keyword));
      }

      if (mood) {
        const keyword = mood.toLowerCase();
        filtered = filtered.filter(song => song.mood.toLowerCase().includes(keyword));
      }

      if (duration) {
        if (duration === 'short') {
          filtered = filtered.filter(song => song.duration < 180);
        } else if (duration === 'medium') {
          filtered = filtered.filter(song => song.duration >= 180 && song.duration <= 300);
        } else if (duration === 'long') {
          filtered = filtered.filter(song => song.duration > 300);
        }
      }

      return res.json({ success: true, data: filtered });
    }

    // Standard MongoDB path
    let query = {};

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { artist: { $regex: q, $options: 'i' } },
        { genre: { $regex: q, $options: 'i' } },
        { mood: { $regex: q, $options: 'i' } },
      ];
    }

    if (artist) {
      query.artist = { $regex: artist, $options: 'i' };
    }

    if (genre) {
      query.genre = { $regex: genre, $options: 'i' };
    }

    if (mood) {
      query.mood = { $regex: mood, $options: 'i' };
    }

    if (duration) {
      if (duration === 'short') {
        query.duration = { $lt: 180 };
      } else if (duration === 'medium') {
        query.duration = { $gte: 180, $lte: 300 };
      } else if (duration === 'long') {
        query.duration = { $gt: 300 };
      }
    }

    const songs = await Song.find(query);
    res.json({ success: true, data: songs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
