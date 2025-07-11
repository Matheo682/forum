import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Pagination,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../store/postsSlice';
import { fetchCategories } from '../store/categoriesSlice';
import { fetchBrands } from '../store/carsSlice';
import { ROUTES, TEXTS } from '../constants';
import Sidebar from '../components/Layout/Sidebar';
import MobileFilters from '../components/Layout/MobileFilters';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { 
    posts, 
    loading: postsLoading, 
    error: postsError 
  } = useSelector((state) => state.posts);
  
  const { 
    categories, 
    loading: categoriesLoading 
  } = useSelector((state) => state.categories);
  
  const { 
    brands, 
    loading: brandsLoading 
  } = useSelector((state) => state.cars);
  
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Filtry
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = isMobile ? 8 : 6;

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchCategories());
    dispatch(fetchBrands());
  }, [dispatch]);

  // Filtrowanie postów
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.head?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || post.category_id === selectedCategory;
    const matchesBrand = !selectedBrand || post.car_brand_id === selectedBrand;
    
    return matchesSearch && matchesCategory && matchesBrand;
  });

  // Paginacja
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedBrand('');
    setCurrentPage(1);
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

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || '';
  };

  const getBrandName = (brandId) => {
    const brand = brands.find(br => br.id === brandId);
    return brand?.brand_name || '';
  };

  if (postsLoading && posts.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: 'calc(100vh - 120px)',
        px: 3
      }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: 'calc(100vh - 64px)',
      px: { xs: 2, md: 4 },
      py: 3,
      maxWidth: '100vw',
      overflow: 'hidden'
    }}>
      {/* Sidebar - tylko desktop */}
      {!isMobile && (
        <Sidebar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          categories={categories}
          brands={brands}
          resetFilters={resetFilters}
        />
      )}

      {/* Główny obszar treści */}
      <Box sx={{ 
        flex: 1,
        minWidth: 0,
        maxWidth: isMobile ? '100%' : 'none',
        width: '100%',
      }}>
        {/* Nagłówek */}
        <Box sx={{ 
          mb: 4, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'flex-start' : 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 2
        }}>
          <Box>
            <Typography variant={isMobile ? "h4" : "h3"} component="h1" gutterBottom sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            }}>
              {TEXTS.APP_NAME}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Najnowsze posty na forum motoryzacyjnym
            </Typography>
            {!isMobile && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'postów'}
              </Typography>
            )}
          </Box>
          {isAuthenticated && (
            <Button
              variant="contained"
              startIcon={<Add />}
              component={Link}
              to={ROUTES.CREATE_POST}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
                minWidth: isMobile ? '100%' : 'auto',
                py: 1.5,
                px: 3,
                fontWeight: 600,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {TEXTS.POSTS.CREATE_POST}
            </Button>
          )}
        </Box>

        {/* Komunikaty o błędach */}
        {postsError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {postsError}
          </Alert>
        )}

        {/* Lista postów lub brak postów */}
        {currentPosts.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 6 }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {TEXTS.POSTS.NO_POSTS}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {(searchTerm || selectedCategory || selectedBrand) 
                  ? 'Spróbuj zmienić filtry wyszukiwania'
                  : 'Bądź pierwszy i napisz nowy post!'
                }
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Siatka postów */}
            <Grid container spacing={3}>
              {currentPosts.map((post) => (
                <Grid 
                  size={{ xs: 12 }}
                  key={post.id}
                >
                  <Card sx={{ 
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': { 
                      boxShadow: `0 12px 32px rgba(100, 116, 139, 0.3)`,
                      transform: 'translateY(-2px)',
                      border: `1px solid ${theme.palette.primary.main}`,
                    },
                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.surface.main} 100%)`,
                    border: '1px solid rgba(100, 116, 139, 0.2)',
                    transition: 'all 0.3s ease-in-out',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    },
                  }}>
                    <CardContent sx={{ 
                      flex: 1, 
                      pt: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      minWidth: 0,
                    }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography 
                          variant={isMobile ? "h6" : "h5"} 
                          component="h2" 
                          gutterBottom 
                          sx={{ 
                            fontWeight: 600,
                            lineHeight: 1.3,
                            mb: 2,
                            display: '-webkit-box',
                            '-webkit-line-clamp': 2,
                            '-webkit-box-orient': 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          <Link 
                            to={`/post/${post.id}`}
                            style={{ 
                              textDecoration: 'none', 
                              color: 'inherit',
                              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            {post.title}
                          </Link>
                        </Typography>
                        
                        <Typography 
                          variant="body1" 
                          color="text.secondary" 
                          paragraph
                          sx={{
                            display: '-webkit-box',
                            '-webkit-line-clamp': isMobile ? 3 : 2,
                            '-webkit-box-orient': 'vertical',
                            overflow: 'hidden',
                            mb: 3,
                            lineHeight: 1.6,
                          }}
                        >
                          {post.head}
                        </Typography>

                        {/* Tagi */}
                        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {post.category_id && (
                            <Chip 
                              label={getCategoryName(post.category_id)} 
                              color="primary" 
                              size="small"
                              sx={{ fontSize: '0.75rem' }}
                            />
                          )}
                          {post.car_brand_id && (
                            <Chip 
                              label={getBrandName(post.car_brand_id)} 
                              color="secondary" 
                              size="small"
                              sx={{ fontSize: '0.75rem' }}
                            />
                          )}
                        </Box>
                      </Box>

                      {/* Meta informacje i przycisk */}
                      <Box sx={{ 
                        mt: 'auto',
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2,
                        pt: 2,
                        borderTop: '1px solid rgba(100, 116, 139, 0.1)',
                      }}>
                        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 0.5 : 3 }}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Autor:</strong> {post.user?.name || 'Nieznany'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Data:</strong> {formatDate(post.created_at)}
                          </Typography>
                        </Box>
                        
                        <Button 
                          variant="contained"
                          size="small" 
                          component={Link} 
                          to={`/post/${post.id}`}
                          sx={{ 
                            background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
                            color: 'white',
                            fontWeight: 600,
                            px: 3,
                            py: 1,
                            '&:hover': {
                              background: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`,
                              transform: 'translateY(-1px)',
                            },
                            transition: 'all 0.2s ease-in-out',
                          }}
                        >
                          Czytaj więcej
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Paginacja */}
            {totalPages > 1 && (
              <Box sx={{ 
                mt: 6, 
                mb: 4,
                display: 'flex', 
                justifyContent: 'center' 
              }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? "medium" : "large"}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: 2,
                      '&.Mui-selected': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      }
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Mobile Filters - floating button and drawer */}
      <MobileFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
        categories={categories}
        brands={brands}
        resetFilters={resetFilters}
      />
    </Box>
  );
};

export default HomePage;
