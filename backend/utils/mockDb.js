import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const SONGS_FILE = path.join(DATA_DIR, 'songs.json');
const PLAYLISTS_FILE = path.join(DATA_DIR, 'playlists.json');

const defaultUsers = [
  {
    _id: "user_admin",
    username: "admin",
    email: "admin@melodia.com",
    password: "adminpassword",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=250&auto=format&fit=crop",
    role: "admin",
    likedSongs: [],
    playlists: ["playlist_mock_1", "playlist_mock_2", "playlist_mock_3", "playlist_mock_4", "playlist_mock_5"],
    listeningHistory: [],
    favoriteGenres: [],
    createdAt: new Date().toISOString()
  },
  {
    _id: "user_tester",
    username: "tester",
    email: "tester@melodia.com",
    password: "testpassword",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250&auto=format&fit=crop",
    role: "user",
    likedSongs: [],
    playlists: [],
    listeningHistory: [],
    favoriteGenres: [],
    createdAt: new Date().toISOString()
  }
];

const defaultSongs = [
  // Original 20 Songs
  {
    _id: "song_1",
    title: "Night Owl",
    artist: "Broke For Free",
    genre: "Lofi",
    mood: "Chill",
    duration: 212,
    coverImage: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    likes: 12,
    playCount: 45,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_2",
    title: "Something Elated",
    artist: "Broke For Free",
    genre: "Lofi",
    mood: "Chill",
    duration: 218,
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    likes: 8,
    playCount: 30,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_3",
    title: "Enthusiast",
    artist: "Tours",
    genre: "Electronic",
    mood: "Hype",
    duration: 192,
    coverImage: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    likes: 25,
    playCount: 120,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_4",
    title: "Synthwaves",
    artist: "Jahzzar",
    genre: "Electronic",
    mood: "Dark",
    duration: 372,
    coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    likes: 15,
    playCount: 88,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_5",
    title: "Melancholy Rock",
    artist: "Kai Engel",
    genre: "Rock",
    mood: "Dark",
    duration: 425,
    coverImage: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    likes: 4,
    playCount: 22,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_6",
    title: "Midnight Drive",
    artist: "Meydän",
    genre: "Electronic",
    mood: "Dark",
    duration: 302,
    coverImage: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    likes: 31,
    playCount: 142,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_7",
    title: "Summer Breeze",
    artist: "Ketsa",
    genre: "Pop",
    mood: "Happy",
    duration: 302,
    coverImage: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    likes: 19,
    playCount: 65,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_8",
    title: "Rise and Shine",
    artist: "Ketsa",
    genre: "Pop",
    mood: "Happy",
    duration: 362,
    coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    likes: 11,
    playCount: 40,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_9",
    title: "Cyberpunk Action",
    artist: "Audiobinger",
    genre: "Electronic",
    mood: "Hype",
    duration: 504,
    coverImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    likes: 42,
    playCount: 198,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_10",
    title: "Neon Horizon",
    artist: "Jesse Spillane",
    genre: "Pop",
    mood: "Happy",
    duration: 344,
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    likes: 9,
    playCount: 35,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_11",
    title: "Classic Rebel",
    artist: "Jesse Spillane",
    genre: "Rock",
    mood: "Energetic",
    duration: 318,
    coverImage: "https://images.unsplash.com/photo-1487180142328-0c4e37023af5?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    likes: 13,
    playCount: 52,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_12",
    title: "Cosmic Journey",
    artist: "Scott Holmes",
    genre: "Electronic",
    mood: "Dreamy",
    duration: 408,
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    likes: 18,
    playCount: 75,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_13",
    title: "Ocean Whisper",
    artist: "Scott Holmes",
    genre: "Chill",
    mood: "Calm",
    duration: 432,
    coverImage: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    likes: 22,
    playCount: 94,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_14",
    title: "Quiet Mornings",
    artist: "Kai Engel",
    genre: "Chill",
    mood: "Calm",
    duration: 396,
    coverImage: "https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    likes: 16,
    playCount: 61,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_15",
    title: "Serenade of Rain",
    artist: "Kai Engel",
    genre: "Chill",
    mood: "Relaxed",
    duration: 540,
    coverImage: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    likes: 27,
    playCount: 110,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_16",
    title: "Sunset Boulevard",
    artist: "Tours",
    genre: "Pop",
    mood: "Happy",
    duration: 420,
    coverImage: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
    likes: 10,
    playCount: 39,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_17",
    title: "Electric Storm",
    artist: "Jahzzar",
    genre: "Rock",
    mood: "Energetic",
    duration: 444,
    coverImage: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
    likes: 24,
    playCount: 115,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_18",
    title: "Heavy Grit",
    artist: "Jahzzar",
    genre: "Rock",
    mood: "Hype",
    duration: 350,
    coverImage: "https://images.unsplash.com/photo-1524567214260-904714468f1e?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
    likes: 20,
    playCount: 92,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_19",
    title: "Lofi Dreamscape",
    artist: "Meydän",
    genre: "Lofi",
    mood: "Chill",
    duration: 320,
    coverImage: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
    likes: 35,
    playCount: 154,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_20",
    title: "Forest Echoes",
    artist: "Audiobinger",
    genre: "Chill",
    mood: "Calm",
    duration: 280,
    coverImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    likes: 12,
    playCount: 48,
    createdAt: new Date().toISOString()
  },

  // 20 DUA LIPA, TAYLOR SWIFT, LANA DEL REY HITS
  {
    _id: "song_21",
    title: "Levitating",
    artist: "Dua Lipa",
    genre: "Pop",
    mood: "Happy",
    duration: 203,
    coverImage: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    likes: 342,
    playCount: 1450,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_22",
    title: "Cruel Summer",
    artist: "Taylor Swift",
    genre: "Pop",
    mood: "Happy",
    duration: 178,
    coverImage: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    likes: 520,
    playCount: 2890,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_23",
    title: "Summertime Sadness",
    artist: "Lana Del Rey",
    genre: "Pop",
    mood: "Dark",
    duration: 265,
    coverImage: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    likes: 412,
    playCount: 1890,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_24",
    title: "Don't Start Now",
    artist: "Dua Lipa",
    genre: "Pop",
    mood: "Hype",
    duration: 183,
    coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    likes: 290,
    playCount: 1205,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_25",
    title: "Cardigan",
    artist: "Taylor Swift",
    genre: "Chill",
    mood: "Dreamy",
    duration: 239,
    coverImage: "https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    likes: 388,
    playCount: 1670,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_26",
    title: "Video Games",
    artist: "Lana Del Rey",
    genre: "Chill",
    mood: "Dreamy",
    duration: 284,
    coverImage: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    likes: 304,
    playCount: 1420,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_27",
    title: "Physical",
    artist: "Dua Lipa",
    genre: "Pop",
    mood: "Energetic",
    duration: 193,
    coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    likes: 215,
    playCount: 940,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_28",
    title: "Blank Space",
    artist: "Taylor Swift",
    genre: "Pop",
    mood: "Energetic",
    duration: 231,
    coverImage: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    likes: 499,
    playCount: 2540,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_29",
    title: "Born to Die",
    artist: "Lana Del Rey",
    genre: "Chill",
    mood: "Dark",
    duration: 286,
    coverImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    likes: 287,
    playCount: 1100,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_30",
    title: "Anti-Hero",
    artist: "Taylor Swift",
    genre: "Pop",
    mood: "Calm",
    duration: 200,
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    likes: 460,
    playCount: 2190,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_31",
    title: "Love Story",
    artist: "Taylor Swift",
    genre: "Pop",
    mood: "Happy",
    duration: 235,
    coverImage: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    likes: 610,
    playCount: 3100,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_32",
    title: "One Kiss",
    artist: "Dua Lipa",
    genre: "Electronic",
    mood: "Happy",
    duration: 214,
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    likes: 312,
    playCount: 1540,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_33",
    title: "Young and Beautiful",
    artist: "Lana Del Rey",
    genre: "Chill",
    mood: "Dreamy",
    duration: 236,
    coverImage: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
    likes: 480,
    playCount: 2300,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_34",
    title: "New Rules",
    artist: "Dua Lipa",
    genre: "Pop",
    mood: "Hype",
    duration: 209,
    coverImage: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
    likes: 350,
    playCount: 1650,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_35",
    title: "Shake It Off",
    artist: "Taylor Swift",
    genre: "Pop",
    mood: "Hype",
    duration: 219,
    coverImage: "https://images.unsplash.com/photo-1543791187-5b200ae7df7e?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
    likes: 540,
    playCount: 2900,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_36",
    title: "Blue Jeans",
    artist: "Lana Del Rey",
    genre: "Chill",
    mood: "Dark",
    duration: 209,
    coverImage: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
    likes: 260,
    playCount: 990,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_37",
    title: "Break My Heart",
    artist: "Dua Lipa",
    genre: "Pop",
    mood: "Energetic",
    duration: 221,
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    likes: 299,
    playCount: 1390,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_38",
    title: "Style",
    artist: "Taylor Swift",
    genre: "Pop",
    mood: "Energetic",
    duration: 231,
    coverImage: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    likes: 490,
    playCount: 2450,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_39",
    title: "Lust for Life",
    artist: "Lana Del Rey",
    genre: "Pop",
    mood: "Dreamy",
    duration: 264,
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    likes: 295,
    playCount: 1120,
    createdAt: new Date().toISOString()
  },
  {
    _id: "song_40",
    title: "Lover",
    artist: "Taylor Swift",
    genre: "Chill",
    mood: "Calm",
    duration: 221,
    coverImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    likes: 580,
    playCount: 2980,
    createdAt: new Date().toISOString()
  }
];

const defaultPlaylists = [
  {
    _id: "playlist_mock_1",
    name: "Taylor Swift Essentials",
    description: "The absolute best of Taylor Swift. Includes Cruel Summer, Style, Cardigan, Lover, and Shake It Off.",
    coverImage: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=400&auto=format&fit=crop",
    songs: ["song_22", "song_25", "song_28", "song_30", "song_31", "song_35", "song_38", "song_40"],
    owner: "system",
    createdAt: new Date().toISOString()
  },
  {
    _id: "playlist_mock_2",
    name: "Dua Lipa Dance Party",
    description: "High-tempo, energetic pop anthems by Dua Lipa. Hit play and start dancing!",
    coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop",
    songs: ["song_21", "song_24", "song_27", "song_32", "song_34", "song_37"],
    owner: "system",
    createdAt: new Date().toISOString()
  },
  {
    _id: "playlist_mock_3",
    name: "Lana Del Rey Dreamscapes",
    description: "Melancholic pop, cinematic moods, and dark-dreamy tunes by Lana Del Rey.",
    coverImage: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=400&auto=format&fit=crop",
    songs: ["song_23", "song_26", "song_29", "song_33", "song_36", "song_39"],
    owner: "system",
    createdAt: new Date().toISOString()
  },
  {
    _id: "playlist_mock_4",
    name: "Pop Divas Collab",
    description: "A super-mix compiling the greatest hits from Taylor Swift, Dua Lipa, and Lana Del Rey.",
    coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop",
    songs: ["song_21", "song_22", "song_23", "song_25", "song_26", "song_28", "song_31", "song_32", "song_33"],
    owner: "system",
    createdAt: new Date().toISOString()
  },
  {
    _id: "playlist_mock_5",
    name: "Melodia Essentials",
    description: "Our handpicked catalog favorites. Includes lofi, chill waves, and pop hits.",
    coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop",
    songs: ["song_1", "song_3", "song_7", "song_9", "song_12", "song_15", "song_19", "song_22"],
    owner: "system",
    createdAt: new Date().toISOString()
  }
];

// Helper functions for reading/writing files
const readJSON = (filePath, defaultData = []) => {
  try {
    if (!fs.existsSync(filePath)) {
      writeJSON(filePath, defaultData);
      return defaultData;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading JSON mock db file:', err);
    return defaultData;
  }
};

const writeJSON = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing JSON mock db file:', err);
  }
};

export const mockDb = {
  // Songs CRUD
  getSongs: () => readJSON(SONGS_FILE, defaultSongs),
  
  getSongById: (id) => {
    const songs = readJSON(SONGS_FILE, defaultSongs);
    return songs.find(s => s._id === id);
  },

  createSong: (songData) => {
    const songs = readJSON(SONGS_FILE, defaultSongs);
    const newSong = {
      _id: 'song_' + Date.now(),
      playCount: 0,
      likes: 0,
      createdAt: new Date().toISOString(),
      ...songData
    };
    songs.push(newSong);
    writeJSON(SONGS_FILE, songs);
    return newSong;
  },

  updateSong: (id, songData) => {
    const songs = readJSON(SONGS_FILE, defaultSongs);
    const idx = songs.findIndex(s => s._id === id);
    if (idx === -1) return null;
    songs[idx] = { ...songs[idx], ...songData };
    writeJSON(SONGS_FILE, songs);
    return songs[idx];
  },

  deleteSong: (id) => {
    const songs = readJSON(SONGS_FILE, defaultSongs);
    const filtered = songs.filter(s => s._id !== id);
    writeJSON(SONGS_FILE, filtered);
    return true;
  },

  // Users CRUD
  getUsers: () => readJSON(USERS_FILE, defaultUsers),
  
  getUserById: (id) => {
    const users = readJSON(USERS_FILE, defaultUsers);
    return users.find(u => u._id === id);
  },

  getUserByEmail: (email) => {
    const users = readJSON(USERS_FILE, defaultUsers);
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  getUserByUsername: (username) => {
    const users = readJSON(USERS_FILE, defaultUsers);
    return users.find(u => u.username.toLowerCase() === username.toLowerCase());
  },

  createUser: (userData) => {
    const users = readJSON(USERS_FILE, defaultUsers);
    const newUser = {
      _id: 'user_' + Date.now(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250&auto=format&fit=crop',
      likedSongs: [],
      playlists: [],
      listeningHistory: [],
      favoriteGenres: [],
      role: 'user',
      createdAt: new Date().toISOString(),
      ...userData
    };
    if (users.length === 0 || newUser.email === 'admin@melodia.com') {
      newUser.role = 'admin';
    }
    users.push(newUser);
    writeJSON(USERS_FILE, users);
    return newUser;
  },

  updateUser: (id, userData) => {
    const users = readJSON(USERS_FILE, defaultUsers);
    const idx = users.findIndex(u => u._id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...userData };
    writeJSON(USERS_FILE, users);
    return users[idx];
  },

  // Playlists CRUD
  getPlaylists: () => {
    const playlists = readJSON(PLAYLISTS_FILE, defaultPlaylists);
    return playlists;
  },
  
  getPlaylistById: (id) => {
    const playlists = readJSON(PLAYLISTS_FILE, defaultPlaylists);
    return playlists.find(p => p._id === id);
  },

  createPlaylist: (playlistData) => {
    const playlists = readJSON(PLAYLISTS_FILE, defaultPlaylists);
    const newPlaylist = {
      _id: 'playlist_' + Date.now(),
      coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop',
      songs: [],
      createdAt: new Date().toISOString(),
      ...playlistData
    };
    playlists.push(newPlaylist);
    writeJSON(PLAYLISTS_FILE, playlists);
    return newPlaylist;
  },

  updatePlaylist: (id, playlistData) => {
    const playlists = readJSON(PLAYLISTS_FILE, defaultPlaylists);
    const idx = playlists.findIndex(p => p._id === id);
    if (idx === -1) return null;
    playlists[idx] = { ...playlists[idx], ...playlistData };
    writeJSON(PLAYLISTS_FILE, playlists);
    return playlists[idx];
  },

  deletePlaylist: (id) => {
    const playlists = readJSON(PLAYLISTS_FILE, defaultPlaylists);
    const filtered = playlists.filter(p => p._id !== id);
    writeJSON(PLAYLISTS_FILE, filtered);
    return true;
  }
};
