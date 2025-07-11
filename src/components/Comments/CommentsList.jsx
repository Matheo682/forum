import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { enqueueSnackbar } from 'notistack';

import CommentItem from './CommentItem';
import postService from '../../services/postService';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';

const commentSchema = yup.object().shape({
  content: yup
    .string()
    .required('Treść komentarza jest wymagana')
    .min(3, 'Komentarz musi mieć co najmniej 3 znaki')
    .max(1000, 'Komentarz nie może przekraczać 1000 znaków')
});

const CommentsList = ({ postId }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(commentSchema)
  });

  useEffect(() => {
    fetchComments();
  }, [postId, sortBy]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await postService.getPostComments(postId, { sort: sortBy });
      setComments(response.comments || []);
    } catch (error) {
      setError(error.message || 'Wystąpił błąd podczas pobierania komentarzy');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (data) => {
    try {
      setSubmitting(true);
      await postService.addComment(postId, data.content);
      reset();
      fetchComments(); // Odśwież komentarze
      enqueueSnackbar('Komentarz został dodany', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message || 'Wystąpił błąd podczas dodawania komentarza', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplyToComment = async (parentId, content) => {
    try {
      await postService.addCommentReply(parentId, content);
      fetchComments(); // Odśwież komentarze
    } catch (error) {
      throw error;
    }
  };

  const handleEditComment = async (commentId, content) => {
    try {
      await postService.updateComment(commentId, content);
      fetchComments(); // Odśwież komentarze
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await postService.deleteComment(commentId);
      fetchComments(); // Odśwież komentarze
    } catch (error) {
      throw error;
    }
  };

  const handleReportComment = async (commentId) => {
    try {
      await postService.reportComment(commentId, 'Nieodpowiednia treść');
      enqueueSnackbar('Komentarz został zgłoszony', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message || 'Wystąpił błąd podczas zgłaszania', { variant: 'error' });
    }
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">
          Komentarze ({comments.length})
        </Typography>
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sortowanie</InputLabel>
          <Select
            value={sortBy}
            onChange={handleSortChange}
            label="Sortowanie"
          >
            <MenuItem value="newest">Najnowsze</MenuItem>
            <MenuItem value="oldest">Najstarsze</MenuItem>
            <MenuItem value="popular">Najpopularniejsze</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Formularz dodawania komentarza */}
      {isAuthenticated ? (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Dodaj komentarz
          </Typography>
          <form onSubmit={handleSubmit(handleAddComment)}>
            <TextField
              {...register('content')}
              label="Twój komentarz"
              fullWidth
              multiline
              rows={3}
              error={!!errors.content}
              helperText={errors.content?.message}
              placeholder="Podziel się swoimi przemyśleniami..."
              sx={{ mb: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              startIcon={<Add />}
              disabled={submitting}
            >
              {submitting ? 'Dodawanie...' : 'Dodaj komentarz'}
            </Button>
          </form>
        </Paper>
      ) : (
        <Alert severity="info" sx={{ mb: 3 }}>
          Musisz być zalogowany, aby dodać komentarz.
        </Alert>
      )}

      {/* Lista komentarzy */}
      {comments.length === 0 ? (
        <Alert severity="info">
          Brak komentarzy. Bądź pierwszy, który skomentuje ten post!
        </Alert>
      ) : (
        <Box>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReplyToComment}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              onReport={handleReportComment}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CommentsList;
