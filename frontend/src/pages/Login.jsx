import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
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
      <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] rounded-full bg-brand-purple/15 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] rounded-full bg-brand-pink/15 blur-[100px] pointer-events-none" />

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
          <h2 className="font-display font-extrabold text-2xl text-white">Welcome Back</h2>
          <p className="text-gray-500 text-xs mt-1">Vibe with your personal playlist companion</p>
        </div>

        {error && (
          <div className="bg-rose-950/40 border border-rose-800/40 text-rose-300 px-4 py-3 rounded-xl text-xs mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2 block">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full glass-input px-4 py-3 rounded-xl text-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">
                Password
              </label>
            </div>
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
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-8">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand-purple hover:underline font-semibold">
            Sign up
          </Link>
        </p>

        {/* Demo Accounts Helper */}
        <div className="mt-8 pt-6 border-t border-dark-500/40 text-center">
          <p className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase mb-2">
            Demo Account Credentials
          </p>
          <div className="grid grid-cols-2 gap-3 text-[10px] text-gray-400 font-medium">
            <div className="bg-dark-600/50 p-2.5 rounded-lg border border-dark-500/30">
              <p className="text-brand-pink font-bold uppercase tracking-wider">Admin User</p>
              <p className="mt-1">admin@melodia.com</p>
              <p>adminpassword</p>
            </div>
            <div className="bg-dark-600/50 p-2.5 rounded-lg border border-dark-500/30">
              <p className="text-brand-purple font-bold uppercase tracking-wider">Normal Tester</p>
              <p className="mt-1">tester@melodia.com</p>
              <p>testpassword</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
