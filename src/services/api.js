import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL, AUTH_COOKIE_NAME, TEXTS } from '../constants';

// Konfiguracja głównego klienta API
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor dla automatycznego dodawania tokena autoryzacji
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get(AUTH_COOKIE_NAME);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor dla obsługi odpowiedzi i błędów
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Automatyczne wylogowanie przy błędzie 401
    if (error.response?.status === 401) {
      Cookies.remove(AUTH_COOKIE_NAME);
      Cookies.remove('forum_user_data');
      window.location.href = '/login';
    }
    
    // Obsługa różnych typów błędów z Laravel API
    let message = TEXTS.ERRORS.SERVER_ERROR;
    
    if (error.response?.data) {
      const data = error.response.data;
      
      // Obsługa błędów walidacji Laravel (422)
      if (error.response.status === 422 && data.errors) {
        const firstField = Object.keys(data.errors)[0];
        message = data.errors[firstField][0] || data.message || TEXTS.ERRORS.VALIDATION_ERROR;
      }
      // Obsługa błędów aplikacji z komunikatem
      else if (data.message) {
        // Sprawdź czy to błąd unikalności
        if (data.message.includes('users_name_unique') || data.message.includes('name') && data.message.includes('już istnieje')) {
          message = TEXTS.ERRORS.USERNAME_TAKEN;
        }
        else if (data.message.includes('users_email_unique') || data.message.includes('email') && data.message.includes('już istnieje')) {
          message = TEXTS.ERRORS.EMAIL_TAKEN;
        }
        // Obsługa innych błędów SQL
        else if (data.message.includes('SQLSTATE')) {
          if (data.message.includes('Unique violation') || data.message.includes('podwójna wartość')) {
            message = 'Podane dane są już używane przez innego użytkownika.';
          } else {
            message = TEXTS.ERRORS.DATABASE_ERROR;
          }
        }
        else {
          message = data.message;
        }
      }
      // Obsługa błędów z error field
      else if (data.error) {
        message = data.error;
      }
    }
    // Obsługa błędów sieciowych
    else if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      message = TEXTS.ERRORS.NETWORK;
    }
    // Fallback na message z error object
    else if (error.message) {
      message = error.message;
    }
    
    return Promise.reject(new Error(message));
  }
);

// Serwisy API
export const userService = {
  getUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  updateUserRole: (id, data) => api.patch(`/users/${id}/role`, data),
  toggleUserActive: (id) => api.patch(`/users/${id}/toggle-active`),
  getUserProfile: (id) => api.get(`/users/${id}/profile`),
  updateUserProfile: (id, data) => api.patch(`/users/${id}/profile`, data)
};

export const adminService = {
  moderatePost: (postId, data) => api.patch(`/admin/posts/${postId}/moderate`, data),
  getReportedPosts: () => api.get('/admin/posts/reported'),
  getSystemStats: () => api.get('/admin/stats')
};

export default api;
