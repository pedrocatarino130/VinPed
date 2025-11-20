import axios, { AxiosError, AxiosInstance } from 'axios'
import { toast } from 'sonner'
import { useAuthStore } from '../store/authStore'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string; message?: string }>) => {
    const message = error.response?.data?.error || error.response?.data?.message || 'Ocorreu um erro inesperado'

    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      toast.error('Sessão expirada. Faça login novamente.')
      window.location.href = '/login'
      return Promise.reject(error)
    }

    // Handle other errors
    if (error.response?.status && error.response.status >= 400) {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

export default api
