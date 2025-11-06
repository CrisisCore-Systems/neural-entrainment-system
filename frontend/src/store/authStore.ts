/**
 * Authentication Store
 * Manages user authentication state
 */

import { create } from 'zustand';
import { apiClient } from '../services/apiClient';

interface User {
  id: string;
  email: string;
  username: string;
  isVerified: boolean;
  isAdmin?: boolean;
  gatewayAccess?: boolean;
  gatewayLevel?: number;
  gatewayTrainingCompleted?: boolean;
  totalStandardSessions?: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  username: string;
  medicalDisclaimerAccepted: boolean;
  hasEpilepsy?: boolean;
  hasHeartCondition?: boolean;
  hasMentalHealthCondition?: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    const response = await apiClient.login(email, password);

    if (response.error) {
      set({ error: response.error, isLoading: false });
      return false;
    }

    set({
      user: response.data?.user || null,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });

    return true;
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });

    const response = await apiClient.register(data);

    if (response.error) {
      set({ error: response.error, isLoading: false });
      return false;
    }

    set({
      user: response.data?.user || null,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });

    return true;
  },

  logout: async () => {
    await apiClient.logout();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  checkAuth: async () => {
    const token = apiClient.getToken();
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    set({ isLoading: true });

    const response = await apiClient.getCurrentUser();

    if (response.error) {
      // Token invalid, clear it
      apiClient.setToken(null);
      set({ isAuthenticated: false, user: null, isLoading: false });
      return;
    }

    set({
      user: response.data?.user || null,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  clearError: () => set({ error: null }),
}));
