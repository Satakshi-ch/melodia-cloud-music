import mongoose from 'mongoose';

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Song title is required'],
      trim: true,
    },
    artist: {
      type: String,
      required: [true, 'Artist is required'],
      trim: true,
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      trim: true,
    },
    mood: {
      type: String,
      required: [true, 'Mood is required'],
      trim: true,
    },
    duration: {
      type: Number, // in seconds
      required: [true, 'Duration is required'],
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image is required'],
    },
    audioUrl: {
      type: String,
      required: [true, 'Audio URL is required'],
    },
    playCount: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Song = mongoose.model('Song', songSchema);
export default Song;
