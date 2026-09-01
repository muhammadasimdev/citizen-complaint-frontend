import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token && token !== 'undefined' && token !== 'null') {
        try {
          const res = await authService.getProfile();
          setUser(res.data || res.user || res);
        } catch (err) {
          authService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await authService.login(credentials);
      setUser(res.user);
      addToast('Successfully authenticated!', 'success');
      
      const role = (res.user?.role || 'citizen').toLowerCase();
      if (role === 'officer' || role === 'admin') {
        window.location.href = '/officer-dashboard';
      } else {
        window.location.href = '/my-complaints';
      }
      
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid credentials';
      addToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      await authService.register(formData);
      addToast('Registration successful! Please log in.', 'success');
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      addToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    addToast('Logged out safely.', 'info');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
