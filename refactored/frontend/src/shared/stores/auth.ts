/**
 * Authentication store using Zustand
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserProfile } from '../types'

interface AuthState {
  // State
  user: User | null
  profile: UserProfile | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  setUser: (user: User | null) => void
  setProfile: (profile: UserProfile | null) => void
  setAccessToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  login: (user: User, accessToken: string) => void
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      profile: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => set({ user }),

      setProfile: (profile) => set({ profile }),

      setAccessToken: (accessToken) => {
        set({ accessToken })

        // Set HTTP-only cookie for token
        if (typeof window !== 'undefined' && accessToken) {
          document.cookie = `access_token=${accessToken}; path=/; secure; samesite=lax; max-age=${
            60 * 60
          }`
        }
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      login: (user, accessToken) => {
        set({
          user,
          accessToken,
          isAuthenticated: true,
          error: null,
        })

        // Set token cookie
        if (typeof window !== 'undefined') {
          document.cookie = `access_token=${accessToken}; path=/; secure; samesite=lax; max-age=${
            60 * 60
          }`
        }
      },

      logout: () => {
        set({
          user: null,
          profile: null,
          accessToken: null,
          isAuthenticated: false,
          error: null,
        })

        // Clear token cookie
        if (typeof window !== 'undefined') {
          document.cookie =
            'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
