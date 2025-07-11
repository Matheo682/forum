import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import postService from '../services/postService';
import { TEXTS } from '../constants';

// Akcje asynchroniczne dla postów

// Pobieranie wszystkich postów
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await postService.getAllPosts(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Błąd podczas pobierania postów');
    }
  }
);

// Pobieranie posta po ID
export const fetchPostById = createAsyncThunk(
  'posts/fetchPostById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await postService.getPostById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Błąd podczas pobierania posta');
    }
  }
);

// Tworzenie nowego posta
export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await postService.createPost(postData);
      return response;
    } catch (error) {
      const errorMessage = error.message || 'Błąd podczas tworzenia posta';
      return rejectWithValue(errorMessage);
    }
  }
);

// Aktualizacja posta
export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ id, postData }, { rejectWithValue }) => {
    try {
      const response = await postService.updatePost(id, postData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Błąd podczas aktualizacji posta');
    }
  }
);

// Usuwanie posta
export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (id, { rejectWithValue }) => {
    try {
      await postService.deletePost(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Błąd podczas usuwania posta');
    }
  }
);

// Pobieranie komentarzy posta
export const fetchPostComments = createAsyncThunk(
  'posts/fetchPostComments',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await postService.getPostComments(postId);
      return { postId, comments: response };
    } catch (error) {
      return rejectWithValue(error.message || 'Błąd podczas pobierania komentarzy');
    }
  }
);

// Dodawanie komentarza
export const addComment = createAsyncThunk(
  'posts/addComment',
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const response = await postService.addComment(postId, content);
      return { postId, comment: response };
    } catch (error) {
      return rejectWithValue(error.message || 'Błąd podczas dodawania komentarza');
    }
  }
);

// Stan początkowy
const initialState = {
  posts: [],
  currentPost: null,
  comments: {},
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },
  filters: {
    category_id: null,
    car_brand_id: null,
    car_model_id: null,
    model_generation_id: null,
    search: ''
  }
};

// Slice dla postów
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Czyszczenie błędów
    clearError: (state) => {
      state.error = null;
    },
    // Czyszczenie aktualnego posta
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    // Ustawianie filtrów
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    // Ustawianie paginacji
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    // Czyszczenie komentarzy
    clearComments: (state, action) => {
      if (action.payload) {
        delete state.comments[action.payload];
      } else {
        state.comments = {};
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Pobieranie postów
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = Array.isArray(action.payload) ? action.payload : action.payload.data || [];
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Pobieranie posta po ID
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Tworzenie posta
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Aktualizacja posta
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.currentPost && state.currentPost.id === action.payload.id) {
          state.currentPost = action.payload;
        }
      })
      
      // Usuwanie posta
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post.id !== action.payload);
        if (state.currentPost && state.currentPost.id === action.payload) {
          state.currentPost = null;
        }
      })
      
      // Pobieranie komentarzy
      .addCase(fetchPostComments.fulfilled, (state, action) => {
        state.comments[action.payload.postId] = action.payload.comments;
      })
      
      // Dodawanie komentarza
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        if (!state.comments[postId]) {
          state.comments[postId] = [];
        }
        state.comments[postId].push(comment);
      });
  }
});

export const { clearError, clearCurrentPost, setFilters, setPagination, clearComments } = postsSlice.actions;
export default postsSlice.reducer;
