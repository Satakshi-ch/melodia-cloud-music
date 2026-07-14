import Song from '../models/Song.js';
import User from '../models/User.js';
import Playlist from '../models/Playlist.js';
import { mockDb } from '../utils/mockDb.js';

// @desc    Generate a smart playlist based on AI recommendations
// @route   POST /api/smart-playlist
// @access  Private
export const generateSmartPlaylist = async (req, res) => {
  try {
    const { type } = req.body;
    const userId = req.user._id;

    if (!type) {
      return res.status(400).json({ success: false, message: 'Smart playlist type is required' });
    }

    if (global.useMockDB) {
      const mockUser = mockDb.getUserById(userId);
      if (!mockUser) {
        return res.status(404).json({ success: false, message: 'User not found in mock DB' });
      }

      const allSongs = mockDb.getSongs();
      if (allSongs.length === 0) {
        return res.status(400).json({ success: false, message: 'No mock songs available' });
      }

      let selectedSongs = [];
      const likedGenres = (mockUser.likedSongs || []).map(sid => allSongs.find(s => s._id === sid)?.genre?.toLowerCase()).filter(Boolean);
      const historyGenres = (mockUser.listeningHistory || []).map(h => allSongs.find(s => s._id === h.song)?.genre?.toLowerCase()).filter(Boolean);
      const favoriteGenres = (mockUser.favoriteGenres || []).map(g => g.toLowerCase());
      const preferredGenres = [...new Set([...likedGenres, ...historyGenres, ...favoriteGenres])];

      if (type === 'Chill Vibes') {
        selectedSongs = allSongs.filter(song => {
          const mood = song.mood.toLowerCase();
          const genre = song.genre.toLowerCase();
          return mood.includes('chill') || mood.includes('calm') || genre.includes('lofi') || genre.includes('ambient') || genre.includes('indie');
        });
      } else if (type === 'Workout Mix') {
        selectedSongs = allSongs.filter(song => {
          const mood = song.mood.toLowerCase();
          const genre = song.genre.toLowerCase();
          return mood.includes('energetic') || mood.includes('hype') || genre.includes('rock') || genre.includes('electronic') || genre.includes('dance');
        });
      } else if (type === 'Night Drive') {
        selectedSongs = allSongs.filter(song => {
          const mood = song.mood.toLowerCase();
          const genre = song.genre.toLowerCase();
          return mood.includes('dark') || mood.includes('night') || genre.includes('synthwave');
        });
      } else if (type === 'Top Picks For You') {
        selectedSongs = allSongs.filter(song => {
          return preferredGenres.includes(song.genre.toLowerCase()) || (song.likes || 0) > 10;
        });
        selectedSongs.sort(() => 0.5 - Math.random());
      }

      if (selectedSongs.length === 0) {
        selectedSongs = [...allSongs].sort(() => 0.5 - Math.random()).slice(0, 8);
      } else {
        selectedSongs = selectedSongs.slice(0, 12);
      }

      const playlistName = `${type} Smart Mix`;
      let playlists = mockDb.getPlaylists();
      let playlist = playlists.find(p => p.owner === userId && p.name === playlistName);

      if (playlist) {
        playlist.songs = selectedSongs.map(s => s._id);
        playlist.description = `AI-generated smart mix based on your preferences. Last updated on ${new Date().toLocaleDateString()}.`;
        mockDb.updatePlaylist(playlist._id, { songs: playlist.songs, description: playlist.description });
      } else {
        let coverImage = 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=400&auto=format&fit=crop';
        if (type === 'Chill Vibes') {
          coverImage = 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400&auto=format&fit=crop';
        } else if (type === 'Workout Mix') {
          coverImage = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop';
        } else if (type === 'Night Drive') {
          coverImage = 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=400&auto=format&fit=crop';
        }

        const newPlaylist = mockDb.createPlaylist({
          name: playlistName,
          description: `AI-generated smart mix based on your preferences. Created on ${new Date().toLocaleDateString()}.`,
          coverImage,
          owner: userId,
          songs: selectedSongs.map(s => s._id),
        });

        // Add to user playlists list
        mockUser.playlists = mockUser.playlists || [];
        mockUser.playlists.push(newPlaylist._id);
        mockDb.updateUser(userId, { playlists: mockUser.playlists });
        
        playlist = newPlaylist;
      }

      const populatedPlaylist = {
        ...playlist,
        songs: playlist.songs.map(sid => allSongs.find(s => s._id === sid)).filter(Boolean)
      };

      return res.status(200).json({
        success: true,
        message: `Smart playlist '${playlistName}' generated!`,
        data: populatedPlaylist
      });
    }

    // Standard MongoDB path
    const user = await User.findById(userId)
      .populate('likedSongs')
      .populate({
        path: 'listeningHistory.song',
        model: 'Song'
      });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const allSongs = await Song.find({});
    if (allSongs.length === 0) {
      return res.status(400).json({ success: false, message: 'No songs available in database to compile playlist' });
    }

    let selectedSongs = [];
    const likedGenres = user.likedSongs.map(s => s.genre.toLowerCase());
    const likedMoods = user.likedSongs.map(s => s.mood.toLowerCase());
    const historyGenres = user.listeningHistory.map(h => h.song?.genre?.toLowerCase()).filter(Boolean);
    const favoriteGenres = user.favoriteGenres.map(g => g.toLowerCase());
    const preferredGenres = [...new Set([...likedGenres, ...historyGenres, ...favoriteGenres])];

    if (type === 'Chill Vibes') {
      selectedSongs = allSongs.filter(song => {
        const title = song.title.toLowerCase();
        const mood = song.mood.toLowerCase();
        const genre = song.genre.toLowerCase();
        return mood.includes('chill') || mood.includes('relax') || mood.includes('ambient') || mood.includes('calm') || mood.includes('acoustic') || genre.includes('lofi') || genre.includes('ambient') || genre.includes('indie') || title.includes('chill') || title.includes('calm');
      });
    } else if (type === 'Workout Mix') {
      selectedSongs = allSongs.filter(song => {
        const mood = song.mood.toLowerCase();
        const genre = song.genre.toLowerCase();
        return mood.includes('energetic') || mood.includes('hype') || mood.includes('workout') || mood.includes('active') || mood.includes('power') || genre.includes('rock') || genre.includes('electronic') || genre.includes('dance') || genre.includes('pop');
      });
    } else if (type === 'Night Drive') {
      selectedSongs = allSongs.filter(song => {
        const title = song.title.toLowerCase();
        const mood = song.mood.toLowerCase();
        const genre = song.genre.toLowerCase();
        return mood.includes('dark') || mood.includes('night') || mood.includes('synthwave') || mood.includes('dreamy') || genre.includes('electronic') || genre.includes('synthwave') || genre.includes('r&b') || title.includes('night') || title.includes('drive');
      });
    } else if (type === 'Top Picks For You') {
      selectedSongs = allSongs.filter(song => {
        const genre = song.genre.toLowerCase();
        return preferredGenres.includes(genre) || song.likes > 2 || song.playCount > 5;
      });
      selectedSongs.sort(() => 0.5 - Math.random());
    }

    if (selectedSongs.length === 0) {
      selectedSongs = [...allSongs].sort(() => 0.5 - Math.random()).slice(0, 8);
    } else {
      selectedSongs = selectedSongs.slice(0, 12);
    }

    const playlistName = `${type} Smart Mix`;
    let playlist = await Playlist.findOne({ owner: userId, name: playlistName });

    if (playlist) {
      playlist.songs = selectedSongs.map(s => s._id);
      playlist.description = `AI-generated smart mix based on your preferences. Last updated on ${new Date().toLocaleDateString()}.`;
      await playlist.save();
    } else {
      let coverImage = 'https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=400&auto=format&fit=crop';
      if (type === 'Chill Vibes') {
        coverImage = 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400&auto=format&fit=crop';
      } else if (type === 'Workout Mix') {
        coverImage = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop';
      } else if (type === 'Night Drive') {
        coverImage = 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=400&auto=format&fit=crop';
      }

      playlist = new Playlist({
        name: playlistName,
        description: `AI-generated smart mix based on your preferences. Created on ${new Date().toLocaleDateString()}.`,
        coverImage,
        owner: userId,
        songs: selectedSongs.map(s => s._id),
      });

      const savedPlaylist = await playlist.save();
      user.playlists.push(savedPlaylist._id);
      await user.save();
    }

    const populatedPlaylist = await Playlist.findById(playlist._id).populate('songs');

    res.status(200).json({
      success: true,
      message: `Smart playlist '${playlistName}' generated!`,
      data: populatedPlaylist
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Log track play to history
// @route   POST /api/songs/play/:songId
// @access  Private
export const logPlayHistory = async (req, res) => {
  try {
    const songId = req.params.songId;
    const userId = req.user._id;

    if (global.useMockDB) {
      const song = mockDb.getSongById(songId);
      if (!song) {
        return res.status(404).json({ success: false, message: 'Song not found in mock DB' });
      }

      // Increment play count
      song.playCount = (song.playCount || 0) + 1;
      mockDb.updateSong(songId, { playCount: song.playCount });

      const user = mockDb.getUserById(userId);
      user.listeningHistory = user.listeningHistory || [];
      user.listeningHistory = user.listeningHistory.filter(item => item.song !== songId);
      
      user.listeningHistory.unshift({
        _id: 'history_' + Date.now(),
        song: songId,
        playedAt: new Date().toISOString()
      });

      if (user.listeningHistory.length > 30) {
        user.listeningHistory = user.listeningHistory.slice(0, 30);
      }

      mockDb.updateUser(userId, { listeningHistory: user.listeningHistory });
      return res.json({ success: true, message: 'Play logged in mock DB' });
    }

    // Standard MongoDB path
    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }

    song.playCount += 1;
    await song.save();

    const user = await User.findById(userId);
    user.listeningHistory = user.listeningHistory.filter(item => item.song.toString() !== songId);
    user.listeningHistory.unshift({ song: songId, playedAt: new Date() });

    if (user.listeningHistory.length > 30) {
      user.listeningHistory = user.listeningHistory.slice(0, 30);
    }

    await user.save();

    res.json({ success: true, message: 'Play logged successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
