import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { mockDb } from '../utils/mockDb.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'melodia_secret_key_123');

      // Check if running in mock database mode
      if (global.useMockDB) {
        const mockUser = mockDb.getUserById(decoded.id);
        if (!mockUser) {
          return res.status(401).json({ success: false, message: 'User not found in mock DB' });
        }
        req.user = mockUser;
      } else {
        // Get user from the token, exclude password
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
          return res.status(401).json({ success: false, message: 'User not found' });
        }
      }

      next();
    } catch (error) {
      console.error('Authentication Error:', error);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Admin only' });
  }
};
