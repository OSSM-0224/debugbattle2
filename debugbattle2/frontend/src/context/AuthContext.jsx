import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('/users/profile');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile', error);
        // Sirf unauthorized hone par logout kare
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
        }
      }
    }
    setLoading(false);
  };

  fetchUser();
}, []);

  const login = async (email, password) => {
    const response = await axios.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    setUser(response.data);
  };

  const register = async (username, email, password) => {
    const response = await axios.post('/auth/register', { username, email, password });
    localStorage.setItem('token', response.data.token);
    setUser(response.data);
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (e) {
      console.error('Logout error', e);
    }
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
