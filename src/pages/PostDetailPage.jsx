import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import {
  Edit,
  Delete,
  MoreVert,
  Reply,
  Person
} from '@mui/icons-material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  fetchPostById, 
  deletePost,
  fetchPostComments,
  addComment
} from '../store/postsSlice';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';
import { ROUTES, TEXTS } from '../constants';

// Schemat walidacji komentarza
const commentSchema = yup.object({
  content: yup
    .string()
    .min(10, TEXTS.VALIDATION.CONTENT_MIN)
    .required(TEXTS.VALIDATION.REQUIRED),
});

const PostDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { 
    currentPost, 
    comments, 
    loading, 
    error 
  } = useSelector((state) => state.posts);
  
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const postComments = comments[id] || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(commentSchema)
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(id));
      dispatch(fetchPostComments(id));
    }
  }, [dispatch, id]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    navigate(`/edit-post/${id}`);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deletePost(id)).unwrap();
      enqueueSnackbar(TEXTS.POSTS.POST_DELETED, { variant: 'success' });
      navigate(ROUTES.HOME);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
    setDeleteDialogOpen(false);
  };

  const handleCommentSubmit = async (data) => {
    try {
      await dispatch(addComment({ postId: id, content: data.content })).unwrap();
      enqueueSnackbar(TEXTS.COMMENTS.COMMENT_ADDED, { variant: 'success' });
      reset();
      setShowCommentForm(false);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOwner = user && currentPost && user.id === currentPost.user_id;
  const canEdit = isOwner || (user && user.role === 'admin');

  if (loading && !currentPost) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage error={error} />
        <Button component={Link} to={ROUTES.HOME} sx={{ mt: 2 }}>
          {TEXTS.COMMON.BACK}
        </Button>
      </Container>
    );
  }

  if (!currentPost) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          Post nie został znaleziony
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Główny post */}
        <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
          {/* Nagłówek z akcjami */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {currentPost.title}
            </Typography>
            
            {canEdit && (
              <IconButton onClick={handleMenuOpen}>
                <MoreVert />
              </IconButton>
            )}
          </Box>

          {/* Meta informacje */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <Person sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
              {TEXTS.POSTS.AUTHOR}: {currentPost.user?.name || 'Nieznany'} • {formatDate(currentPost.created_at)}
            </Typography>
            
            {/* Tagi kategorii i pojazdu */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {currentPost.category && (
                <Chip 
                  label={currentPost.category.name} 
                  color="primary" 
                  size="small" 
                />
              )}
              {currentPost.car_brand && (
                <Chip 
                  label={currentPost.car_brand.brand_name} 
                  color="secondary" 
                  size="small" 
                />
              )}
              {currentPost.car_model && (
                <Chip 
                  label={currentPost.car_model.model_name} 
                  variant="outlined" 
                  size="small" 
                />
              )}
              {currentPost.model_generation && (
                <Chip 
                  label={currentPost.model_generation.generation} 
                  variant="outlined" 
                  size="small" 
                />
              )}
            </Box>
          </Box>

          {/* Krótki opis */}
          <Typography variant="h6" color="text.secondary" paragraph>
            {currentPost.head}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Treść posta */}
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
            {currentPost.body}
          </Typography>
        </Paper>

        {/* Sekcja komentarzy */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              {TEXTS.COMMENTS.TITLE} ({postComments.length})
            </Typography>
            
            {isAuthenticated && (
              <Button
                variant="outlined"
                startIcon={<Reply />}
                onClick={() => setShowCommentForm(!showCommentForm)}
              >
                {TEXTS.COMMENTS.ADD_COMMENT}
              </Button>
            )}
          </Box>

          {/* Formularz dodawania komentarza */}
          {showCommentForm && (
            <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
              <Box component="form" onSubmit={handleSubmit(handleCommentSubmit)}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label={TEXTS.COMMENTS.COMMENT_CONTENT}
                  {...register('content')}
                  error={!!errors.content}
                  helperText={errors.content?.message}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button onClick={() => setShowCommentForm(false)}>
                    {TEXTS.POSTS.CANCEL}
                  </Button>
                  <Button type="submit" variant="contained">
                    {TEXTS.COMMENTS.ADD_COMMENT}
                  </Button>
                </Box>
              </Box>
            </Paper>
          )}

          {/* Lista komentarzy */}
          {postComments.length === 0 ? (
            <Typography color="text.secondary" textAlign="center" py={3}>
              {TEXTS.COMMENTS.NO_COMMENTS}
            </Typography>
          ) : (
            <Box>
              {postComments.map((comment, index) => (
                <Box key={comment.id || index}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <Person sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                      {comment.user?.name || 'Nieznany'} • {formatDate(comment.created_at)}
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {comment.content}
                    </Typography>
                  </Box>
                  {index < postComments.length - 1 && <Divider sx={{ my: 2 }} />}
                </Box>
              ))}
            </Box>
          )}
        </Paper>

        {/* Menu akcji */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEdit}>
            <Edit sx={{ mr: 1 }} />
            {TEXTS.POSTS.EDIT}
          </MenuItem>
          <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
            <Delete sx={{ mr: 1 }} />
            {TEXTS.POSTS.DELETE}
          </MenuItem>
        </Menu>

        {/* Dialog potwierdzenia usunięcia */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>{TEXTS.POSTS.DELETE}</DialogTitle>
          <DialogContent>
            <Typography>
              {TEXTS.POSTS.DELETE_CONFIRM}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              {TEXTS.COMMON.NO}
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              {TEXTS.COMMON.YES}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default PostDetailPage;
