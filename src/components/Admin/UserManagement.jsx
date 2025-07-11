import React, { useState, useEffect } from 'react';
import {
  Box,
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
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Edit, Block, CheckCircle } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { enqueueSnackbar } from 'notistack';

import { userService } from '../../services/api';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';

const UserManagement = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getUsers();
      setUsers(response.data);
    } catch (error) {
      setError(error.message || 'Wystąpił błąd podczas pobierania użytkowników');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setEditDialogOpen(true);
  };

  const handleRoleUpdate = async () => {
    try {
      await userService.updateUserRole(selectedUser.id, { role: newRole });
      enqueueSnackbar('Rola użytkownika została zaktualizowana', { variant: 'success' });
      setEditDialogOpen(false);
      setSelectedUser(null);
      fetchUsers(); // Odśwież listę użytkowników
    } catch (error) {
      enqueueSnackbar(error.message || 'Wystąpił błąd podczas aktualizacji roli', { variant: 'error' });
    }
  };

  const handleToggleActive = async (user) => {
    try {
      await userService.toggleUserActive(user.id);
      enqueueSnackbar(
        `Użytkownik został ${user.is_active ? 'zablokowany' : 'odblokowany'}`, 
        { variant: 'success' }
      );
      fetchUsers(); // Odśwież listę użytkowników
    } catch (error) {
      enqueueSnackbar(error.message || 'Wystąpił błąd podczas zmiany statusu', { variant: 'error' });
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'moderator':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'moderator':
        return 'Moderator';
      default:
        return 'Użytkownik';
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Zarządzanie Użytkownikami
      </Typography>

      {users.length === 0 ? (
        <Alert severity="info">Brak użytkowników do wyświetlenia</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Avatar</TableCell>
                <TableCell>Nazwa użytkownika</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rola</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Data rejestracji</TableCell>
                <TableCell>Ostatnia aktywność</TableCell>
                <TableCell align="right">Akcje</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={getRoleLabel(user.role)} 
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.is_active ? 'Aktywny' : 'Zablokowany'}
                      color={user.is_active ? 'success' : 'error'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString('pl-PL')}
                  </TableCell>
                  <TableCell>
                    {user.last_login ? 
                      new Date(user.last_login).toLocaleDateString('pl-PL') : 
                      'Nigdy'
                    }
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleEditRole(user)}
                      size="small"
                      title="Edytuj rolę"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color={user.is_active ? 'error' : 'success'}
                      onClick={() => handleToggleActive(user)}
                      size="small"
                      title={user.is_active ? 'Zablokuj użytkownika' : 'Odblokuj użytkownika'}
                    >
                      {user.is_active ? <Block /> : <CheckCircle />}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog edycji roli */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edytuj rolę użytkownika</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Użytkownik: <strong>{selectedUser?.username}</strong>
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Rola</InputLabel>
            <Select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              label="Rola"
            >
              <MenuItem value="user">Użytkownik</MenuItem>
              <MenuItem value="moderator">Moderator</MenuItem>
              <MenuItem value="admin">Administrator</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Anuluj</Button>
          <Button onClick={handleRoleUpdate} variant="contained">
            Zaktualizuj
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
