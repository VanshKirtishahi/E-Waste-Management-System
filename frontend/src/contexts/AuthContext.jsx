import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
// Ensure this matches your backend URL
axios.defaults.baseURL = 'http://localhost:8080'; 

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        // Set the token globally for all axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error("Failed to parse user data", error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false); // Auth check finished
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      if (response.data.accessToken) {
        const { accessToken, user } = response.data;
        
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Set header immediately for subsequent requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        setUser(user);
        return { success: true, user };
      }
      return { success: false, message: 'No access token' };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data || 'Registration failed' };
    }
  };

  const logout = () => {
    navigate('/', { replace: true });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setTimeout(() => {
      setUser(null);
    }, 100);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = { user, loading, login, register, logout, updateUser };

  return (
    <AuthContext.Provider value={value}>
      {/* FIX: This check prevents the app from rendering before the token is set */}
      {!loading && children}
    </AuthContext.Provider>
  );
};