import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import categoryService from '../services/categoryService';
import { TEXTS } from '../constants';

// Akcje asynchroniczne dla kategorii

// Pobieranie wszystkich kategorii
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryService.getCategories();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Błąd podczas pobierania kategorii');
    }
  }
);

// Pobieranie kategorii po ID
export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await categoryService.getCategoryById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Błąd podczas pobierania kategorii');
    }
  }
);

// Tworzenie nowej kategorii
export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await categoryService.createCategory(categoryData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Błąd podczas tworzenia kategorii');
    }
  }
);

// Aktualizacja kategorii
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, ...categoryData }, { rejectWithValue }) => {
    try {
      const response = await categoryService.updateCategory(id, categoryData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Błąd podczas aktualizacji kategorii');
    }
  }
);

// Usuwanie kategorii
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await categoryService.deleteCategory(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Błąd podczas usuwania kategorii');
    }
  }
);

// Stan początkowy
const initialState = {
  categories: [],
  currentCategory: null,
  loading: false,
  error: null
};

// Slice dla kategorii
const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    // Czyszczenie błędów
    clearError: (state) => {
      state.error = null;
    },
    // Czyszczenie aktualnej kategorii
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Pobieranie kategorii
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Pobieranie kategorii po ID
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.currentCategory = action.payload;
      })
      
      // Tworzenie kategorii
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      
      // Aktualizacja kategorii
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        if (state.currentCategory && state.currentCategory.id === action.payload.id) {
          state.currentCategory = action.payload;
        }
      })
      
      // Usuwanie kategorii
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(cat => cat.id !== action.payload);
        if (state.currentCategory && state.currentCategory.id === action.payload) {
          state.currentCategory = null;
        }
      });
  }
});

export const { clearError, clearCurrentCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
