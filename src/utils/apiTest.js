import api from '../services/api';
import Cookies from 'js-cookie';
import { AUTH_COOKIE_NAME } from '../constants';

// Funkcja testowa do sprawdzenia połączenia z API
export const testApiConnection = async () => {
  try {
    console.log('Testing API connection...');
    
    // Sprawdź token
    const token = Cookies.get(AUTH_COOKIE_NAME);
    console.log('Auth token present:', !!token);
    console.log('Token preview:', token ? `${token.substring(0, 20)}...` : 'none');
    
    // Test podstawowego endpointu
    const response = await api.get('/posts/all?limit=1');
    console.log('API connection test successful:', response.status);
    return true;
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
};

// Funkcja testowa do sprawdzenia tworzenia minimalnego posta
export const testCreateMinimalPost = async () => {
  try {
    console.log('Testing minimal post creation...');
    
    const testPostData = {
      title: `Test Post ${new Date().getTime()}`,
      head: 'This is a test post head content.',
      body: 'This is a test post body content. It contains some text to ensure the minimum length requirement is met.'
    };
    
    console.log('Sending test post:', testPostData);
    
    const response = await api.post('/posts', testPostData);
    console.log('Test post creation successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Test post creation failed:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return false;
  }
};

// Funkcja do sprawdzenia czy użytkownik jest prawidłowo zalogowany
export const testAuthStatus = async () => {
  try {
    console.log('Testing auth status...');
    
    // Sprawdź profil użytkownika lub inny endpoint wymagający autoryzacji
    const response = await api.get('/user/profile'); // jeśli taki endpoint istnieje
    console.log('Auth test successful:', response.data);
    return true;
  } catch (error) {
    console.error('Auth test failed:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return false;
  }
};

// Dodaj funkcje do window dla łatwego testowania w konsoli
if (typeof window !== 'undefined') {
  window.apiTest = {
    testApiConnection,
    testCreateMinimalPost,
    testAuthStatus
  };
}
