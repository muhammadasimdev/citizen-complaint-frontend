// src/services/authService.js
import api from './api';
import { appConfig } from '../config/appConfig';

export const authService = {
  // Register User
  async register(userData) {
    const response = await api.post(appConfig.api.endpoints.register, userData);
    const token = response.data.token;
    if (token) {
      localStorage.setItem('token', token);
    }
    const user = response.data.user;
    if (user) {
      localStorage.setItem('user_data', JSON.stringify(user));
    }
    return response.data;
  },

  // Login User
  async login(credentials) {
    const response = await api.post(appConfig.api.endpoints.login, credentials);
    const token = response.data.token;
    if (token) {
      localStorage.setItem('token', token);
    }
    const user = response.data.user;
    if (user) {
      localStorage.setItem('user_data', JSON.stringify(user));
    }
    return response.data;
  },

  // Get Logged-in User Profile
  async getProfile() {
    const response = await api.get(appConfig.api.endpoints.profile);
    return response.data;
  },

  // Update User Profile
  async updateProfile(profileData) {
    const response = await api.put(appConfig.api.endpoints.profile, profileData);
    return response.data;
  },

  // Get cached user from localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem('user_data');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  // Logout User
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
  }
};