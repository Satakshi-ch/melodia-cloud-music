import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage configuration for cover images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'melodia/covers',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

// Storage configuration for audio files (MP3s)
const audioStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'melodia/audio',
    resource_type: 'video', // Cloudinary handles audio files under the 'video' category
    allowed_formats: ['mp3', 'wav', 'ogg', 'm4a'],
  },
});

const uploadImage = multer({ storage: imageStorage });
const uploadAudio = multer({ storage: audioStorage });

// Combine into one upload object with fields
const uploadCatalog = multer({
  storage: new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      if (file.fieldname === 'audioFile') {
        return {
          folder: 'melodia/audio',
          resource_type: 'video',
          allowed_formats: ['mp3', 'wav', 'ogg', 'm4a'],
        };
      }
      return {
        folder: 'melodia/covers',
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      };
    },
  }),
});

export { cloudinary, uploadImage, uploadAudio, uploadCatalog };
