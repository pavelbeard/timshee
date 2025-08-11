/**
 * Authentication API service
 */

import type {
  AppSettings,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  UserProfile,
} from '../types'
import { apiClient } from './client'

export const authApi = {
  /**
   * User login
   */
  login: (credentials: LoginCredentials): Promise<AuthResponse> =>
    apiClient.post('/auth/auth/login/', credentials),

  /**
   * User registration
   */
  register: (data: RegisterData): Promise<AuthResponse> =>
    apiClient.post('/auth/auth/register/', data),

  /**
   * User logout
   */
  logout: (): Promise<{ message: string }> =>
    apiClient.post('/auth/auth/logout/'),

  /**
   * Get current user profile
   */
  getProfile: (): Promise<UserProfile> => apiClient.get('/auth/profile/me/'),

  /**
   * Update user profile
   */
  updateProfile: (data: Partial<UserProfile>): Promise<UserProfile> =>
    apiClient.patch('/auth/profile/me/', data),

  /**
   * Change password
   */
  changePassword: (data: {
    old_password: string
    new_password: string
    new_password_confirm: string
  }): Promise<{ message: string }> =>
    apiClient.post('/auth/profile/change_password/', data),

  /**
   * Change language
   */
  changeLanguage: (language: string): Promise<{ message: string }> =>
    apiClient.post('/auth/profile/change_language/', { language }),

  /**
   * Refresh access token
   */
  refreshToken: (): Promise<{ access: string }> =>
    apiClient.post('/auth/token/refresh/'),

  /**
   * Verify token
   */
  verifyToken: (token: string): Promise<{ valid: boolean }> =>
    apiClient.post('/auth/token/verify/', { token }),

  /**
   * Get app settings
   */
  getSettings: (): Promise<AppSettings> => apiClient.get('/auth/settings/'),
}
