import { create } from 'zustand';
import axios from 'axios';
import { allPosts, allUsers, isAuthenticated, logout, profile, remove } from '@/lib/apiRoutes';

const useUserStore = create((set, get) => ({
  user: null,
  loading: true,
  error: null,
  posts: null,
  users: null,
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
  // Check if user is verified
  isUserVerified: () => {
    const user = get().user;
    return user?.isVerified || false;
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
  // Fetch all users
  getAllUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(allUsers);
      set({ users: response.data.users, loading: false });
    } catch (error) {
      set({ users: null, error: 'Failed to fetch users', loading: false });
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

  // Delete user
  deleteAccount: async () => {
    try {
      await axios.delete(remove);
      set({ user: null, isauthenticated: false });
    } catch (error) {
      console.error('Delete failed:', error);
      set({ error: 'Failed to delete user' });
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
    await get().getAllUsers(); // Fetch all users
  },
}));

export default useUserStore;
