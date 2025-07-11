import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Drawer,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  List,
  ListItem,
  Divider,
  Chip,
  useTheme,
} from '@mui/material';
import {
  FilterList,
  Close,
  Search,
  Clear,
} from '@mui/icons-material';

const MobileFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  categories, 
  brands,
  resetFilters
}) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedBrand;

  return (
    <>
      {/* Przycisk do otwierania filtrów */}
      <Box sx={{ 
        position: 'fixed', 
        bottom: 20, 
        right: 20, 
        zIndex: 1000,
        display: { xs: 'block', md: 'none' }
      }}>
        <IconButton
          onClick={() => setIsOpen(true)}
          sx={{
            width: 56,
            height: 56,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: 'white',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            position: 'relative',
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          <FilterList />
          {hasActiveFilters && (
            <Box sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: theme.palette.error.main,
              border: '2px solid white',
            }} />
          )}
        </IconButton>
      </Box>

      {/* Drawer z filtrami */}
      <Drawer
        anchor="bottom"
        open={isOpen}
        onClose={handleClose}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: '80vh',
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.surface.main} 100%)`,
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3 
          }}>
            <Typography variant="h6" sx={{ 
              display: 'flex', 
              alignItems: 'center',
              color: theme.palette.primary.main,
              fontWeight: 600
            }}>
              <FilterList sx={{ mr: 1 }} />
              Filtry
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </Box>

          {/* Aktywne filtry */}
          {hasActiveFilters && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Aktywne filtry
                </Typography>
                <Button 
                  size="small" 
                  onClick={resetFilters}
                  startIcon={<Clear />}
                  sx={{ color: theme.palette.secondary.main }}
                >
                  Wyczyść
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {searchTerm && (
                  <Chip 
                    label={`"${searchTerm}"`} 
                    size="small" 
                    onDelete={() => setSearchTerm('')}
                  />
                )}
                {selectedCategory && (
                  <Chip 
                    label={categories.find(c => c.id === selectedCategory)?.name || 'Kategoria'} 
                    size="small" 
                    onDelete={() => setSelectedCategory('')}
                    color="primary"
                  />
                )}
                {selectedBrand && (
                  <Chip 
                    label={brands.find(b => b.id === selectedBrand)?.brand_name || 'Marka'} 
                    size="small" 
                    onDelete={() => setSelectedBrand('')}
                    color="secondary"
                  />
                )}
              </Box>
              <Divider sx={{ mt: 2 }} />
            </Box>
          )}

          {/* Wyszukiwarka */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Szukaj postów"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
              sx={{ mb: 2 }}
            />
          </Box>

          {/* Kategorie */}
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Kategoria</InputLabel>
              <Select
                value={selectedCategory}
                label="Kategoria"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="">Wszystkie kategorie</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Marki */}
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Marka</InputLabel>
              <Select
                value={selectedBrand}
                label="Marka"
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <MenuItem value="">Wszystkie marki</MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand.id} value={brand.id}>
                    {brand.brand_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Przyciski akcji */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              onClick={resetFilters}
              fullWidth
              startIcon={<Clear />}
            >
              Wyczyść filtry
            </Button>
            <Button
              variant="contained"
              onClick={handleClose}
              fullWidth
            >
              Zastosuj
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default MobileFilters;
