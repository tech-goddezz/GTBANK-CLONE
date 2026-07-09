// store/useAuthStore.ts
//
// Global state for authentication — is the user logged in, who are they, what's their token.
//
// 📚 What is Zustand?
// Imagine a box that lives outside of any component. Any screen in the app
// can reach into that box to read or update values — no prop drilling, no context boilerplate.
// That's Zustand. We define the box shape here and export a hook to access it.

import { create } from 'zustand';

import { User } from '../types';

interface AuthStore {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  // The app always starts logged out
  isLoggedIn: false,
  user: null,
  token: null,

  // Called right after the OTP is verified successfully
  login: (user, token) => set({
    isLoggedIn: true,
    user,
    token,
  }),

  // Called when the user taps Log Out in settings.
  // We wipe everything — token, user data, all of it.
  // Never leave auth data sitting in memory after a logout.
  logout: () => set({
    isLoggedIn: false,
    user: null,
    token: null,
  }),

  // For updating profile info without forcing a full re-login
  setUser: (user) => set({ user }),
}));