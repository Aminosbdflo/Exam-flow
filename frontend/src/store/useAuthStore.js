import { create } from 'zustand';
import axios from 'axios';
import { signInWithGoogle } from '../lib/firebase';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  updateUser: (userData) => set((state) => ({ user: { ...state.user, ...userData } })),

  refreshTokens: async () => {
    try {
      const res = await api.get('/payments/my-tokens');
      set((state) => ({
        user: state.user ? { ...state.user, tokens: res.data.tokens } : state.user
      }));
      return res.data.tokens;
    } catch (error) {
      console.error('Failed to refresh tokens', error);
    }
  },

  checkAuth: async () => {
    try {
      const res = await api.get('/users/me');
      set({ user: res.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  loginWithGoogle: async () => {
    try {
      const fbUser = await signInWithGoogle();
      const idToken = await fbUser.getIdToken();
      const res = await api.post('/auth/google', { token: idToken });
      set({ user: res.data, isAuthenticated: true });
    } catch (error) {
      console.error('Google login failed', error);
      throw error;
    }
  },

  login: async (googleToken) => {
    try {
      const res = await api.post('/auth/google', { token: googleToken });
      set({ user: res.data, isAuthenticated: true });
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  },

  loginEmail: async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      set({ user: res.data, isAuthenticated: true });
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  },

  registerEmail: async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      set({ user: res.data, isAuthenticated: true });
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Logout failed', error);
    }
  }
}));

export default api;
