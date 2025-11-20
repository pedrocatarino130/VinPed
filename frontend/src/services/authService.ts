import api from './api'
import type { User, UserLoginInput, UserCreateInput, AuthResponse, ApiResponse } from '@shared/types'

export const authService = {
  async login(credentials: UserLoginInput): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials)
    return response.data.data!
  },

  async register(userData: UserCreateInput): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', userData)
    return response.data.data!
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me')
    return response.data.data!
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },
}
