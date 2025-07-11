import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { MoreVert, Reply, Edit, Delete, Flag } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { enqueueSnackbar } from 'notistack';

const commentSchema = yup.object().shape({
  content: yup
    .string()
    .required('Treść komentarza jest wymagana')
    .min(3, 'Komentarz musi mieć co najmniej 3 znaki')
    .max(1000, 'Komentarz nie może przekraczać 1000 znaków')
});

const CommentItem = ({ comment, onReply, onEdit, onDelete, onReport, level = 0 }) => {
  const { user } = useSelector((state) => state.auth);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [replyOpen, setReplyOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(commentSchema)
  });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    setValue,
    reset: resetEdit
  } = useForm({
    resolver: yupResolver(commentSchema)
  });

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleReplySubmit = async (data) => {
    try {
      await onReply(comment.id, data.content);
      setReplyOpen(false);
      reset();
      enqueueSnackbar('Odpowiedź została dodana', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message || 'Wystąpił błąd', { variant: 'error' });
    }
  };

  const handleEditSubmit = async (data) => {
    try {
      await onEdit(comment.id, data.content);
      setEditOpen(false);
      resetEdit();
      enqueueSnackbar('Komentarz został zaktualizowany', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message || 'Wystąpił błąd', { variant: 'error' });
    }
  };

  const handleEditOpen = () => {
    setValue('content', comment.content);
    setEditOpen(true);
    handleMenuClose();
  };

  const handleDeleteOpen = () => {
    setDeleteOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      await onDelete(comment.id);
      setDeleteOpen(false);
      enqueueSnackbar('Komentarz został usunięty', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error.message || 'Wystąpił błąd', { variant: 'error' });
    }
  };

  const handleReport = () => {
    onReport(comment.id);
    handleMenuClose();
  };

  const canEdit = user && (user.id === comment.author.id || user.role === 'admin');
  const canDelete = user && (user.id === comment.author.id || user.role === 'admin');

  return (
    <Box sx={{ ml: level * 4 }}>
      <Paper 
        sx={{ 
          p: 2, 
          mb: 2,
          backgroundColor: level > 0 ? 'background.default' : 'background.paper'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar sx={{ width: 40, height: 40 }}>
            {comment.author.username.charAt(0).toUpperCase()}
          </Avatar>
          
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {comment.author.username}
              </Typography>
              
              {comment.author.role === 'admin' && (
                <Chip label="Admin" color="error" size="small" />
              )}
              
              <Typography variant="caption" color="text.secondary">
                {new Date(comment.created_at).toLocaleDateString('pl-PL', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Typography>
              
              {comment.updated_at !== comment.created_at && (
                <Chip label="Edytowany" size="small" variant="outlined" />
              )}
            </Box>
            
            <Typography variant="body2" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>
              {comment.content}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {user && (
                <Button
                  size="small"
                  startIcon={<Reply />}
                  onClick={() => setReplyOpen(true)}
                >
                  Odpowiedz
                </Button>
              )}
            </Box>
          </Box>
          
          {user && (
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVert />
            </IconButton>
          )}
        </Box>
        
        {/* Menu akcji */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          {canEdit && (
            <MenuItem onClick={handleEditOpen}>
              <Edit sx={{ mr: 1 }} fontSize="small" />
              Edytuj
            </MenuItem>
          )}
          {canDelete && (
            <MenuItem onClick={handleDeleteOpen}>
              <Delete sx={{ mr: 1 }} fontSize="small" />
              Usuń
            </MenuItem>
          )}
          {user.id !== comment.author.id && (
            <MenuItem onClick={handleReport}>
              <Flag sx={{ mr: 1 }} fontSize="small" />
              Zgłoś
            </MenuItem>
          )}
        </Menu>
      </Paper>
      
      {/* Dialog odpowiedzi */}
      <Dialog open={replyOpen} onClose={() => setReplyOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Odpowiedz na komentarz</DialogTitle>
        <form onSubmit={handleSubmit(handleReplySubmit)}>
          <DialogContent>
            <TextField
              {...register('content')}
              label="Twoja odpowiedź"
              fullWidth
              multiline
              rows={3}
              error={!!errors.content}
              helperText={errors.content?.message}
              placeholder="Napisz swoją odpowiedź..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReplyOpen(false)}>Anuluj</Button>
            <Button type="submit" variant="contained">Odpowiedz</Button>
          </DialogActions>
        </form>
      </Dialog>
      
      {/* Dialog edycji */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edytuj komentarz</DialogTitle>
        <form onSubmit={handleSubmitEdit(handleEditSubmit)}>
          <DialogContent>
            <TextField
              {...registerEdit('content')}
              label="Treść komentarza"
              fullWidth
              multiline
              rows={3}
              error={!!errorsEdit.content}
              helperText={errorsEdit.content?.message}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)}>Anuluj</Button>
            <Button type="submit" variant="contained">Zapisz</Button>
          </DialogActions>
        </form>
      </Dialog>
      
      {/* Dialog potwierdzenia usunięcia */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Potwierdź usunięcie</DialogTitle>
        <DialogContent>
          <Typography>
            Czy na pewno chcesz usunąć ten komentarz? Ta operacja jest nieodwracalna.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Anuluj</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Usuń
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Odpowiedzi (rekurencyjnie) */}
      {comment.replies && comment.replies.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
          onReport={onReport}
          level={level + 1}
        />
      ))}
    </Box>
  );
};

export default CommentItem;
