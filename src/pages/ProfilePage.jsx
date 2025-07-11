import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { Edit, Visibility, Comment, ThumbUp } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { enqueueSnackbar } from 'notistack';

import { TEXTS } from '../constants';
import { userService } from '../services/api';
import postService from '../services/postService';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const profileSchema = yup.object().shape({
  bio: yup.string().max(500, 'Bio nie może przekraczać 500 znaków'),
  location: yup.string().max(100, 'Lokalizacja nie może przekraczać 100 znaków')
});

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [tabValue, setTabValue] = useState(0);
  const [userPosts, setUserPosts] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(profileSchema)
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Pobierz posty użytkownika
      const postsResponse = await postService.getAllPosts({ 
        author_id: user.id,
        page: 1,
        limit: 10
      });
      setUserPosts(postsResponse.posts || []);
      
      // Pobierz statystyki użytkownika
      const statsResponse = await userService.getUserProfile(user.id);
      setUserStats(statsResponse.data);
      
    } catch (error) {
      setError(error.message || 'Wystąpił błąd podczas pobierania danych');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditProfile = () => {
    setValue('bio', userStats?.bio || '');
    setValue('location', userStats?.location || '');
    setEditDialogOpen(true);
  };

  const onSubmit = async (data) => {
    try {
      await userService.updateUserProfile(user.id, data);
      enqueueSnackbar('Profil został zaktualizowany', { variant: 'success' });
      setEditDialogOpen(false);
      fetchUserData(); // Odśwież dane
    } catch (error) {
      enqueueSnackbar(error.message || 'Wystąpił błąd podczas aktualizacji', { variant: 'error' });
    }
  };

  const handleViewPost = (postId) => {
    navigate(`/posts/${postId}`);
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

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Sekcja profilu */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{ 
                width: 120, 
                height: 120, 
                mx: 'auto', 
                mb: 2,
                fontSize: '3rem'
              }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
            
            <Typography variant="h5" gutterBottom>
              {user?.username}
            </Typography>
            
            <Chip 
              label={getRoleLabel(user?.role)}
              color={getRoleColor(user?.role)}
              sx={{ mb: 2 }}
            />
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user?.email}
            </Typography>
            
            {userStats?.bio && (
              <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
                {userStats.bio}
              </Typography>
            )}
            
            {userStats?.location && (
              <Typography variant="body2" color="text.secondary" gutterBottom>
                📍 {userStats.location}
              </Typography>
            )}
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Członek od: {new Date(user?.created_at).toLocaleDateString('pl-PL')}
            </Typography>
            
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={handleEditProfile}
              sx={{ mt: 2 }}
              fullWidth
            >
              Edytuj profil
            </Button>
          </Paper>
          
          {/* Statystyki */}
          {userStats && (
            <Paper sx={{ p: 3, mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Statystyki
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Posty:</Typography>
                <Typography fontWeight="bold">{userStats.posts_count || 0}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Komentarze:</Typography>
                <Typography fontWeight="bold">{userStats.comments_count || 0}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Ostatnia aktywność:</Typography>
                <Typography variant="body2" color="text.secondary">
                  {userStats.last_activity ? 
                    new Date(userStats.last_activity).toLocaleDateString('pl-PL') : 
                    'Brak danych'
                  }
                </Typography>
              </Box>
            </Paper>
          )}
        </Grid>
        
        {/* Sekcja zawartości */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Moje posty" />
                <Tab label="Aktywność" />
              </Tabs>
            </Box>
            
            <TabPanel value={tabValue} index={0}>
              {userPosts.length === 0 ? (
                <Typography color="text.secondary" textAlign="center">
                  Nie masz jeszcze żadnych postów
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {userPosts.map((post) => (
                    <Grid size={12} key={post.id}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {post.title}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            {post.content.length > 150 
                              ? post.content.substring(0, 150) + '...'
                              : post.content
                            }
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Comment sx={{ fontSize: 16, mr: 0.5 }} />
                              <Typography variant="caption">
                                {post.comments_count || 0}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(post.created_at).toLocaleDateString('pl-PL')}
                            </Typography>
                          </Box>
                        </CardContent>
                        <CardActions>
                          <Button
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => handleViewPost(post.id)}
                          >
                            Zobacz
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <Typography color="text.secondary" textAlign="center">
                Historia aktywności będzie dostępna wkrótce
              </Typography>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Dialog edycji profilu */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edytuj profil</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              {...register('bio')}
              label="O mnie"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              error={!!errors.bio}
              helperText={errors.bio?.message}
              placeholder="Napisz coś o sobie..."
            />
            <TextField
              {...register('location')}
              label="Lokalizacja"
              fullWidth
              margin="normal"
              error={!!errors.location}
              helperText={errors.location?.message}
              placeholder="np. Warszawa, Polska"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Anuluj</Button>
            <Button type="submit" variant="contained">Zapisz</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;
