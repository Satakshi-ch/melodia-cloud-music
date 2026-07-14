import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FiSearch, FiChevronDown, FiLogOut, FiUser, FiGrid } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [searchVal, setSearchVal] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Sync input value with URL search params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchVal(query);
    } else if (location.pathname !== '/search') {
      setSearchVal('');
    }
  }, [location]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchVal(val);
    if (val.trim()) {
      navigate(`/search?q=${encodeURIComponent(val)}`);
    } else {
      navigate('/search');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-20 bg-dark-900/60 backdrop-blur-md px-6 md:px-8 flex items-center justify-between border-b border-dark-500 sticky top-0 z-40">
      {/* Search Input Bar (Visible only when authenticated) */}
      <div className="flex-1 max-w-md">
        {user && (
          <div className="relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-purple transition-colors w-4 h-4" />
            <input
              type="text"
              placeholder="Search songs, artists, genres, moods..."
              value={searchVal}
              onChange={handleSearchChange}
              className="w-full glass-input pl-12 pr-4 py-2.5 rounded-full text-sm font-medium focus:bg-dark-600/80 transition-colors"
            />
          </div>
        )}
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 px-3 py-1.5 rounded-full hover:bg-dark-600/50 border border-dark-500 transition-colors"
            >
              <img
                src={user.avatar}
                alt={user.username}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-purple-500"
              />
              <span className="text-sm font-display font-medium text-gray-200 hidden sm:inline">
                {user.username}
              </span>
              <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-52 bg-dark-700/90 backdrop-blur-xl border border-dark-500 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-dark-500 mb-1">
                  <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase">Signed in as</p>
                  <p className="text-sm font-bold text-white truncate mt-0.5">{user.username}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold tracking-widest text-brand-pink bg-pink-900/30 border border-pink-800/30 px-1.5 py-0.5 rounded-md uppercase">
                    {user.role}
                  </span>
                </div>

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-600 transition-colors"
                  >
                    <FiGrid className="w-4 h-4 text-purple-400" />
                    Admin Panel
                  </Link>
                )}

                <Link
                  to="/library"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-600 transition-colors"
                >
                  <FiUser className="w-4 h-4 text-purple-400" />
                  My Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-dark-600 transition-colors border-t border-dark-500 mt-1.5 pt-2"
                >
                  <FiLogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-gray-300 hover:text-white font-semibold text-sm transition-colors">
              Log in
            </Link>
            <Link to="/signup" className="btn-primary text-xs py-2 px-5 font-semibold">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
