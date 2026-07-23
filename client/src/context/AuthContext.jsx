import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('loop_kitchen_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.getMe();
          if (res.success) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch (error) {
          console.error('Auth verification error:', error);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.success) {
      localStorage.setItem('loop_kitchen_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (username, email, password) => {
    const res = await api.register({ username, email, password });
    if (res.success) {
      localStorage.setItem('loop_kitchen_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('loop_kitchen_token');
    setToken(null);
    setUser(null);
  };

  const updatePreferences = async (newPreferences) => {
    const res = await api.updatePreferences(newPreferences);
    if (res.success) {
      setUser((prev) => ({ ...prev, preferences: newPreferences }));
    }
    return res;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updatePreferences }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
