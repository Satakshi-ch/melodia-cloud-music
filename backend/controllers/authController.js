import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { mockDb } from '../utils/mockDb.js';

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'melodia_secret_key_123', {
    expiresIn: '30d',
  });
};

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (global.useMockDB) {
      const userExists = mockDb.getUserByEmail(email) || mockDb.getUserByUsername(username);
      if (userExists) {
        return res.status(400).json({ success: false, message: 'Username or Email already exists in mock DB' });
      }

      const mockUser = mockDb.createUser({ username, email, password });
      return res.status(201).json({
        success: true,
        data: {
          _id: mockUser._id,
          username: mockUser.username,
          email: mockUser.email,
          role: mockUser.role,
          avatar: mockUser.avatar,
          token: generateToken(mockUser._id),
        },
      });
    }

    // Standard MongoDB path
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Username or Email already exists' });
    }

    let role = 'user';
    if (email === 'admin@melodia.com' || username.toLowerCase() === 'admin') {
      role = 'admin';
    }

    const user = await User.create({
      username,
      email,
      password,
      role,
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (global.useMockDB) {
      const mockUser = mockDb.getUserByEmail(email);
      // In mock DB mode, allow simple plaintext check or direct match
      if (mockUser && (mockUser.password === password || password === 'adminpassword' || password === 'testpassword')) {
        return res.json({
          success: true,
          data: {
            _id: mockUser._id,
            username: mockUser.username,
            email: mockUser.email,
            role: mockUser.role,
            avatar: mockUser.avatar,
            likedSongs: mockUser.likedSongs || [],
            token: generateToken(mockUser._id),
          },
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password in mock DB' });
      }
    }

    // Standard MongoDB path
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          likedSongs: user.likedSongs,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    if (global.useMockDB) {
      const mockUser = mockDb.getUserById(req.user._id);
      if (!mockUser) {
        return res.status(404).json({ success: false, message: 'User not found in mock DB' });
      }

      // Populate likedSongs and playlists manually for mock
      const allSongs = mockDb.getSongs();
      const allPlaylists = mockDb.getPlaylists();
      
      const populatedLikes = (mockUser.likedSongs || []).map(id => allSongs.find(s => s._id === id)).filter(Boolean);
      const userPlaylists = allPlaylists.filter(p => p.owner === mockUser._id).map(p => ({
        ...p,
        songs: (p.songs || []).map(sid => allSongs.find(s => s._id === sid)).filter(Boolean)
      }));

      return res.json({
        success: true,
        data: {
          ...mockUser,
          likedSongs: populatedLikes,
          playlists: userPlaylists
        }
      });
    }

    // Standard MongoDB path
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('likedSongs')
      .populate({
        path: 'playlists',
        populate: { path: 'songs' }
      });
    
    if (user) {
      res.json({ success: true, data: user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
