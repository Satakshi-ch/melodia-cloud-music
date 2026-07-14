import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Song from './models/Song.js';
import User from './models/User.js';
import Playlist from './models/Playlist.js';

dotenv.config();

const songsData = [
  // Original 20 songs
  {
    title: "Night Owl",
    artist: "Broke For Free",
    genre: "Lofi",
    mood: "Chill",
    duration: 212,
    coverImage: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    likes: 12,
    playCount: 45
  },
  {
    title: "Something Elated",
    artist: "Broke For Free",
    genre: "Lofi",
    mood: "Chill",
    duration: 218,
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    likes: 8,
    playCount: 30
  },
  {
    title: "Enthusiast",
    artist: "Tours",
    genre: "Electronic",
    mood: "Hype",
    duration: 192,
    coverImage: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    likes: 25,
    playCount: 120
  },
  {
    title: "Synthwaves",
    artist: "Jahzzar",
    genre: "Electronic",
    mood: "Dark",
    duration: 372,
    coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    likes: 15,
    playCount: 88
  },
  {
    title: "Melancholy Rock",
    artist: "Kai Engel",
    genre: "Rock",
    mood: "Dark",
    duration: 425,
    coverImage: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    likes: 4,
    playCount: 22
  },
  {
    title: "Midnight Drive",
    artist: "Meydän",
    genre: "Electronic",
    mood: "Dark",
    duration: 302,
    coverImage: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    likes: 31,
    playCount: 142
  },
  {
    title: "Summer Breeze",
    artist: "Ketsa",
    genre: "Pop",
    mood: "Happy",
    duration: 302,
    coverImage: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    likes: 19,
    playCount: 65
  },
  {
    title: "Rise and Shine",
    artist: "Ketsa",
    genre: "Pop",
    mood: "Happy",
    duration: 362,
    coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    likes: 11,
    playCount: 40
  },
  {
    title: "Cyberpunk Action",
    artist: "Audiobinger",
    genre: "Electronic",
    mood: "Hype",
    duration: 504,
    coverImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    likes: 42,
    playCount: 198
  },
  {
    title: "Neon Horizon",
    artist: "Jesse Spillane",
    genre: "Pop",
    mood: "Happy",
    duration: 344,
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    likes: 9,
    playCount: 35
  },
  {
    title: "Classic Rebel",
    artist: "Jesse Spillane",
    genre: "Rock",
    mood: "Energetic",
    duration: 318,
    coverImage: "https://images.unsplash.com/photo-1487180142328-0c4e37023af5?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    likes: 13,
    playCount: 52
  },
  {
    title: "Cosmic Journey",
    artist: "Scott Holmes",
    genre: "Electronic",
    mood: "Dreamy",
    duration: 408,
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    likes: 18,
    playCount: 75
  },
  {
    title: "Ocean Whisper",
    artist: "Scott Holmes",
    genre: "Chill",
    mood: "Calm",
    duration: 432,
    coverImage: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    likes: 22,
    playCount: 94
  },
  {
    title: "Quiet Mornings",
    artist: "Kai Engel",
    genre: "Chill",
    mood: "Calm",
    duration: 396,
    coverImage: "https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    likes: 16,
    playCount: 61
  },
  {
    title: "Serenade of Rain",
    artist: "Kai Engel",
    genre: "Chill",
    mood: "Relaxed",
    duration: 540,
    coverImage: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    likes: 27,
    playCount: 110
  },
  {
    title: "Sunset Boulevard",
    artist: "Tours",
    genre: "Pop",
    mood: "Happy",
    duration: 420,
    coverImage: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
    likes: 10,
    playCount: 39
  },
  {
    title: "Electric Storm",
    artist: "Jahzzar",
    genre: "Rock",
    mood: "Energetic",
    duration: 444,
    coverImage: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
    likes: 24,
    playCount: 115
  },
  {
    title: "Heavy Grit",
    artist: "Jahzzar",
    genre: "Rock",
    mood: "Hype",
    duration: 350,
    coverImage: "https://images.unsplash.com/photo-1524567214260-904714468f1e?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
    likes: 20,
    playCount: 92
  },
  {
    title: "Lofi Dreamscape",
    artist: "Meydän",
    genre: "Lofi",
    mood: "Chill",
    duration: 320,
    coverImage: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
    likes: 35,
    playCount: 154
  },
  {
    title: "Forest Echoes",
    artist: "Audiobinger",
    genre: "Chill",
    mood: "Calm",
    duration: 280,
    coverImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    likes: 12,
    playCount: 48
  },

  // 20 new songs: DUA LIPA, TAYLOR SWIFT, LANA DEL REY HITS
  {
    title: "Levitating",
    artist: "Dua Lipa",
    genre: "Pop",
    mood: "Happy",
    duration: 203,
    coverImage: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    likes: 342,
    playCount: 1450
  },
  {
    title: "Cruel Summer",
    artist: "Taylor Swift",
    genre: "Pop",
    mood: "Happy",
    duration: 178,
    coverImage: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    likes: 520,
    playCount: 2890
  },
  {
    title: "Summertime Sadness",
    artist: "Lana Del Rey",
    genre: "Pop",
    mood: "Dark",
    duration: 265,
    coverImage: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    likes: 412,
    playCount: 1890
  },
  {
    title: "Don't Start Now",
    artist: "Dua Lipa",
    genre: "Pop",
    mood: "Hype",
    duration: 183,
    coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    likes: 290,
    playCount: 1205
  },
  {
    title: "Cardigan",
    artist: "Taylor Swift",
    genre: "Chill",
    mood: "Dreamy",
    duration: 239,
    coverImage: "https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    likes: 388,
    playCount: 1670
  },
  {
    title: "Video Games",
    artist: "Lana Del Rey",
    genre: "Chill",
    mood: "Dreamy",
    duration: 284,
    coverImage: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    likes: 304,
    playCount: 1420
  },
  {
    title: "Physical",
    artist: "Dua Lipa",
    genre: "Pop",
    mood: "Energetic",
    duration: 193,
    coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    likes: 215,
    playCount: 940
  },
  {
    title: "Blank Space",
    artist: "Taylor Swift",
    genre: "Pop",
    mood: "Energetic",
    duration: 231,
    coverImage: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    likes: 499,
    playCount: 2540
  },
  {
    title: "Born to Die",
    artist: "Lana Del Rey",
    genre: "Chill",
    mood: "Dark",
    duration: 286,
    coverImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    likes: 287,
    playCount: 1100
  },
  {
    title: "Anti-Hero",
    artist: "Taylor Swift",
    genre: "Pop",
    mood: "Calm",
    duration: 200,
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    likes: 460,
    playCount: 2190
  },
  {
    title: "Love Story",
    artist: "Taylor Swift",
    genre: "Pop",
    mood: "Happy",
    duration: 235,
    coverImage: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    likes: 610,
    playCount: 3100
  },
  {
    title: "One Kiss",
    artist: "Dua Lipa",
    genre: "Electronic",
    mood: "Happy",
    duration: 214,
    coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    likes: 312,
    playCount: 1540
  },
  {
    title: "Young and Beautiful",
    artist: "Lana Del Rey",
    genre: "Chill",
    mood: "Dreamy",
    duration: 236,
    coverImage: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
    likes: 480,
    playCount: 2300
  },
  {
    title: "New Rules",
    artist: "Dua Lipa",
    genre: "Pop",
    mood: "Hype",
    duration: 209,
    coverImage: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
    likes: 350,
    playCount: 1650
  },
  {
    title: "Shake It Off",
    artist: "Taylor Swift",
    genre: "Pop",
    mood: "Hype",
    duration: 219,
    coverImage: "https://images.unsplash.com/photo-1543791187-5b200ae7df7e?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
    likes: 540,
    playCount: 2900
  },
  {
    title: "Blue Jeans",
    artist: "Lana Del Rey",
    genre: "Chill",
    mood: "Dark",
    duration: 209,
    coverImage: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
    likes: 260,
    playCount: 990
  },
  {
    title: "Break My Heart",
    artist: "Dua Lipa",
    genre: "Pop",
    mood: "Energetic",
    duration: 221,
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    likes: 299,
    playCount: 1390
  },
  {
    title: "Style",
    artist: "Taylor Swift",
    genre: "Pop",
    mood: "Energetic",
    duration: 231,
    coverImage: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    likes: 490,
    playCount: 2450
  },
  {
    title: "Lust for Life",
    artist: "Lana Del Rey",
    genre: "Pop",
    mood: "Dreamy",
    duration: 264,
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    likes: 295,
    playCount: 1120
  },
  {
    title: "Lover",
    artist: "Taylor Swift",
    genre: "Chill",
    mood: "Calm",
    duration: 221,
    coverImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    likes: 580,
    playCount: 2980
  }
];

const seedDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/melodia';
    console.log('Connecting to database for seeding...');
    await mongoose.connect(uri);
    console.log('Database connected successfully.');

    // Clear existing collections
    console.log('Clearing existing data...');
    await Song.deleteMany({});
    console.log('Cleared songs collection.');

    await User.updateMany({}, { $set: { likedSongs: [], listeningHistory: [], playlists: [] } });
    await Playlist.deleteMany({});
    console.log('Cleared playlists and user history lists.');

    // Insert songs
    console.log('Seeding songs...');
    const insertedSongs = await Song.insertMany(songsData);
    console.log(`Successfully seeded ${insertedSongs.length} songs!`);

    // Let's create an admin account for convenience
    const adminEmail = 'admin@melodia.com';
    const adminExists = await User.findOne({ email: adminEmail });
    let adminId;
    if (!adminExists) {
      console.log('Creating default admin user...');
      const adminUser = new User({
        username: 'admin',
        email: adminEmail,
        password: 'adminpassword',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=250&auto=format&fit=crop'
      });
      const savedAdmin = await adminUser.save();
      adminId = savedAdmin._id;
      console.log('Admin account created.');
    } else {
      adminId = adminExists._id;
    }

    // Let's seed 5 default playlists using the admin user id
    console.log('Seeding starter playlists...');
    const defaultPlaylists = [
      {
        name: "Taylor Swift Essentials",
        description: "The absolute best of Taylor Swift. Includes Cruel Summer, Style, Cardigan, Lover, and Shake It Off.",
        coverImage: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=400&auto=format&fit=crop",
        songs: insertedSongs.filter(s => s.artist === "Taylor Swift").slice(0, 8).map(s => s._id),
        owner: adminId
      },
      {
        name: "Dua Lipa Dance Party",
        description: "High-tempo, energetic pop anthems by Dua Lipa. Hit play and start dancing!",
        coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop",
        songs: insertedSongs.filter(s => s.artist === "Dua Lipa").slice(0, 6).map(s => s._id),
        owner: adminId
      },
      {
        name: "Lana Del Rey Dreamscapes",
        description: "Melancholic pop, cinematic moods, and dark-dreamy tunes by Lana Del Rey.",
        coverImage: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=400&auto=format&fit=crop",
        songs: insertedSongs.filter(s => s.artist === "Lana Del Rey").slice(0, 6).map(s => s._id),
        owner: adminId
      },
      {
        name: "Pop Divas Collab",
        description: "A super-mix compiling the greatest hits from Taylor Swift, Dua Lipa, and Lana Del Rey.",
        coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400&auto=format&fit=crop",
        songs: insertedSongs.filter(s => ["Taylor Swift", "Dua Lipa", "Lana Del Rey"].includes(s.artist)).slice(0, 9).map(s => s._id),
        owner: adminId
      },
      {
        name: "Melodia Essentials",
        description: "Our handpicked catalog favorites. Includes lofi, chill waves, and pop hits.",
        coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop",
        songs: [insertedSongs[0]._id, insertedSongs[2]._id, insertedSongs[6]._id, insertedSongs[8]._id, insertedSongs[11]._id],
        owner: adminId
      }
    ];

    const savedPlaylists = await Playlist.insertMany(defaultPlaylists);
    console.log(`Successfully seeded ${savedPlaylists.length} playlists!`);

    await User.findByIdAndUpdate(adminId, {
      $push: { playlists: { $each: savedPlaylists.map(p => p._id) } }
    });

    console.log('Seeding finished successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
