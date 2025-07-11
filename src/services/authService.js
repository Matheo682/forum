import api from './api';
import Cookies from 'js-cookie';
import { AUTH_COOKIE_NAME, USER_COOKIE_NAME, COOKIE_OPTIONS } from '../constants';

class AuthService {
  // Logowanie użytkownika
  async login(credentials) {
    try {
      const response = await api.post('/user/login', credentials);
      const { access_token, user } = response.data;
      
      // Zapisanie tokena i danych użytkownika w cookies
      Cookies.set(AUTH_COOKIE_NAME, access_token, COOKIE_OPTIONS);
      Cookies.set(USER_COOKIE_NAME, JSON.stringify(user), COOKIE_OPTIONS);
      
      return { user, token: access_token };
    } catch (error) {
      throw new Error(error.message || 'Błąd podczas logowania');
    }
  }

  // Rejestracja użytkownika
  async register(userData) {
    try {
      const response = await api.post('/user/register', userData);
      // Po rejestracji automatycznie logujemy użytkownika
      return await this.login({
        email: userData.email,
        password: userData.password
      });
    } catch (error) {
      throw new Error(error.message || 'Błąd podczas rejestracji');
    }
  }

  // Wylogowanie użytkownika
  async logout() {
    try {
      await api.post('/user/logout');
    } catch (error) {
      // Błąd podczas wylogowania z API - kontynuujemy lokalne czyszczenie
    } finally {
      // Zawsze usuwamy dane lokalne
      Cookies.remove(AUTH_COOKIE_NAME);
      Cookies.remove(USER_COOKIE_NAME);
    }
  }

  // Pobieranie danych aktualnego użytkownika
  async getCurrentUser() {
    try {
      const response = await api.get('/user/me');
      const user = response.data;
      
      // Aktualizujemy dane użytkownika w cookies
      Cookies.set(USER_COOKIE_NAME, JSON.stringify(user), COOKIE_OPTIONS);
      
      return user;
    } catch (error) {
      throw new Error('Błąd podczas pobierania danych użytkownika');
    }
  }

  // Sprawdzenie czy użytkownik jest zalogowany
  isAuthenticated() {
    return !!Cookies.get(AUTH_COOKIE_NAME);
  }

  // Pobieranie tokena z cookies
  getToken() {
    return Cookies.get(AUTH_COOKIE_NAME);
  }

  // Pobieranie danych użytkownika z cookies
  getUser() {
    const userData = Cookies.get(USER_COOKIE_NAME);
    if (!userData) return null;
    try {
      return JSON.parse(userData);
    } catch (e) {
      // Jeśli nieprawidłowy JSON, usuń ciasteczko i zwróć null
      Cookies.remove(USER_COOKIE_NAME);
      return null;
    }
  }

  // Pobieranie użytkownika po ID
  async getUserById(id) {
    const response = await api.get(`/user/${id}`);
    return response.data;
  }

  // Pobieranie postów użytkownika
  async getUserPosts(id) {
    const response = await api.get(`/user/${id}/posts`);
    return response.data;
  }

  // Aktualizacja danych użytkownika
  async updateUser(id, userData) {
    const response = await api.put(`/user/${id}`, userData);
    return response.data;
  }

  // Usuwanie użytkownika
  async deleteUser(id) {
    const response = await api.delete(`/user/${id}`);
    return response.data;
  }

  // Pobieranie wszystkich użytkowników (tylko admin)
  async getAllUsers() {
    const response = await api.get('/user/all');
    return response.data;
  }
}

export default new AuthService();
