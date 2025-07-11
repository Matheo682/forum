import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { enqueueSnackbar } from 'notistack';

import { 
  fetchGenerations, 
  createGeneration, 
  updateGeneration, 
  deleteGeneration, 
  fetchModels,
  fetchBrands 
} from '../../store/carsSlice';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Nazwa generacji jest wymagana')
    .min(1, 'Nazwa musi mieć co najmniej 1 znak')
    .max(100, 'Nazwa nie może przekraczać 100 znaków'),
  model_id: yup
    .number()
    .required('Model jest wymagany')
    .typeError('Model jest wymagany'),
  start_year: yup
    .number()
    .required('Rok rozpoczęcia jest wymagany')
    .min(1800, 'Rok nie może być wcześniejszy niż 1800')
    .max(new Date().getFullYear() + 10, 'Rok nie może być dalszy niż 10 lat w przyszłość')
    .typeError('Rok musi być liczbą'),
  end_year: yup
    .number()
    .nullable()
    .transform((value, originalValue) => originalValue === '' ? null : value)
    .min(yup.ref('start_year'), 'Rok zakończenia nie może być wcześniejszy niż rok rozpoczęcia')
    .max(new Date().getFullYear() + 10, 'Rok nie może być dalszy niż 10 lat w przyszłość')
    .typeError('Rok musi być liczbą')
});

const GenerationManagement = () => {
  const dispatch = useDispatch();
  const { generations, models, brands, loading, error } = useSelector((state) => state.cars);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGeneration, setEditingGeneration] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [generationToDelete, setGenerationToDelete] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control
  } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    dispatch(fetchGenerations());
    dispatch(fetchModels());
    dispatch(fetchBrands());
  }, [dispatch]);

  const handleOpenDialog = (generation = null) => {
    setEditingGeneration(generation);
    if (generation) {
      setValue('name', generation.name);
      setValue('model_id', generation.model_id);
      setValue('start_year', generation.start_year);
      setValue('end_year', generation.end_year || '');
    } else {
      reset();
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingGeneration(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      // Konwersja pustego stringa na null dla end_year
      const formattedData = {
        ...data,
        end_year: data.end_year || null
      };

      if (editingGeneration) {
        await dispatch(updateGeneration({ id: editingGeneration.id, ...formattedData })).unwrap();
        enqueueSnackbar('Generacja została zaktualizowana', { variant: 'success' });
      } else {
        await dispatch(createGeneration(formattedData)).unwrap();
        enqueueSnackbar('Generacja została utworzona', { variant: 'success' });
      }
      handleCloseDialog();
    } catch (error) {
      enqueueSnackbar(error.message || 'Wystąpił błąd', { variant: 'error' });
    }
  };

  const handleDeleteClick = (generation) => {
    setGenerationToDelete(generation);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteGeneration(generationToDelete.id)).unwrap();
      enqueueSnackbar('Generacja została usunięta', { variant: 'success' });
      setDeleteDialogOpen(false);
      setGenerationToDelete(null);
    } catch (error) {
      enqueueSnackbar(error.message || 'Wystąpił błąd podczas usuwania', { variant: 'error' });
    }
  };

  const getModelInfo = (modelId) => {
    const model = models.find(m => m.id === modelId);
    if (!model) return 'Nieznany model';
    
    const brand = brands.find(b => b.id === model.brand_id);
    const brandName = brand ? brand.name : 'Nieznana marka';
    
    return `${brandName} ${model.name}`;
  };

  const formatYearRange = (startYear, endYear) => {
    return endYear ? `${startYear} - ${endYear}` : `${startYear} - obecnie`;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Zarządzanie Generacjami</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Dodaj Generację
        </Button>
      </Box>

      {generations.length === 0 ? (
        <Alert severity="info">Brak generacji do wyświetlenia</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nazwa</TableCell>
                <TableCell>Model</TableCell>
                <TableCell>Lata produkcji</TableCell>
                <TableCell>Data utworzenia</TableCell>
                <TableCell align="right">Akcje</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {generations.map((generation) => (
                <TableRow key={generation.id}>
                  <TableCell>{generation.id}</TableCell>
                  <TableCell>{generation.name}</TableCell>
                  <TableCell>{getModelInfo(generation.model_id)}</TableCell>
                  <TableCell>
                    {formatYearRange(generation.start_year, generation.end_year)}
                  </TableCell>
                  <TableCell>
                    {new Date(generation.created_at).toLocaleDateString('pl-PL')}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(generation)}
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(generation)}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog dodawania/edycji generacji */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingGeneration ? 'Edytuj Generację' : 'Dodaj Generację'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              {...register('name')}
              label="Nazwa generacji"
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <FormControl fullWidth margin="normal" error={!!errors.model_id}>
              <InputLabel>Model</InputLabel>
              <Controller
                name="model_id"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Model"
                    value={field.value || ''}
                  >
                    {models.map((model) => (
                      <MenuItem key={model.id} value={model.id}>
                        {getModelInfo(model.id)}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.model_id && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {errors.model_id.message}
                </Typography>
              )}
            </FormControl>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                {...register('start_year')}
                label="Rok rozpoczęcia"
                type="number"
                fullWidth
                margin="normal"
                error={!!errors.start_year}
                helperText={errors.start_year?.message}
              />
              <TextField
                {...register('end_year')}
                label="Rok zakończenia (opcjonalny)"
                type="number"
                fullWidth
                margin="normal"
                error={!!errors.end_year}
                helperText={errors.end_year?.message || 'Pozostaw puste jeśli nadal produkowany'}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Anuluj</Button>
            <Button type="submit" variant="contained">
              {editingGeneration ? 'Zaktualizuj' : 'Dodaj'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog potwierdzenia usunięcia */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Potwierdź usunięcie</DialogTitle>
        <DialogContent>
          <Typography>
            Czy na pewno chcesz usunąć generację "{generationToDelete?.name}"?
            Ta operacja jest nieodwracalna.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Anuluj</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Usuń
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GenerationManagement;
