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

import { fetchBrands, createBrand, updateBrand, deleteBrand } from '../../store/carsSlice';
import { fetchCategories } from '../../store/categoriesSlice';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Nazwa marki jest wymagana')
    .min(2, 'Nazwa musi mieć co najmniej 2 znaki')
    .max(100, 'Nazwa nie może przekraczać 100 znaków'),
  category_id: yup
    .number()
    .required('Kategoria jest wymagana')
    .typeError('Kategoria jest wymagana')
});

const BrandManagement = () => {
  const dispatch = useDispatch();
  const { brands, loading, error } = useSelector((state) => state.cars);
  const { categories } = useSelector((state) => state.categories);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);

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
    dispatch(fetchBrands());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleOpenDialog = (brand = null) => {
    setEditingBrand(brand);
    if (brand) {
      setValue('name', brand.name);
      setValue('category_id', brand.category_id);
    } else {
      reset();
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingBrand(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      if (editingBrand) {
        await dispatch(updateBrand({ id: editingBrand.id, ...data })).unwrap();
        enqueueSnackbar('Marka została zaktualizowana', { variant: 'success' });
      } else {
        await dispatch(createBrand(data)).unwrap();
        enqueueSnackbar('Marka została utworzona', { variant: 'success' });
      }
      handleCloseDialog();
    } catch (error) {
      enqueueSnackbar(error.message || 'Wystąpił błąd', { variant: 'error' });
    }
  };

  const handleDeleteClick = (brand) => {
    setBrandToDelete(brand);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteBrand(brandToDelete.id)).unwrap();
      enqueueSnackbar('Marka została usunięta', { variant: 'success' });
      setDeleteDialogOpen(false);
      setBrandToDelete(null);
    } catch (error) {
      enqueueSnackbar(error.message || 'Wystąpił błąd podczas usuwania', { variant: 'error' });
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Nieznana kategoria';
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Zarządzanie Markami</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Dodaj Markę
        </Button>
      </Box>

      {brands.length === 0 ? (
        <Alert severity="info">Brak marek do wyświetlenia</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nazwa</TableCell>
                <TableCell>Kategoria</TableCell>
                <TableCell>Data utworzenia</TableCell>
                <TableCell align="right">Akcje</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {brands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>{brand.id}</TableCell>
                  <TableCell>{brand.name}</TableCell>
                  <TableCell>{getCategoryName(brand.category_id)}</TableCell>
                  <TableCell>
                    {new Date(brand.created_at).toLocaleDateString('pl-PL')}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(brand)}
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(brand)}
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

      {/* Dialog dodawania/edycji marki */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingBrand ? 'Edytuj Markę' : 'Dodaj Markę'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              {...register('name')}
              label="Nazwa marki"
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <FormControl fullWidth margin="normal" error={!!errors.category_id}>
              <InputLabel>Kategoria</InputLabel>
              <Controller
                name="category_id"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Kategoria"
                    value={field.value || ''}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.category_id && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {errors.category_id.message}
                </Typography>
              )}
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Anuluj</Button>
            <Button type="submit" variant="contained">
              {editingBrand ? 'Zaktualizuj' : 'Dodaj'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog potwierdzenia usunięcia */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Potwierdź usunięcie</DialogTitle>
        <DialogContent>
          <Typography>
            Czy na pewno chcesz usunąć markę "{brandToDelete?.name}"?
            Ta operacja jest nieodwracalna i może wpłynąć na powiązane modele.
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

export default BrandManagement;
