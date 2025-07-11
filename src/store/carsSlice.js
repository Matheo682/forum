import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import carService from '../services/carService';
import { TEXTS } from '../constants';

// === AKCJE ASYNCHRONICZNE DLA MAREK ===

// Pobieranie wszystkich marek
export const fetchBrands = createAsyncThunk(
  'cars/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await carService.getBrands();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Błąd podczas pobierania marek');
    }
  }
);

// Pobieranie modeli dla danej marki
export const fetchBrandModels = createAsyncThunk(
  'cars/fetchBrandModels',
  async (brandId, { rejectWithValue }) => {
    try {
      const response = await carService.getBrandModels(brandId);
      return { brandId, models: response };
    } catch (error) {
      return rejectWithValue(error.message || 'Błąd podczas pobierania modeli');
    }
  }
);

// Pobieranie generacji dla danego modelu
export const fetchModelGenerations = createAsyncThunk(
  'cars/fetchModelGenerations',
  async (modelId, { rejectWithValue }) => {
    try {
      const response = await carService.getModelGenerations(modelId);
      return { modelId, generations: response };
    } catch (error) {
      return rejectWithValue(error.message || 'Błąd podczas pobierania generacji');
    }
  }
);

// === AKCJE CRUD DLA MAREK ===

// Tworzenie nowej marki
export const createBrand = createAsyncThunk(
  'cars/createBrand',
  async (brandData, { rejectWithValue }) => {
    try {
      const response = await carService.createBrand(brandData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Błąd podczas tworzenia marki');
    }
  }
);

// Aktualizacja marki
export const updateBrand = createAsyncThunk(
  'cars/updateBrand',
  async ({ id, ...brandData }, { rejectWithValue }) => {
    try {
      const response = await carService.updateBrand(id, brandData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Błąd podczas aktualizacji marki');
    }
  }
);

// Usuwanie marki
export const deleteBrand = createAsyncThunk(
  'cars/deleteBrand',
  async (id, { rejectWithValue }) => {
    try {
      await carService.deleteBrand(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Błąd podczas usuwania marki');
    }
  }
);

// === AKCJE CRUD DLA MODELI ===

// Pobieranie wszystkich modeli
export const fetchModels = createAsyncThunk(
  'cars/fetchModels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await carService.getModels();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Błąd podczas pobierania modeli');
    }
  }
);

// Tworzenie nowego modelu
export const createModel = createAsyncThunk(
  'cars/createModel',
  async (modelData, { rejectWithValue }) => {
    try {
      const response = await carService.createModel(modelData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Błąd podczas tworzenia modelu');
    }
  }
);

// Aktualizacja modelu
export const updateModel = createAsyncThunk(
  'cars/updateModel',
  async ({ id, ...modelData }, { rejectWithValue }) => {
    try {
      const response = await carService.updateModel(id, modelData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Błąd podczas aktualizacji modelu');
    }
  }
);

// Usuwanie modelu
export const deleteModel = createAsyncThunk(
  'cars/deleteModel',
  async (id, { rejectWithValue }) => {
    try {
      await carService.deleteModel(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Błąd podczas usuwania modelu');
    }
  }
);

// === AKCJE CRUD DLA GENERACJI ===

// Pobieranie wszystkich generacji
export const fetchGenerations = createAsyncThunk(
  'cars/fetchGenerations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await carService.getGenerations();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Błąd podczas pobierania generacji');
    }
  }
);

// Tworzenie nowej generacji
export const createGeneration = createAsyncThunk(
  'cars/createGeneration',
  async (generationData, { rejectWithValue }) => {
    try {
      const response = await carService.createGeneration(generationData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Błąd podczas tworzenia generacji');
    }
  }
);

// Aktualizacja generacji
export const updateGeneration = createAsyncThunk(
  'cars/updateGeneration',
  async ({ id, ...generationData }, { rejectWithValue }) => {
    try {
      const response = await carService.updateGeneration(id, generationData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Błąd podczas aktualizacji generacji');
    }
  }
);

// Usuwanie generacji
export const deleteGeneration = createAsyncThunk(
  'cars/deleteGeneration',
  async (id, { rejectWithValue }) => {
    try {
      await carService.deleteGeneration(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Błąd podczas usuwania generacji');
    }
  }
);

// Stan początkowy
const initialState = {
  brands: [],
  models: [],
  generations: [],
  brandModels: {}, // Modele pogrupowane po markach
  modelGenerations: {}, // Generacje pogrupowane po modelach
  loading: false,
  error: null
};

// Slice dla pojazdów
const carsSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    // Czyszczenie błędów
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // === MARKI ===
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Tworzenie marki
      .addCase(createBrand.fulfilled, (state, action) => {
        state.brands.push(action.payload);
      })
      
      // Aktualizacja marki
      .addCase(updateBrand.fulfilled, (state, action) => {
        const index = state.brands.findIndex(brand => brand.id === action.payload.id);
        if (index !== -1) {
          state.brands[index] = action.payload;
        }
      })
      
      // Usuwanie marki
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.brands = state.brands.filter(brand => brand.id !== action.payload);
      })
      
      // === MODELE ===
      .addCase(fetchModels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModels.fulfilled, (state, action) => {
        state.loading = false;
        state.models = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchModels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Modele dla marki
      .addCase(fetchBrandModels.fulfilled, (state, action) => {
        const { brandId, models } = action.payload;
        state.brandModels[brandId] = Array.isArray(models) ? models : [];
      })
      
      // Tworzenie modelu
      .addCase(createModel.fulfilled, (state, action) => {
        state.models.push(action.payload);
      })
      
      // Aktualizacja modelu
      .addCase(updateModel.fulfilled, (state, action) => {
        const index = state.models.findIndex(model => model.id === action.payload.id);
        if (index !== -1) {
          state.models[index] = action.payload;
        }
      })
      
      // Usuwanie modelu
      .addCase(deleteModel.fulfilled, (state, action) => {
        state.models = state.models.filter(model => model.id !== action.payload);
      })
      
      // === GENERACJE ===
      .addCase(fetchGenerations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGenerations.fulfilled, (state, action) => {
        state.loading = false;
        state.generations = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchGenerations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Generacje dla modelu
      .addCase(fetchModelGenerations.fulfilled, (state, action) => {
        const { modelId, generations } = action.payload;
        state.modelGenerations[modelId] = Array.isArray(generations) ? generations : [];
      })
      
      // Tworzenie generacji
      .addCase(createGeneration.fulfilled, (state, action) => {
        state.generations.push(action.payload);
      })
      
      // Aktualizacja generacji
      .addCase(updateGeneration.fulfilled, (state, action) => {
        const index = state.generations.findIndex(gen => gen.id === action.payload.id);
        if (index !== -1) {
          state.generations[index] = action.payload;
        }
      })
      
      // Usuwanie generacji
      .addCase(deleteGeneration.fulfilled, (state, action) => {
        state.generations = state.generations.filter(gen => gen.id !== action.payload);
      });
  }
});

export const { clearError } = carsSlice.actions;
export default carsSlice.reducer;
