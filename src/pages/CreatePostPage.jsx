import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { createPost, updatePost, fetchPostById } from '../store/postsSlice';
import { fetchCategories } from '../store/categoriesSlice';
import BrandSelector from '../components/Cars/BrandSelector';
import ModelSelector from '../components/Cars/ModelSelector';
import GenerationSelector from '../components/Cars/GenerationSelector';
import { ROUTES, TEXTS } from '../constants';

// Schemat walidacji
const schema = yup.object({
  title: yup
    .string()
    .min(3, TEXTS.VALIDATION.TITLE_MIN)
    .max(100, TEXTS.VALIDATION.TITLE_MAX)
    .required(TEXTS.VALIDATION.REQUIRED),
  head: yup
    .string()
    .min(10, TEXTS.VALIDATION.CONTENT_MIN)
    .required(TEXTS.VALIDATION.REQUIRED),
  body: yup
    .string()
    .min(10, TEXTS.VALIDATION.CONTENT_MIN)
    .required(TEXTS.VALIDATION.REQUIRED),
});

const CreatePostPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  
  const isEditMode = Boolean(id);
  
  const { 
    posts, 
    currentPost, 
    loading: postsLoading 
  } = useSelector((state) => state.posts);
  
  const { 
    categories, 
    loading: categoriesLoading 
  } = useSelector((state) => state.categories);

  // Dodaj auth state do debugowania
  const { 
    user, 
    isLoggedIn,
    token 
  } = useSelector((state) => state.auth);

  // Stan dla hierarchii pojazdów
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [selectedModelId, setSelectedModelId] = useState('');
  const [selectedGenerationId, setSelectedGenerationId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm({
    resolver: yupResolver(schema)
  });

  // Ładowanie danych przy inicjalizacji
  useEffect(() => {
    dispatch(fetchCategories());
    
    if (isEditMode && id) {
      dispatch(fetchPostById(id));
    }
  }, [dispatch, isEditMode, id]);

  // Ustawianie wartości w trybie edycji
  useEffect(() => {
    if (isEditMode && currentPost) {
      reset({
        title: currentPost.title || '',
        head: currentPost.head || '',
        body: currentPost.body || ''
      });
      
      setSelectedCategoryId(currentPost.category_id || '');
      setSelectedBrandId(currentPost.car_brand_id || '');
      setSelectedModelId(currentPost.car_model_id || '');
      setSelectedGenerationId(currentPost.model_generation_id || '');
    }
  }, [isEditMode, currentPost, reset]);

  const onSubmit = async (data) => {
    try {
      // Sprawdź autentyfikację
      if (!isLoggedIn || !user) {
        enqueueSnackbar('Musisz być zalogowany, aby utworzyć post', { variant: 'error' });
        navigate('/login');
        return;
      }

      // Sprawdź czy podstawowe pola są wypełnione
      if (!data.title?.trim() || !data.head?.trim() || !data.body?.trim()) {
        enqueueSnackbar('Wszystkie podstawowe pola są wymagane', { variant: 'error' });
        return;
      }

      // Podstawowe dane posta (zawsze wymagane)
      const postData = {
        title: data.title.trim(),
        head: data.head.trim(),
        body: data.body.trim(),
      };

      // Dodaj tylko te pola, które mają wartości (nie null/undefined/empty)
      if (selectedCategoryId && selectedCategoryId !== '') {
        const categoryIdNum = parseInt(selectedCategoryId);
        if (!isNaN(categoryIdNum)) {
          postData.category_id = categoryIdNum;
        }
      }
      
      if (selectedBrandId && selectedBrandId !== '') {
        const brandIdNum = parseInt(selectedBrandId);
        if (!isNaN(brandIdNum)) {
          postData.car_brand_id = brandIdNum;
        }
      }
      
      if (selectedModelId && selectedModelId !== '') {
        const modelIdNum = parseInt(selectedModelId);
        if (!isNaN(modelIdNum)) {
          postData.car_model_id = modelIdNum;
        }
      }
      
      if (selectedGenerationId && selectedGenerationId !== '') {
        const generationIdNum = parseInt(selectedGenerationId);
        if (!isNaN(generationIdNum)) {
          postData.model_generation_id = generationIdNum;
        }
      }

      if (isEditMode) {
        await dispatch(updatePost({ id, postData })).unwrap();
        enqueueSnackbar(TEXTS.POSTS.POST_UPDATED, { variant: 'success' });
      } else {
        await dispatch(createPost(postData)).unwrap();
        enqueueSnackbar(TEXTS.POSTS.POST_CREATED, { variant: 'success' });
      }
      
      navigate(ROUTES.HOME);
    } catch (error) {
      enqueueSnackbar(error.message || 'Wystąpił błąd', { variant: 'error' });
    }
  };

  const handleBrandChange = (brandId) => {
    setSelectedBrandId(brandId);
    setSelectedModelId(''); // Reset model when brand changes
    setSelectedGenerationId(''); // Reset generation when brand changes
  };

  const handleModelChange = (modelId) => {
    setSelectedModelId(modelId);
    setSelectedGenerationId(''); // Reset generation when model changes
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isEditMode && postsLoading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {isEditMode ? TEXTS.POSTS.EDIT_POST : TEXTS.POSTS.CREATE_POST}
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
            {/* Podstawowe pola */}
            <TextField
              fullWidth
              label={TEXTS.POSTS.POST_TITLE}
              margin="normal"
              required
              {...register('title')}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <TextField
              fullWidth
              label={TEXTS.POSTS.POST_HEAD}
              margin="normal"
              required
              multiline
              rows={2}
              {...register('head')}
              error={!!errors.head}
              helperText={errors.head?.message}
            />

            <TextField
              fullWidth
              label={TEXTS.POSTS.POST_BODY}
              margin="normal"
              required
              multiline
              rows={8}
              {...register('body')}
              error={!!errors.body}
              helperText={errors.body?.message}
            />

            {/* Sekcja kategoryzacji */}
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
              Kategoryzacja (opcjonalna)
            </Typography>
            
            <Grid container spacing={2}>
              {/* Kategoria */}
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>{TEXTS.POSTS.CATEGORY}</InputLabel>
                  <Select
                    value={selectedCategoryId}
                    label={TEXTS.POSTS.CATEGORY}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>-- Wybierz kategorię --</em>
                    </MenuItem>
                    {categoriesLoading && (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        {TEXTS.COMMON.LOADING}
                      </MenuItem>
                    )}
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Marka pojazdu */}
              <Grid size={{ xs: 12, md: 6 }}>
                <BrandSelector
                  value={selectedBrandId}
                  onChange={handleBrandChange}
                  label={TEXTS.POSTS.BRAND}
                />
              </Grid>

              {/* Model pojazdu */}
              <Grid size={{ xs: 12, md: 6 }}>
                <ModelSelector
                  value={selectedModelId}
                  onChange={handleModelChange}
                  brandId={selectedBrandId}
                  label={TEXTS.POSTS.MODEL}
                />
              </Grid>

              {/* Generacja pojazdu */}
              <Grid size={{ xs: 12, md: 6 }}>
                <GenerationSelector
                  value={selectedGenerationId}
                  onChange={setSelectedGenerationId}
                  modelId={selectedModelId}
                  label={TEXTS.POSTS.GENERATION}
                />
              </Grid>
            </Grid>

            {/* Przyciski akcji */}
            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={postsLoading}
              >
                {TEXTS.POSTS.CANCEL}
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={postsLoading}
              >
                {postsLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  TEXTS.POSTS.SAVE
                )}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreatePostPage;
