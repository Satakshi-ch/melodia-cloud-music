import express from 'express';
import { generateSmartPlaylist } from '../controllers/smartPlaylistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, generateSmartPlaylist);

export default router;
