import { create } from 'zustand';
import axios from 'axios';
import { allPosts, isAuthenticated, logout, profile } from '@/lib/apiRoutes';

const useUserStore = create((set, get) => ({
  user: null,
  loading: true,
  error: null,
  posts: null,
  isauthenticated: false,

  // Fetch user
  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(profile);
      set({ user: response.data.user.user, loading: false });
    } catch (error) {
      set({ user: null, error: 'Failed to fetch user', loading: false });
    }
  },

  // Fetch all posts
  fetchAllPosts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(allPosts);
      set({ posts: response.data.posts, loading: false });
    } catch (error) {
      set({ posts: null, error: 'Failed to fetch posts', loading: false });
    }
  },

  // Set user manually
  setUser: (user) => {
    set({ user });
  },

  // Logout
  logout: async () => {
    try {
      await axios.post(logout);
      set({ user: null, isauthenticated: false });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  },

  // Check authentication
  isAuthenticated: async () => {
    try {
      const response = await axios.get(isAuthenticated);
      set({ isauthenticated: response.data.success });
    } catch (error) {
      console.error('isAuthenticated failed:', error);
      set({ isauthenticated: false });
    }
  },

  // **REFRESH FUNCTION: Reloads user & posts**
  refreshData: async () => {
    await get().fetchUser(); // Fetch user data
    await get().fetchAllPosts(); // Fetch all posts
  },
}));

export default useUserStore;
