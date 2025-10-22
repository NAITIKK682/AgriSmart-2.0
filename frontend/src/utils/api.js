import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// API endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleAuth: (data) => api.post('/auth/google', data),
}

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
}

export const weatherAPI = {
  getWeather: (location) => api.get('/weather', { params: { location } }),
}

export const diseaseAPI = {
  detectDisease: (formData) => api.post('/disease/detect', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getHistory: () => api.get('/disease/history'),
}

export const marketplaceAPI = {
  getProducts: (params) => api.get('/products', { params }),
  createProduct: (data) => api.post('/products', data),
  getProduct: (id) => api.get(`/products/${id}`),
}

export const tipsAPI = {
  getTips: (params) => api.get('/tips', { params }),
  getTip: (id) => api.get(`/tips/${id}`),
}

export const schemesAPI = {
  getSchemes: (params) => api.get('/schemes', { params }),
}

export const forumAPI = {
  getPosts: (params) => api.get('/forum/posts', { params }),
  createPost: (data) => api.post('/forum/posts', data),
  getComments: (postId) => api.get(`/forum/posts/${postId}/comments`),
  addComment: (postId, data) => api.post(`/forum/posts/${postId}/comments`, data),
}

export const aiAPI = {
  chat: (data) => api.post('/ai/chat', data),
  getChatHistory: () => api.get('/ai/chat/history'),
}

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
}