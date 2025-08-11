/**
 * Authentication hooks using TanStack Query
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '../api'
import { useAuthStore } from '../stores'
import type { LoginCredentials, RegisterData, UserProfile } from '../types'

// Query keys for consistency
export const AUTH_QUERY_KEYS = {
  profile: ['auth', 'profile'] as const,
  settings: ['auth', 'settings'] as const,
}

/**
 * Login mutation
 */
export const useLogin = () => {
  const { login: setLogin, setLoading, setError } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      setLogin(data.user, data.access)
      setLoading(false)

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.profile })
    },
    onError: (error: Error) => {
      setError(error.message)
      setLoading(false)
    },
  })
}

/**
 * Register mutation
 */
export const useRegister = () => {
  const { login: setLogin, setLoading, setError } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onMutate: () => setLoading(true),
    onSuccess: (data) => {
      setLogin(data.user, data.access)
      setLoading(false)

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.profile })
    },
    onError: (error: Error) => {
      setError(error.message)
      setLoading(false)
    },
  })
}

/**
 * Logout mutation
 */
export const useLogout = () => {
  const { logout, setLoading, setError } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onMutate: () => setLoading(true),
    onSuccess: () => {
      logout()
      setLoading(false)

      // Clear all queries
      queryClient.clear()
    },
    onError: (error: Error) => {
      setError(error.message)
      setLoading(false)
    },
  })
}

/**
 * Get user profile query
 */
export const useProfile = () => {
  const { isAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: AUTH_QUERY_KEYS.profile,
    queryFn: () => authApi.getProfile(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Update profile mutation
 */
export const useUpdateProfile = () => {
  const { setProfile, setError } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<UserProfile>) => authApi.updateProfile(data),
    onSuccess: (data) => {
      setProfile(data)

      // Update cache
      queryClient.setQueryData(AUTH_QUERY_KEYS.profile, data)
    },
    onError: (error: Error) => {
      setError(error.message)
    },
  })
}

/**
 * Change password mutation
 */
export const useChangePassword = () => {
  const { setError } = useAuthStore()

  return useMutation({
    mutationFn: (data: {
      old_password: string
      new_password: string
      new_password_confirm: string
    }) => authApi.changePassword(data),
    onError: (error: Error) => {
      setError(error.message)
    },
  })
}

/**
 * Change language mutation
 */
export const useChangeLanguage = () => {
  return useMutation({
    mutationFn: (language: string) => authApi.changeLanguage(language),
  })
}

/**
 * Get app settings query
 */
export const useAppSettings = () => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.settings,
    queryFn: () => authApi.getSettings(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
