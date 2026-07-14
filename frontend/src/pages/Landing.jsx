import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlay, FiMusic, FiCpu, FiCompass, FiCloud, FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import API from '../services/api';

const Landing = () => {
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);

  // Fetch trending songs for the landing page preview
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await API.get('/songs');
        if (res.data && res.data.success) {
          // Take top 4 songs based on plays or likes
          const sorted = res.data.data
            .sort((a, b) => b.playCount - a.playCount)
            .slice(0, 4);
          setSongs(sorted);
        }
      } catch (err) {
        console.error('Error fetching trending songs for landing preview:', err);
      }
    };
    fetchTrending();
  }, []);

  const features = [
    {
      icon: <FiCpu className="w-6 h-6 text-pink-400" />,
      title: "AI Smart Playlists",
      desc: "Automatically compile thematic soundscapes (Chill, Workout, Night Drive) matching your mood, history, and favorite genres."
    },
    {
      icon: <FiCloud className="w-6 h-6 text-purple-400" />,
      title: "Cloud uploads",
      desc: "Admin catalogs are stored instantly inside secure Cloudinary audio networks with lossless quality optimization."
    },
    {
      icon: <FiCompass className="w-6 h-6 text-fuchsia-400" />,
      title: "Seamless Discovery",
      desc: "Filter music instantly by artists, genres, mood boards, or play duration using our optimized backend search query."
    }
  ];

  return (
    <div className="bg-black min-h-screen relative overflow-hidden">
      {/* Decorative Radial Background Lights */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-purple/10 blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-pink/10 blur-[120px] pointer-events-none animate-pulse-slow" />

      {/* Landing Header */}
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-dark-500/30 sticky top-0 bg-black/60 backdrop-blur-md z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center shadow-brand-neon">
            <span className="text-xl">🎵</span>
          </div>
          <span className="font-display font-bold text-lg tracking-wider bg-brand-gradient bg-clip-text text-transparent">
            MELODIA
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link to="/signup" className="btn-primary text-xs py-2 px-5 font-semibold">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/30 border border-purple-800/40 text-xs font-semibold text-brand-purple tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-brand-glow animate-ping" />
            Vibe Companion v1.0
          </div>
          <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-tight text-white tracking-tight">
            Elevate Your Music Streaming with <span className="bg-brand-gradient bg-clip-text text-transparent text-glow">Smart AI</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Melodia combines lossless cloud audio streaming with smart recommendation engines that build custom playlists tailored precisely to your mood.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/signup" className="btn-primary py-3.5 px-8 text-sm flex items-center gap-2">
              <FiPlay className="fill-current w-4 h-4" /> Start Listening Free
            </Link>
            <Link to="/explore" className="px-8 py-3.5 rounded-full border border-dark-500 hover:border-brand-purple text-sm text-gray-300 hover:text-white font-semibold transition-all">
              Explore Catalog
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Trending Songs Preview */}
      {songs.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl text-white">Trending on Melodia</h2>
            <p className="text-gray-500 text-sm mt-2">The most popular tracks streamed by our listeners this week.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {songs.map((song) => (
              <div
                key={song._id}
                onClick={() => navigate('/login')}
                className="glass-card rounded-2xl p-4 flex flex-col relative group cursor-pointer"
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-4 bg-dark-600 border border-dark-500">
                  <img
                    src={song.coverImage}
                    alt={song.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-lg">
                      <FiPlay className="fill-current w-4 h-4 translate-x-[1px]" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white truncate">{song.title}</h4>
                  <p className="text-xs text-gray-400 truncate mt-1">{song.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-dark-500/20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl text-white">Packed with Premium Features</h2>
          <p className="text-gray-500 text-sm mt-2">We built a modern music streaming ecosystem designed for audiophiles.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <div key={idx} className="glass-panel p-8 rounded-3xl border border-dark-500 flex flex-col items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-dark-600 flex items-center justify-center border border-dark-500">
                {feat.icon}
              </div>
              <h3 className="font-display font-semibold text-lg text-white">{feat.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-dark-500/20 relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl text-white">What Our Streamers Say</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="glass-panel p-6 rounded-2xl border border-dark-500 italic text-gray-300">
            "The AI Smart Playlist generator is insane. I liked 3 electronic songs, clicked Workout Mix, and it compiled a flawless energetic training playlist in seconds."
            <p className="text-right text-xs font-bold font-display text-brand-purple not-italic mt-4">— Alex K., Runner</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl border border-dark-500 italic text-gray-300">
            "I love the clean interface. No bloated ads or popups. The player deck is gorgeous, and Howler.js ensures smooth playback even on weak mobile connections."
            <p className="text-right text-xs font-bold font-display text-brand-pink not-italic mt-4">— Sarah M., Designer</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center relative z-10">
        <div className="glass-panel p-12 rounded-3xl border border-dark-500 relative overflow-hidden bg-brand-gradient">
          <div className="absolute inset-0 bg-black/40 z-0" />
          <div className="relative z-10 space-y-6">
            <h2 className="font-display font-extrabold text-4xl text-white tracking-tight">
              Ready to Vibe with Melodia?
            </h2>
            <p className="text-gray-200 max-w-lg mx-auto font-medium text-sm">
              Create an account and start seeding your music companion today. Unlock intelligent recommendations, liked libraries, and custom playlist creation.
            </p>
            <div className="pt-2">
              <Link to="/signup" className="bg-white text-black font-extrabold px-8 py-3.5 rounded-full hover:scale-105 transition-transform inline-block shadow-lg">
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-8 border-t border-dark-500/20 text-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} Melodia – Cloud Music & Smart Playlist Companion. All rights reserved.</p>
        <p className="mt-2 text-gray-600">Created with React 19, Express, Cloudinary & MongoDB.</p>
      </footer>
    </div>
  );
};

export default Landing;
