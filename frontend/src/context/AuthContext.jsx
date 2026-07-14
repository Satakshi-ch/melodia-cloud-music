import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user profile on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('melodia_token');
      if (token) {
        try {
          const res = await API.get('/auth/me');
          if (res.data && res.data.success) {
            setUser(res.data.data);
          } else {
            localStorage.removeItem('melodia_token');
          }
        } catch (err) {
          console.error('Error fetching session profile:', err);
          localStorage.removeItem('melodia_token');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const signup = async (username, email, password) => {
    try {
      const res = await API.post('/auth/signup', { username, email, password });
      if (res.data && res.data.success) {
        localStorage.setItem('melodia_token', res.data.data.token);
        setUser(res.data.data);
        return { success: true };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Error occurred during registration.',
      };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data && res.data.success) {
        localStorage.setItem('melodia_token', res.data.data.token);
        setUser(res.data.data);
        return { success: true };
      }
      return { success: false, message: 'Invalid response from server' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Invalid email or password.',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('melodia_token');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await API.get('/auth/me');
      if (res.data && res.data.success) {
        setUser(res.data.data);
      }
    } catch (err) {
      console.error('Failed to refresh user profile data:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
