import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/authService';
import { TEXTS } from '../constants';

// Akcje asynchroniczne dla autoryzacji

// Logowanie użytkownika
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const result = await authService.login(credentials);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Rejestracja użytkownika
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const result = await authService.register(userData);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Wylogowanie użytkownika
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return {};
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Pobieranie aktualnego użytkownika
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser();
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Stan początkowy - sprawdzenie istniejących danych w cookies
const initialState = {
  user: authService.getUser(),
  token: authService.getToken(),
  isAuthenticated: authService.isAuthenticated(),
  loading: false,
  error: null,
};

// Slice dla autoryzacji
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Czyszczenie błędów
    clearError: (state) => {
      state.error = null;
    },
    // Reset stanu autoryzacji
    resetAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Logowanie
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || TEXTS.AUTH.LOGIN_ERROR;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      
      // Rejestracja
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || TEXTS.AUTH.REGISTER_ERROR;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      
      // Wylogowanie
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        // Nawet przy błędzie wylogowujemy lokalnie
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      
      // Pobieranie aktualnego użytkownika
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Przy błędzie pobierania danych użytkownika wylogowujemy
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      });
  },
});

export const { clearError, resetAuth } = authSlice.actions;
export default authSlice.reducer;
