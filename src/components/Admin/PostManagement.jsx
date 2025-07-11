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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import { Visibility, Edit, Delete, Flag } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';

import postService from '../../services/postService';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';

const PostManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [moderateDialogOpen, setModerateDialogOpen] = useState(false);
  const [postToModerate, setPostToModerate] = useState(null);
  const [moderationReason, setModerationReason] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await postService.getAllPosts({ 
        page: 1, 
        limit: 100, // Pobierz więcej postów dla admina
        include_moderated: true // Uwzględnij zmoderowane posty
      });
      setPosts(response.data.posts);
    } catch (error) {
      setError(error.message || 'Wystąpił błąd podczas pobierania postów');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPost = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await postService.deletePost(postToDelete.id);
      enqueueSnackbar('Post został usunięty', { variant: 'success' });
      setDeleteDialogOpen(false);
      setPostToDelete(null);
      fetchPosts(); // Odśwież listę postów
    } catch (error) {
      enqueueSnackbar(error.message || 'Wystąpił błąd podczas usuwania', { variant: 'error' });
    }
  };

  const handleModerateClick = (post) => {
    setPostToModerate(post);
    setModerationReason('');
    setModerateDialogOpen(true);
  };

  const handleModerateConfirm = async () => {
    try {
      await postService.moderatePost(postToModerate.id, {
        action: 'hide',
        reason: moderationReason
      });
      enqueueSnackbar('Post został zmoderowany', { variant: 'success' });
      setModerateDialogOpen(false);
      setPostToModerate(null);
      setModerationReason('');
      fetchPosts(); // Odśwież listę postów
    } catch (error) {
      enqueueSnackbar(error.message || 'Wystąpił błąd podczas moderacji', { variant: 'error' });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'hidden':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'published':
        return 'Opublikowany';
      case 'hidden':
        return 'Ukryty';
      case 'pending':
        return 'Oczekujący';
      default:
        return 'Nieznany';
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Zarządzanie Postami
      </Typography>

      {posts.length === 0 ? (
        <Alert severity="info">Brak postów do wyświetlenia</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tytuł</TableCell>
                <TableCell>Autor</TableCell>
                <TableCell>Kategoria</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Komentarze</TableCell>
                <TableCell>Data utworzenia</TableCell>
                <TableCell align="right">Akcje</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>{post.id}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {truncateText(post.title, 50)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {truncateText(post.content, 80)}
                    </Typography>
                  </TableCell>
                  <TableCell>{post.author?.username || 'Nieznany'}</TableCell>
                  <TableCell>
                    {post.category?.name || 'Brak kategorii'}
                    {post.car_generation && (
                      <Typography variant="caption" display="block" color="text.secondary">
                        {post.car_generation.model?.brand?.name} {post.car_generation.model?.name} ({post.car_generation.name})
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={getStatusLabel(post.status)}
                      color={getStatusColor(post.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{post.comments_count || 0}</TableCell>
                  <TableCell>
                    {new Date(post.created_at).toLocaleDateString('pl-PL')}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleViewPost(post.id)}
                      size="small"
                      title="Zobacz post"
                    >
                      <Visibility />
                    </IconButton>
                    {post.status === 'published' && (
                      <IconButton
                        color="warning"
                        onClick={() => handleModerateClick(post)}
                        size="small"
                        title="Moderuj post"
                      >
                        <Flag />
                      </IconButton>
                    )}
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(post)}
                      size="small"
                      title="Usuń post"
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

      {/* Dialog potwierdzenia usunięcia */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Potwierdź usunięcie</DialogTitle>
        <DialogContent>
          <Typography>
            Czy na pewno chcesz usunąć post "{postToDelete?.title}"?
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

      {/* Dialog moderacji */}
      <Dialog open={moderateDialogOpen} onClose={() => setModerateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Moderuj post</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Post: <strong>{postToModerate?.title}</strong>
          </Typography>
          <TextField
            label="Powód moderacji"
            fullWidth
            multiline
            rows={3}
            value={moderationReason}
            onChange={(e) => setModerationReason(e.target.value)}
            placeholder="Wprowadź powód ukrycia posta..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModerateDialogOpen(false)}>Anuluj</Button>
          <Button 
            onClick={handleModerateConfirm} 
            color="warning" 
            variant="contained"
            disabled={!moderationReason.trim()}
          >
            Ukryj post
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostManagement;
