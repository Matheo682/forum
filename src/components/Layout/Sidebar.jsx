import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Chip,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search,
  ExpandLess,
  ExpandMore,
  Category,
  DirectionsCar,
  Clear,
  FilterList,
} from '@mui/icons-material';

const Sidebar = ({ 
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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedBrands, setExpandedBrands] = useState({});

  const handleCategoryExpand = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleBrandExpand = (brandId) => {
    setExpandedBrands(prev => ({
      ...prev,
      [brandId]: !prev[brandId]
    }));
  };

  if (isMobile) {
    return null; // Na mobile będzie hamburger menu
  }

  return (
    <Box sx={{ width: 320, mr: 3 }}>
      {/* Wyszukiwarka */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ 
            display: 'flex', 
            alignItems: 'center',
            color: theme.palette.primary.main,
            fontWeight: 600
          }}>
            <Search sx={{ mr: 1 }} />
            Wyszukaj
          </Typography>
          <TextField
            fullWidth
            placeholder="Szukaj postów..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ mb: 1 }}
          />
          {(searchTerm || selectedCategory || selectedBrand) && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Aktywne filtry
              </Typography>
              <IconButton size="small" onClick={resetFilters} sx={{ color: theme.palette.secondary.main }}>
                <Clear />
              </IconButton>
            </Box>
          )}
          {searchTerm && (
            <Chip 
              label={`"${searchTerm}"`} 
              size="small" 
              onDelete={() => setSearchTerm('')}
              sx={{ mr: 1, mt: 1 }}
            />
          )}
        </CardContent>
      </Card>

      {/* Kategorie - drzewko */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ pb: 1 }}>
          <Typography variant="h6" gutterBottom sx={{ 
            display: 'flex', 
            alignItems: 'center',
            color: theme.palette.primary.main,
            fontWeight: 600
          }}>
            <Category sx={{ mr: 1 }} />
            Kategorie
          </Typography>
          <List dense>
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => setSelectedCategory('')}
                selected={!selectedCategory}
                sx={{ 
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main + '20',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main + '30',
                    }
                  }
                }}
              >
                <ListItemText 
                  primary="Wszystkie kategorie" 
                  primaryTypographyProps={{ 
                    fontWeight: !selectedCategory ? 600 : 400,
                    color: !selectedCategory ? theme.palette.primary.main : 'inherit'
                  }}
                />
              </ListItemButton>
            </ListItem>
            {categories.map((category) => (
              <React.Fragment key={category.id}>
                <ListItem disablePadding>
                  <ListItemButton 
                    onClick={() => setSelectedCategory(category.id)}
                    selected={selectedCategory === category.id}
                    sx={{ 
                      borderRadius: 2,
                      mb: 0.5,
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.primary.main + '20',
                        '&:hover': {
                          backgroundColor: theme.palette.primary.main + '30',
                        }
                      }
                    }}
                  >
                    <ListItemText 
                      primary={category.name}
                      primaryTypographyProps={{ 
                        fontWeight: selectedCategory === category.id ? 600 : 400,
                        color: selectedCategory === category.id ? theme.palette.primary.main : 'inherit'
                      }}
                    />
                    {category.subcategories && category.subcategories.length > 0 && (
                      <IconButton 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCategoryExpand(category.id);
                        }}
                      >
                        {expandedCategories[category.id] ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    )}
                  </ListItemButton>
                </ListItem>
                {category.subcategories && (
                  <Collapse in={expandedCategories[category.id]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: 2 }}>
                      {category.subcategories.map((subcategory) => (
                        <ListItem key={subcategory.id} disablePadding>
                          <ListItemButton 
                            onClick={() => setSelectedCategory(subcategory.id)}
                            selected={selectedCategory === subcategory.id}
                            sx={{ 
                              borderRadius: 2,
                              mb: 0.5,
                              py: 0.5,
                              '&.Mui-selected': {
                                backgroundColor: theme.palette.secondary.main + '20',
                              }
                            }}
                          >
                            <ListItemText 
                              primary={subcategory.name}
                              primaryTypographyProps={{ 
                                fontSize: '0.875rem',
                                fontWeight: selectedCategory === subcategory.id ? 600 : 400,
                                color: selectedCategory === subcategory.id ? theme.palette.secondary.main : 'inherit'
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Marki - drzewko */}
      <Card>
        <CardContent sx={{ pb: 1 }}>
          <Typography variant="h6" gutterBottom sx={{ 
            display: 'flex', 
            alignItems: 'center',
            color: theme.palette.primary.main,
            fontWeight: 600
          }}>
            <DirectionsCar sx={{ mr: 1 }} />
            Marki
          </Typography>
          <List dense>
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => setSelectedBrand('')}
                selected={!selectedBrand}
                sx={{ 
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main + '20',
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main + '30',
                    }
                  }
                }}
              >
                <ListItemText 
                  primary="Wszystkie marki" 
                  primaryTypographyProps={{ 
                    fontWeight: !selectedBrand ? 600 : 400,
                    color: !selectedBrand ? theme.palette.primary.main : 'inherit'
                  }}
                />
              </ListItemButton>
            </ListItem>
            {brands.map((brand) => (
              <React.Fragment key={brand.id}>
                <ListItem disablePadding>
                  <ListItemButton 
                    onClick={() => setSelectedBrand(brand.id)}
                    selected={selectedBrand === brand.id}
                    sx={{ 
                      borderRadius: 2,
                      mb: 0.5,
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.secondary.main + '20',
                        '&:hover': {
                          backgroundColor: theme.palette.secondary.main + '30',
                        }
                      }
                    }}
                  >
                    <ListItemText 
                      primary={brand.brand_name}
                      primaryTypographyProps={{ 
                        fontWeight: selectedBrand === brand.id ? 600 : 400,
                        color: selectedBrand === brand.id ? theme.palette.secondary.main : 'inherit'
                      }}
                    />
                    {brand.models && brand.models.length > 0 && (
                      <IconButton 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBrandExpand(brand.id);
                        }}
                      >
                        {expandedBrands[brand.id] ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    )}
                  </ListItemButton>
                </ListItem>
                {brand.models && (
                  <Collapse in={expandedBrands[brand.id]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: 2 }}>
                      {brand.models.map((model) => (
                        <ListItem key={model.id} disablePadding>
                          <ListItemButton 
                            sx={{ 
                              borderRadius: 2,
                              mb: 0.5,
                              py: 0.5,
                            }}
                          >
                            <ListItemText 
                              primary={model.model_name}
                              primaryTypographyProps={{ 
                                fontSize: '0.875rem',
                                color: 'text.secondary'
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Sidebar;
