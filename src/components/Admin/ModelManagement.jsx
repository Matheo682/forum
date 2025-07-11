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

import { fetchModels, createModel, updateModel, deleteModel, fetchBrands } from '../../store/carsSlice';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Nazwa modelu jest wymagana')
    .min(1, 'Nazwa musi mieć co najmniej 1 znak')
    .max(100, 'Nazwa nie może przekraczać 100 znaków'),
  brand_id: yup
    .number()
    .required('Marka jest wymagana')
    .typeError('Marka jest wymagana')
});

const ModelManagement = () => {
  const dispatch = useDispatch();
  const { models, brands, loading, error } = useSelector((state) => state.cars);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [modelToDelete, setModelToDelete] = useState(null);

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
    dispatch(fetchModels());
    dispatch(fetchBrands());
  }, [dispatch]);

  const handleOpenDialog = (model = null) => {
    setEditingModel(model);
    if (model) {
      setValue('name', model.name);
      setValue('brand_id', model.brand_id);
    } else {
      reset();
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingModel(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      if (editingModel) {
        await dispatch(updateModel({ id: editingModel.id, ...data })).unwrap();
        enqueueSnackbar('Model został zaktualizowany', { variant: 'success' });
      } else {
        await dispatch(createModel(data)).unwrap();
        enqueueSnackbar('Model został utworzony', { variant: 'success' });
      }
      handleCloseDialog();
    } catch (error) {
      enqueueSnackbar(error.message || 'Wystąpił błąd', { variant: 'error' });
    }
  };

  const handleDeleteClick = (model) => {
    setModelToDelete(model);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteModel(modelToDelete.id)).unwrap();
      enqueueSnackbar('Model został usunięty', { variant: 'success' });
      setDeleteDialogOpen(false);
      setModelToDelete(null);
    } catch (error) {
      enqueueSnackbar(error.message || 'Wystąpił błąd podczas usuwania', { variant: 'error' });
    }
  };

  const getBrandName = (brandId) => {
    const brand = brands.find(b => b.id === brandId);
    return brand ? brand.name : 'Nieznana marka';
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Zarządzanie Modelami</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Dodaj Model
        </Button>
      </Box>

      {models.length === 0 ? (
        <Alert severity="info">Brak modeli do wyświetlenia</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nazwa</TableCell>
                <TableCell>Marka</TableCell>
                <TableCell>Data utworzenia</TableCell>
                <TableCell align="right">Akcje</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {models.map((model) => (
                <TableRow key={model.id}>
                  <TableCell>{model.id}</TableCell>
                  <TableCell>{model.name}</TableCell>
                  <TableCell>{getBrandName(model.brand_id)}</TableCell>
                  <TableCell>
                    {new Date(model.created_at).toLocaleDateString('pl-PL')}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(model)}
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(model)}
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

      {/* Dialog dodawania/edycji modelu */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingModel ? 'Edytuj Model' : 'Dodaj Model'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              {...register('name')}
              label="Nazwa modelu"
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <FormControl fullWidth margin="normal" error={!!errors.brand_id}>
              <InputLabel>Marka</InputLabel>
              <Controller
                name="brand_id"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Marka"
                    value={field.value || ''}
                  >
                    {brands.map((brand) => (
                      <MenuItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.brand_id && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {errors.brand_id.message}
                </Typography>
              )}
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Anuluj</Button>
            <Button type="submit" variant="contained">
              {editingModel ? 'Zaktualizuj' : 'Dodaj'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog potwierdzenia usunięcia */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Potwierdź usunięcie</DialogTitle>
        <DialogContent>
          <Typography>
            Czy na pewno chcesz usunąć model "{modelToDelete?.name}"?
            Ta operacja jest nieodwracalna i może wpłynąć na powiązane generacje.
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

export default ModelManagement;
