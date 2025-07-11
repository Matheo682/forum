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
  Alert
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { enqueueSnackbar } from 'notistack';

import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../store/categoriesSlice';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Nazwa kategorii jest wymagana')
    .min(2, 'Nazwa musi mieć co najmniej 2 znaki')
    .max(100, 'Nazwa nie może przekraczać 100 znaków'),
  description: yup
    .string()
    .max(500, 'Opis nie może przekraczać 500 znaków')
});

const CategoryManagement = () => {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.categories);
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleOpenDialog = (category = null) => {
    setEditingCategory(category);
    if (category) {
      setValue('name', category.name);
      setValue('description', category.description || '');
    } else {
      reset();
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCategory(null);
    reset();
  };

  const onSubmit = async (data) => {
    try {
      if (editingCategory) {
        await dispatch(updateCategory({ id: editingCategory.id, ...data })).unwrap();
        enqueueSnackbar('Kategoria została zaktualizowana', { variant: 'success' });
      } else {
        await dispatch(createCategory(data)).unwrap();
        enqueueSnackbar('Kategoria została utworzona', { variant: 'success' });
      }
      handleCloseDialog();
    } catch (error) {
      enqueueSnackbar(error.message || 'Wystąpił błąd', { variant: 'error' });
    }
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteCategory(categoryToDelete.id)).unwrap();
      enqueueSnackbar('Kategoria została usunięta', { variant: 'success' });
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      enqueueSnackbar(error.message || 'Wystąpił błąd podczas usuwania', { variant: 'error' });
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Zarządzanie Kategoriami</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Dodaj Kategorię
        </Button>
      </Box>

      {categories.length === 0 ? (
        <Alert severity="info">Brak kategorii do wyświetlenia</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nazwa</TableCell>
                <TableCell>Opis</TableCell>
                <TableCell>Data utworzenia</TableCell>
                <TableCell align="right">Akcje</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description || '-'}</TableCell>
                  <TableCell>
                    {new Date(category.created_at).toLocaleDateString('pl-PL')}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(category)}
                      size="small"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(category)}
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

      {/* Dialog dodawania/edycji kategorii */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Edytuj Kategorię' : 'Dodaj Kategorię'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              {...register('name')}
              label="Nazwa kategorii"
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              {...register('description')}
              label="Opis (opcjonalny)"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Anuluj</Button>
            <Button type="submit" variant="contained">
              {editingCategory ? 'Zaktualizuj' : 'Dodaj'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Dialog potwierdzenia usunięcia */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Potwierdź usunięcie</DialogTitle>
        <DialogContent>
          <Typography>
            Czy na pewno chcesz usunąć kategorię "{categoryToDelete?.name}"?
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

export default CategoryManagement;
