/**
 * Application settings store using Zustand
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppSettings } from '../types'

interface SettingsState {
  // State
  settings: AppSettings | null
  language: 'en' | 'es' | 'ru'
  theme: 'light' | 'dark' | 'system'
  isLoading: boolean
  error: string | null

  // Actions
  setSettings: (settings: AppSettings) => void
  setLanguage: (language: 'en' | 'es' | 'ru') => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Initial state
      settings: null,
      language: 'en',
      theme: 'system',
      isLoading: false,
      error: null,

      // Actions
      setSettings: (settings) => set({ settings, error: null }),

      setLanguage: (language) => set({ language }),

      setTheme: (theme) => {
        set({ theme })

        // Apply theme to document
        if (typeof window !== 'undefined') {
          const root = window.document.documentElement

          if (theme === 'dark') {
            root.classList.add('dark')
          } else if (theme === 'light') {
            root.classList.remove('dark')
          } else {
            // System theme
            const prefersDark = window.matchMedia(
              '(prefers-color-scheme: dark)'
            ).matches
            if (prefersDark) {
              root.classList.add('dark')
            } else {
              root.classList.remove('dark')
            }
          }
        }
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
      }),
    }
  )
)
