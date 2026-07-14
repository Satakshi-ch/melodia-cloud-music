import express from 'express';
import {
  getSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong,
  toggleLikeSong,
} from '../controllers/songController.js';
import { logPlayHistory } from '../controllers/smartPlaylistController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { uploadCatalog } from '../config/cloudinary.js';

const router = express.Router();

// Public routes
router.get('/', getSongs);
router.get('/:id', getSongById);

// Protected routes (Admin only)
router.post(
  '/',
  protect,
  admin,
  uploadCatalog.fields([
    { name: 'audioFile', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  createSong
);

router.put(
  '/:id',
  protect,
  admin,
  uploadCatalog.fields([
    { name: 'audioFile', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  updateSong
);

router.delete('/:id', protect, admin, deleteSong);

// Protected routes (Any logged-in user)
router.post('/like/:songId', protect, toggleLikeSong);
router.post('/play/:songId', protect, logPlayHistory);

export default router;
