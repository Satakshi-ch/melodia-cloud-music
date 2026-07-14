import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const res = await signup(username, email, password);
    setLoading(false);

    if (res.success) {
      navigate('/home');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center relative px-4 overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-[20%] right-[20%] w-[350px] h-[350px] rounded-full bg-brand-pink/15 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[20%] w-[350px] h-[350px] rounded-full bg-brand-purple/15 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-panel max-w-md w-full p-8 md:p-10 rounded-3xl border border-dark-500 z-10"
      >
        {/* Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-brand-neon mb-4">
            <span className="text-2xl animate-pulse">🎵</span>
          </div>
          <h2 className="font-display font-extrabold text-2xl text-white">Create Account</h2>
          <p className="text-gray-500 text-xs mt-1">Join Melodia and customize your sound companion</p>
        </div>

        {error && (
          <div className="bg-rose-950/40 border border-rose-800/40 text-rose-300 px-4 py-3 rounded-xl text-xs mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2 block">
              Username
            </label>
            <input
              type="text"
              required
              placeholder="vibe_curator"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full glass-input px-4 py-3 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2 block">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="vibe@melodia.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full glass-input px-4 py-3 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2 block">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full glass-input px-4 py-3 rounded-xl text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 rounded-xl text-sm font-semibold mt-4 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Get Started Free'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-purple hover:underline font-semibold">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
